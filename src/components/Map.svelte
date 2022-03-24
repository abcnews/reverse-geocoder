<script lang="ts">
  import { Map, NavigationControl } from 'maplibre-gl';
  import { onMount, onDestroy, setContext } from 'svelte';

  let mapElement: HTMLElement;
  let map: Map;

  setContext('map', {
    getMap: () => map
  });

  onMount(() => {
    // Instantiate the map
    const neoMap = new Map({
      container: mapElement,
      // style: 'https://demotiles.maplibre.org/style.json',
      style: 'https://www.abc.net.au/res/sites/news-projects/map-vector-style-bright/style.json',
      bounds: [113.338953078, -43.6345972634, 153.569469029, -10.6681857235],
      doubleClickZoom: true,
      dragPan: true,
      dragRotate: false
    });

    neoMap.on('load', () => {
      map = neoMap;
      // Add navigation controls
      map.addControl(
        new NavigationControl({
          showCompass: false,
          showZoom: true
        }),
        'top-left'
      );
    });
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>

<div class="map" bind:this={mapElement}>
  {#if map}<slot />{/if}
</div>

<style>
  .map {
    width: 100%;
    height: 50vh;
    position: relative;
    z-index: 1;
    background-color: #ccc;
  }
</style>
