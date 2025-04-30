document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('location_id');
  
    if (!locationId) {
      document.getElementById('transport-list').innerHTML = '<p style="color:red;">Missing location ID.</p>';
      return;
    }
  
    fetch(`/api/transport?location_id=${locationId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then(data => {
        const container = document.getElementById('transport-list');
        container.innerHTML = '';
        if (data.length === 0) {
          container.innerHTML = '<p>No transport options found for this location.</p>';
          return;
        }
  
        data.forEach(option => {
          container.innerHTML += `
            <div class="tourist-card">
              <img src="Images/transport/${option.image_url}" alt="${option.mode}" />
              <div class="info">
                <h3>${option.mode} - ${option.provider}</h3>
                <p>${option.details}</p>
              </div>
            </div>
          `;
        });
      })
      .catch(err => {
        console.error('Fetch error:', err);
        document.getElementById('transport-list').innerHTML = '<p style="color:red;">Error loading data.</p>';
      });
  });
  