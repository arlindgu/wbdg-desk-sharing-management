function addMapToDesk(deskElement, latitude, longitude, deskId) {
    var mapId = `map-${deskId}`; // Stelle sicher, dass `deskId` eindeutig und korrekt ist
    var mapContainer = document.createElement('div');
    mapContainer.id = mapId;
    mapContainer.style.height = '150px';
    deskElement.querySelector('.desk-map').appendChild(mapContainer);

    var map = L.map(mapId);
    var marker = L.marker([latitude, longitude]);
    var group = new L.featureGroup([marker]); // Gruppe von Markern erstellen

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);

    map.fitBounds(group.getBounds()); // Karte an Markergruppe anpassen
    map.addLayer(group); // Markergruppe zur Karte hinzufügen
    marker.addTo(map); // Marker zur Karte hinzufügen

    // Unterdrücken des Klickereignisses auf der Karte
    mapContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    const savedCurrency = localStorage.getItem('currency') || 'CHF';
    if (savedCurrency === 'EUR') {
        fetchExchangeRateOnce();
    }
    fetchDesks();
});



function fetchDesks() {
    fetch('https://matthiasbaldauf.com/wbdg24/desks')
        .then(response => response.json())
        .then(desks => updateDeskList(desks))
        .catch(error => console.error('Fehler beim Laden der Schreibtische:', error));
}


function updateDeskList(desks) {
    const deskList = document.querySelector('.desk-list');
    if (!deskList) {
        return; // Wenn das Element nicht existiert, brechen Sie die Funktion ab.
    }
    deskList.innerHTML = '';

    function addDesk(desk) {
        const isAvailable = desk.available === "1";
        const availabilityClass = isAvailable ? 'alert-success' : 'alert-danger';
        const latitude = parseFloat(desk.lat);
        const longitude = parseFloat(desk.lon);

        const deskElement = document.createElement('div');
        deskElement.className = 'desk card clickable';
        deskElement.innerHTML = `
            <div class="card-body">
                <div class="availability-indicator alert ${availabilityClass}" role="alert">
                    ${isAvailable ? 'Verfügbar' : 'Nicht Verfügbar'}
                </div>
                <h2 class="card-title">${desk.name}</h2>
                <h6 class="card-subtitle text-body-secondary" id=${desk.id}>${desk.id}</h6>
                <div class="col">${desk.address}</div>
                <div class="col price">${desk.price} CHF</div>
                <div class="col">${desk.comment || '<i>keine Bemerkungen</i>'}</div>
                <div class="desk-map pt-2 mb-2" style="height: 150px;"></div>
            </div>
        `;

        deskList.appendChild(deskElement).classList.add('desk');
        addMapToDesk(deskElement, latitude, longitude, desk.id);

        deskElement.addEventListener('click', () => {
            console.log('Angeklickte Karte ID:', desk.id);
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