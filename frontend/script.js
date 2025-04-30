// 🔄 Background image cycling
const images = [
  'HomeImg/img3.jpg',
  'HomeImg/img4.jpg',
  'HomeImg/img5.jpg',
  'HomeImg/img6.jpg'
];
let current = 0;
function changeBackground() {
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    slideshow.style.backgroundImage = `url('${images[current]}')`;
    current = (current + 1) % images.length;
  }
}
setInterval(changeBackground, 5000);
changeBackground();

// 🌍 Load Countries into #countryDropdown
document.addEventListener("DOMContentLoaded", () => {
  fetch('/api/countries')
    .then(res => res.json())
    .then(data => {
      const countryDropdown = document.getElementById('countryDropdown');
      data.forEach(c => {
        const option = document.createElement('option');
        option.value = c.country; // country name
        option.text = c.country;
        countryDropdown.appendChild(option);
      });
    });
});

// 🏙️ Fetch States based on selected country
function fetchStates() {
  const country = document.getElementById('countryDropdown').value;
  fetch(`/api/states/${encodeURIComponent(country)}`)
    .then(res => res.json())
    .then(data => {
      const stateDropdown = document.getElementById('stateDropdown');
      stateDropdown.innerHTML = '<option value="">Select State</option>';
      data.forEach(s => {
        const option = document.createElement('option');
        option.value = s.state;
        option.text = s.state;
        stateDropdown.appendChild(option);
      });
    });
}

// 🏘️ Fetch Cities based on selected state
function fetchCities() {
  const state = document.getElementById('stateDropdown').value;
  fetch(`/api/cities/${encodeURIComponent(state)}`)
    .then(res => res.json())
    .then(data => {
      const cityDropdown = document.getElementById('cityDropdown');
      cityDropdown.innerHTML = '<option value="">Select City</option>';
      data.forEach(c => {
        const option = document.createElement('option');
        option.value = c.city;
        option.text = c.city;
        cityDropdown.appendChild(option);
      });
    });
}

// 🔍 Final fetch when Search button is clicked
function fetchDetails() {
  const country = document.getElementById('countryDropdown').value;
  const state = document.getElementById('stateDropdown').value;
  const city = document.getElementById('cityDropdown').value;

  if (!country || !state || !city) {
    alert("Please select all fields (Country, State, City)");
    return;
  }

  // Get location_id from backend
  fetch(`/api/get-location-id?country=${encodeURIComponent(country)}&state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`)
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        window.location.href = `/search.html?location_id=${data.id}`;
      } else {
        alert("Location not found in database.");
      }
    })
    .catch(err => {
      console.error("Error fetching location ID", err);
      alert("Something went wrong. Try again.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const username = sessionStorage.getItem('username');
  const loginLink = document.getElementById('loginLink');
  const signupLink = document.getElementById('signupLink');
  const userDropdown = document.getElementById('userDropdown');
  const userInitials = document.getElementById('userInitials');
  const dropdownMenu = document.getElementById('dropdownMenu');

  if (username) {
    loginLink.style.display = 'none';
    signupLink.style.display = 'none';
    userDropdown.style.display = 'block';
    userInitials.textContent = username.charAt(0).toUpperCase();

    userInitials.addEventListener('click', () => {
      dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
  }
});

function logout() {
  sessionStorage.removeItem('username');
  window.location.href = '/home.html';
}
