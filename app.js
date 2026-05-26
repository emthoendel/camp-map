const map = L.map('map').setView([42.5, -99], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let allCampgrounds = [];
let markers = [];

Promise.all([
  fetch('data/nebraska.json').then(r => r.json()),
  fetch('data/iowa.json').then(r => r.json()),
  fetch('data/south dakota.json').then(r => r.json()),
  fetch('data/kansas.json').then(r => r.json())
]).then(states => {
  const all = states.flat();
  renderCampgrounds(all);
});

function renderCampgrounds(data) {

  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const list = document.getElementById('campground-list');
  list.innerHTML = '';

  data.forEach(camp => {

    const marker = L.marker([camp.lat, camp.lng])
      .addTo(map)
      .bindPopup(`
        <strong>${camp.name}</strong><br>
        ${camp.town}, ${camp.state}<br>
        Cost: $${camp.cost}<br>
        ${camp.features}<br><br>
        <a href="${camp.website}" target="_blank">
          Website
        </a>
      `);

    markers.push(marker);

    const div = document.createElement('div');
    div.className = 'campground-item';

    div.innerHTML = `
      <h3>${camp.name}</h3>
      <p>
        ${camp.town}, ${camp.state}<br>
        Cost: $${camp.cost}<br>
        ${camp.service}
      </p>
    `;

    div.onclick = () => {
      map.setView([camp.lat, camp.lng], 10);
      marker.openPopup();
    };

    list.appendChild(div);
  });
}

function applyFilters() {

  const search = document
    .getElementById('search')
    .value
    .toLowerCase();

  const freeOnly =
    document.getElementById('freeOnly').checked;

  const under20 =
    document.getElementById('under20').checked;

  let filtered = allCampgrounds.filter(camp => {

    const matchesSearch =
      camp.name.toLowerCase().includes(search) ||
      camp.features.toLowerCase().includes(search);

    const matchesFree =
      !freeOnly || camp.cost === 0;

    const matchesUnder20 =
      !under20 || camp.cost <= 20;

    return (
      matchesSearch &&
      matchesFree &&
      matchesUnder20
    );
  });

  renderCampgrounds(filtered);
}

document
  .getElementById('search')
  .addEventListener('input', applyFilters);

document
  .getElementById('freeOnly')
  .addEventListener('change', applyFilters);

document
  .getElementById('under20')
  .addEventListener('change', applyFilters);
