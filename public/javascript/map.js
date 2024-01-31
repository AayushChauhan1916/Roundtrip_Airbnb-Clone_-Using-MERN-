mapboxgl.accessToken = maptoken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: Listing.geometry.coordinates, // starting position [lng, lat]
// style : "mapbox://styles/mapbox/streets-v12",
zoom: 10// starting zoom
});

const marker1 = new mapboxgl.Marker()
 .setLngLat(Listing.geometry.coordinates)
 .addTo(map);