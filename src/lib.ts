import { deserialize } from 'flatgeobuf/lib/mjs/geojson.js';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import type { BBox, FeatureCollection, Position } from 'geojson';
import { sources } from './constants';

/*
 * This function does the heavy lifting (or at least passes it off to flatgeobuf).
 */
export const getFeaturesByBBox = async (source: string, box: BBox): Promise<FeatureCollection> => {
  // If the source is a key in the sources enum, construct the right URL
  if (source in sources) {
    source = 'https://www.abc.net.au/res/sites/news-projects/reverse-geocoder/data/' + sources[source];
  }

  // After this point we assume 'source' is a URL.

  const [minX, minY, maxX, maxY] = box;

  const res = deserialize(source, { minX, minY, maxX, maxY });

  // If it's not an iterator, it's a feature collection, so return it.
  if ('type' in res) return res;

  // If it is an iterator — turn it into a feature collection.
  const collection: FeatureCollection = { type: 'FeatureCollection', features: [] };

  for await (let feature of res) {
    collection.features.push(feature);
  }
  return collection;
};

/*
 * Find features that contain a given lon/lat. This filters all the *possible* features returned by
 * `getFeaturesByBBox` to only those that contain the supplied point.
 */
export const getFeaturesByLonLat = async (source: string, point: Position): Promise<FeatureCollection> => {
  const collection = await getFeaturesByBBox(source, [point[0], point[1], point[0], point[1]]);
  return {
    ...collection,
    features: collection.features.filter(
      d =>
        (d.geometry.type === 'Polygon' || d.geometry.type === 'MultiPolygon') &&
        booleanPointInPolygon(point, d.geometry)
    )
  };
};
