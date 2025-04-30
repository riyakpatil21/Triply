document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('location_id');
  
    if (!locationId) {
      document.getElementById('accommodation-list').innerHTML = '<p style="color:red;">Missing location ID.</p>';
      return;
    }
  
    fetch(`/api/accommodation?location_id=${locationId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load accommodation data");
        return res.json();
      })
      .then(data => {
        const container = document.getElementById('accommodation-list');
        container.innerHTML = '';
        if (data.length === 0) {
          container.innerHTML = '<p>No accommodations found for this location.</p>';
          return;
        }
        data.forEach(acc => {
          container.innerHTML += `
            <div class="tourist-card">
              <img src="Images/accom/${acc.image_url}" alt="${acc.name}" />
              <div class="info">
                <h3>${acc.name}</h3>
                <p class="rating">⭐⭐⭐⭐☆</p>
                <p>${acc.description}</p>
              </div>
            </div>
          `;
        });
      })
      .catch(err => {
        console.error('Fetch error:', err);
        document.getElementById('accommodation-list').innerHTML = '<p style="color:red;">Error loading data.</p>';
      });
  });
  