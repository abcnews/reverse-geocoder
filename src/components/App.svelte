<script lang="ts">
  import type { Position, FeatureCollection } from 'geojson';
  import Map from './Map.svelte';
  import MapMarker from './MapMarker.svelte';
  import MapFeatureCollection from './MapFeatureCollection.svelte';
  import { getFeaturesByLonLat } from '../lib';

  type Dataset = { name: string; source: string; nameProp: string };

  const datasets: Dataset[] = [
    {
      name: 'Federal Electorate',
      source: 'AEC_ELB_2021',
      nameProp: 'Elect_div'
    },
    {
      name: 'Mesh Block',
      source: 'ASGS_MB_2021',
      nameProp: 'MB_CODE_2021'
    },
    {
      name: 'Statistical Areal 1',
      source: 'ASGS_SA1_2021',
      nameProp: 'SA1_CODE_2021'
    },
    {
      name: 'Statistical Areal 2',
      source: 'ASGS_SA2_2021',
      nameProp: 'SA2_NAME_2021'
    },
    {
      name: 'Statistical Areal 3',
      source: 'ASGS_SA3_2021',
      nameProp: 'SA3_NAME_2021'
    },
    {
      name: 'Statistical Areal 4',
      source: 'ASGS_SA4_2021',
      nameProp: 'SA4_NAME_2021'
    },
    {
      name: 'ABC Region',
      source: 'ABC_REGIONS',
      nameProp: 'regionName'
    }
  ];

  let dataset: Dataset = datasets[0];

  let position: Position = [153.021072, -27.47];

  let collection: FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  $: getFeaturesByLonLat(dataset.source, position).then(c => (collection = c));
</script>

<div>
  <h1>Reverse Geocoder</h1>

  <Map>
    <MapMarker bind:location={position} />
    <MapFeatureCollection name="features" bind:features={collection} />
  </Map>

  <p>
    The marker is in the <strong>{collection.features[0]?.properties?.[dataset.nameProp] || 'unknown'}</strong>
    <select id="region-type" bind:value={dataset}>
      {#each datasets as dataset}
        <option value={dataset}>{dataset.name}</option>
      {/each}
    </select>. Drag it around to see where you land.
  </p>
</div>

<style lang="scss">
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
    background-color: #3178c7;
  }
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    min-height: 320px;

    color: #fff;
    text-align: center;
  }

  h1 {
    margin: 1em;

    font-size: 24px !important;
    font-weight: normal !important;
    line-height: normal !important;
    letter-spacing: normal !important;
  }
</style>
