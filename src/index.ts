import { geojson } from 'flatgeobuf';
import type { BBox, FeatureCollection, Feature } from 'geojson';

export const getFeaturesByBBox = async (source: string, box: BBox): Promise<FeatureCollection> => {
  const [minX, minY, maxX, maxY] = box;

  const res = geojson.deserialize(source, { minX, minY, maxX, maxY });

  // If it's not an iterator, it's a feature collection, so return it.
  if ('type' in res) return res as FeatureCollection;

  // If it is an iterator — turn it into a feature collection.
  const collection: FeatureCollection = { type: 'FeatureCollection', features: [] };

  for await (let feature of res) {
    collection.features.push(feature as Feature);
  }
  return collection;
};
