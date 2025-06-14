function addMapToDesk(deskElement, latitude, longitude, deskId) {
    // Adds a map to the desk element with the given latitude, longitude, and desk ID
    var mapId = `map-${deskId}`; 
    var mapContainer = document.createElement('div');
    mapContainer.id = mapId;
    mapContainer.style.height = '150px';
    deskElement.querySelector('.desk-map').appendChild(mapContainer);

    var map = L.map(mapId);
    var marker = L.marker([latitude, longitude]);
    var group = new L.featureGroup([marker]); 

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);

    map.fitBounds(group.getBounds()); 
    map.addLayer(group); 
    marker.addTo(map); 

    mapContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Executes when the DOM content has been loaded
    const savedCurrency = localStorage.getItem('currency') || 'CHF';
    if (savedCurrency === 'EUR') {
        fetchExchangeRateOnce();
    }
    fetchDesks();
});

function fetchDesks() {
    // Fetches the desks data from the specified URL
    fetch('https://matthiasbaldauf.com/wbdg24/desks')
        .then(response => response.json())
        .then(desks => updateDeskList(desks))
        .catch(error => console.error('Error loading desks:', error));
}

function updateDeskList(desks) {
    // Updates the desk list with the provided desks data
    const deskList = document.querySelector('.desk-list');
    if (!deskList) {
        return; 
    }
    deskList.innerHTML = '';

    function addDesk(desk) {
        // Adds a desk element to the desk list with the provided desk data
        const isAvailable = desk.available === "1";
        const availabilityClass = isAvailable ? 'alert-success' : 'alert-danger';
        const latitude = parseFloat(desk.lat);
        const longitude = parseFloat(desk.lon);

        const deskElement = document.createElement('div');
        deskElement.className = 'desk card clickable';
        deskElement.innerHTML = `
            <div class="card-body">
                <div class="availability-indicator alert ${availabilityClass}" role="alert">${isAvailable ? 'Available' : 'Not Available'}</div>
                <h2 class="card-title">${desk.name}</h2>
                <h6 class="card-subtitle text-body-secondary" id=${desk.id}>${desk.id}</h6>
                <div class="col">${desk.address}</div>
                <div class="col price">${desk.price} CHF</div>
                <div class="col">${desk.comment || '<i>no comments</i>'}</div>
                <div class="desk-map pt-2 mb-2" style="height: 150px;"></div>
            </div>
        `;

        deskList.appendChild(deskElement).classList.add('desk');
        addMapToDesk(deskElement, latitude, longitude, desk.id);

        deskElement.addEventListener('click', () => {
            console.log('clicked desk card:', desk.id);
            openBookingForm(desk.id);
        });
    }

    desks.forEach(desk => {
        addDesk(desk);
    });

    const savedCurrency = localStorage.getItem('currency') || 'CHF';
    if (savedCurrency === 'EUR') {
        updatePricesToEuro();
    }
}