<script lang="ts">
  import { run } from 'svelte/legacy';

  import type { FeatureCollection } from 'geojson';

  import { getContext } from 'svelte';
  const { getMap } = getContext('map');
  const map = getMap();

  interface Props {
    features: FeatureCollection;
    name: string;
  }

  let { features, name }: Props = $props();

  // Feature collection
  map.addSource(name, {
    type: 'geojson',
    data: features
  });

  map.addLayer({
    id: name,
    type: 'fill',
    source: name,
    paint: {
      'fill-color': '#088',
      'fill-opacity': 0.8
    }
  });

  run(() => {
    map.getSource(name).setData(features);
  });
</script>
