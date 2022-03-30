# Find region

This is a reverse geocoder and geographic region lookup tool.

A reverse geocoder converts geographic coordinates to an address or place (such as electorate, suburb, state, etc).

As well as reverse geocoding it's possible to get the outline(s) of geographic regions and their associated data for a given point or bounding box.

## Usage

All functions require a data source as their first parameter. This should be a URL that points to a [flatgeobuf](https://flatgeobuf.org/) file. See also the [data sources](#data-sources) section below.

### `getFeaturesByBBox(source: string, box: [number, number, number, number]): Promise<FeatureCollection>`

Takes an array definding a bounding box with coordinates in the order west, south, east, north.

Returns a GeoJSON feature collection object including all features that overlap with the bounding box. It's possible this function will return some features that are outside the bounding box. If you need to be certain they're overlapping, you'll need to do an additional check on the returned features.

### `getFeaturesByLonLat(source: string, point: [number, number]): Promise<FeatureCollection>`

Takes an array defining a point on the earths surface with coordinates in the order longitude, latitude.

Returns a GeoJSON FeatureCollection object with any feature from the data source that contain the supplied point.

## How does it work?

This uses the [flatgeobuf](https://www.npmjs.com/package/flatgeobuf) package to query a flatgeobuf file over HTTP. Depending on the gemoetries encoded in the file, it could be very large — in the hundreds of megabytes. But because flatgeobufs are indexed, it's possible to use HTTP range requests to get only the parts of the file of interest.

## Development

## Data sources

The library should work with any flatgeobuf file that has an index and is available over HTTP (keep CORS restrictions in mind).

For convenience a number of Australian focused data sources can be referenced by the keys below rather than a URL.

| key             | description                                  | source                                     |
| --------------- | -------------------------------------------- | ------------------------------------------ |
| `AEC_ELB_2021`  | The 2021 Commonwealth Electorates            | [Australian Electoral Commission][aec]     |
| `ASGS_MB_2021`  | ASGS Mesh Blocks 2021 (GDA2020)              | [Australian Bureau of Statistics][abs]     |
| `ASGS_SA1_2021` | ASGS Statistical Area Level 1 2021 (GDA2020) | [Australian Bureau of Statistics][abs]     |
| `ASGS_SA2_2021` | ASGS Statistical Area Level 2 2021 (GDA2020) | [Australian Bureau of Statistics][abs]     |
| `ASGS_SA3_2021` | ASGS Statistical Area Level 3 2021 (GDA2020) | [Australian Bureau of Statistics][abs]     |
| `ASGS_SA4_2021` | ASGS Statistical Area Level 4 2021 (GDA2020) | [Australian Bureau of Statistics][abs]     |
| `ABC_REGIONS`   | ABC's broadcast regions                      | [Australian Broadcasting Corporation][abc] |

[aec]: https://www.aec.gov.au/Electorates/gis/gis_datadownload.htm
[abs]: https://www.abs.gov.au/statistics/standards/australian-statistical-geography-standard-asgs-edition-3/jul2021-jun2026/access-and-downloads/digital-boundary-files
[abc]: https://stash.abc-dev.net.au/projects/RMP/repos/rmp-regionlocation-data/browse/ABC%20Regions/abc-regions.geojson

### Preparing data sources

If you're familiar with the flatgeobuf format, you can use any method you'd like to create one. As long as it's indexed it should work.

GDAL's [`ogr2ogr`](https://gdal.org/programs/ogr2ogr.html) is a good commandline tool which supports conversion to flatgeobuf from a variety of other formats.

#### ABS GeoPackage example

Download and extract a GeoPackage from the ABS.

```bash
ogr2ogr -f FlatGeobuf ASGS_Ed3_2021_Non_ABS_Structures_GDA2020 ASGS_Ed3_2021_Non_ABS_Structures_GDA2020.gpkg
```

Because GeoPackage files can contain multiple feature layers but flatgeobufs only support a single layer, an output directory must be specified which will contain a flatgeobuf for every layer available in the GeoPackage.

#### AEC Shapefile example

```bash
ogr2ogr -f FlatGeobuf 2021_ELB_region.fgb 2021_ELB_region.shp -nlt PROMOTE_TO_MULTI
```

## Authors

- Simon Elvery ([simon@elvery.net](mailto:simon@elvery.net))
