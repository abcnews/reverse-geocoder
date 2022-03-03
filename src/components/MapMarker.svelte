<script lang="ts">
	import { getContext } from 'svelte';
	import maplibre from 'maplibre-gl';
	import type { Position } from 'geojson';

	const { Marker } = maplibre;
	const { getMap } = getContext('map');

	const map = getMap();

	export let location: Position;

	// Add a marker
	const marker = new Marker()
		.setLngLat([location[0], location[1]])
		.addTo(map)
		.setDraggable(true)
		.on('dragend', (e) => {
			const { lng, lat } = e.target.getLngLat();
			location = [lng, lat];
		});
</script>
