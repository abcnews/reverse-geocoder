<script lang="ts">
	import type { FeatureCollection } from 'geojson';

	import { getContext } from 'svelte';
	const { getMap } = getContext('map');
	const map = getMap();

	export let features: FeatureCollection;
	export let name: string;

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

	$: console.log('features :>> ', features);

	$: map.getSource(name).setData(features);
</script>
