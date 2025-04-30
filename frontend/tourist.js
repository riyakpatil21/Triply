

  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('location_id');
  
    if (!locationId) {
      document.getElementById('tourist-list').innerHTML = '<p style="color:red;">Missing location ID.</p>';
      return;
    }
  
    fetch(`/api/tourist-places?location_id=${locationId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then(data => {
        const container = document.getElementById('tourist-list');
        container.innerHTML = '';
        if (data.length === 0) {
          container.innerHTML = '<p>No tourist places found for this location.</p>';
          return;
        }
        data.forEach(place => {
          container.innerHTML += `
            <div class="tourist-card">
              <img src="Images/places/${place.image_url}" alt="${place.name}">
              <div class="info">
                <h3>${place.name}</h3>
                <p class="rating">⭐⭐⭐⭐☆</p>
                <p>${place.description}</p>
              </div>
            </div>
          `;
        });
      })
      .catch(err => {
        console.error('Fetch error:', err);
        document.getElementById('tourist-list').innerHTML = '<p style="color:red;">Error loading data.</p>';
      });
  });
  