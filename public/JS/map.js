const map = L.map('map').setView([coordinates[1], coordinates[0]], 9); // [latitude, longitude]

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

console.log(coordinates);

// Add a marker at the coordinates
const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map);

// Bind a popup to the marker
marker.bindPopup(`<b>${listingTitle}</b>`).openPopup(); 