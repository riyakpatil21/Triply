document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const locationId = params.get('location_id');
  
    if (!locationId) {
      document.getElementById('tourist-list').innerHTML = '<p style="color:red;">Missing location ID.</p>';
      return;
    }
  
    fetch(`/api/guides?location_id=${locationId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load guides");
        return res.json();
      })
      .then(data => {
        const container = document.getElementById('tourist-list');
        container.innerHTML = '';
        if (data.length === 0) {
          container.innerHTML = '<p>No guides available for this location.</p>';
          return;
        }
  
        data.forEach(guide => {
          container.innerHTML += `
            <div class="tourist-card">
              <img src="Images/guides/${guide.image_url}" alt="${guide.name}">
              <div class="info">
                <h3>${guide.name}</h3>
                <p><strong>Language:</strong> ${guide.language}</p>
                <p><strong>Experience:</strong> ${guide.experience}</p>
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
  