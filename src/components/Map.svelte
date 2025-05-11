<script lang="ts">
  import { Map, NavigationControl } from 'maplibre-gl';
  import { onDestroy, setContext } from 'svelte';
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  let mapElement: HTMLElement | undefined = $state();
  let map: Map | undefined = $state();

  setContext('map', {
    getMap: () => map
  });

  let neoMap = $derived.by(() => {
    const mapInstance =
      mapElement &&
      new Map({
        container: mapElement,
        // style: 'https://demotiles.maplibre.org/style.json',
        style: 'https://www.abc.net.au/res/sites/news-projects/map-vector-style-bright/style.json',
        bounds: [113.338953078, -43.6345972634, 153.569469029, -10.6681857235],
        doubleClickZoom: true,
        dragPan: true,
        dragRotate: false
      });

    return mapInstance;
  });

  $effect(() => {
    if (neoMap) {
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
    }
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });
</script>

<div class="map" bind:this={mapElement}>
  {#if map}{@render children?.()}{/if}
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
