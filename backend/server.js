const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/Images', express.static(path.join(__dirname, '../frontend/Images')));



// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'riya',
  password: 'riya21',
  database: 'user_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// Routes to serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/home.html')));
app.get('/home.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/home.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/login.html')));
app.get('/signup.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/signup.html')));
app.get('/search.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/search.html')));
app.get('/tourist.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/tourist.html')));
app.get('/accommodation.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/accommodation.html')));
app.get('/guide.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/guide.html')));
app.get('/transport.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/transport.html')));



// LOGIN
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).send('Server error');
    if (results.length > 0) {
      // Redirect to home with username in query to be saved in sessionStorage on frontend
      res.redirect(`/home.html?username=${encodeURIComponent(username)}`);
    } else {
      res.send(`<h2 style="text-align:center;color:red;margin-top:20px;">❌ Invalid credentials. <a href="/login.html">Try again</a></h2>`);
    }
  });
});

// SIGNUP
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE username = ?';

  db.query(checkQuery, [username], (err, results) => {
    if (err) return res.status(500).send('Server error');
    if (results.length > 0) {
      return res.send('<h2 style="text-align:center;color:red;">User already exists. <a href="/login.html">Login</a></h2>');
    }

    const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertQuery, [username, password], (err) => {
      if (err) return res.status(500).send('Error signing up');
      res.send('<h2 style="text-align:center;color:green;">✅ Signup successful! <a href="/login.html">Login now</a></h2>');
    });
  });
});

// Get location_id by names
app.get('/api/get-location-id', (req, res) => {
  const { country, state, city } = req.query;
  db.query(
    'SELECT id FROM locations WHERE country = ? AND state = ? AND city = ?',
    [country, state, city],
    (err, results) => {
      if (err || results.length === 0) return res.status(404).send('Location not found');
      res.json(results[0]); // { id: ... }
    }
  );
});

// Get tourist places by location_id
app.get('/api/tourist-places', (req, res) => {
  const locationId = req.query.location_id;
  if (!locationId) return res.status(400).send('Missing location_id');

  db.query('SELECT * FROM tourist_places WHERE location_id = ?', [locationId], (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

// Get accomodations by location_id
app.get('/api/accommodation', (req, res) => {
  const locationId = req.query.location_id;
  if (!locationId) return res.status(400).send('Missing location ID');

  db.query(`SELECT * FROM accommodation WHERE location_id = ?`, [locationId], (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

//Get guides by location_id
app.get('/api/guides', (req, res) => {
  const locationId = req.query.location_id;
  if (!locationId) return res.status(400).send('Missing location ID');

  db.query(`SELECT * FROM guides WHERE location_id = ?`, [locationId], (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});

//Get transport by location_id
app.get('/api/transport', (req, res) => {
  const locationId = req.query.location_id;
  if (!locationId) return res.status(400).send('Missing location ID');

  const query = `SELECT * FROM transport WHERE location_id = ?`;
  db.query(query, [locationId], (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.json(results);
  });
});



// Location Dropdowns
app.get('/api/countries', (req, res) => {
  db.query('SELECT DISTINCT country FROM locations', (err, results) => {
    if (err) return res.status(500).send('Error');
    res.json(results);
  });
});

app.get('/api/states/:country', (req, res) => {
  db.query('SELECT DISTINCT state FROM locations WHERE country = ?', [req.params.country], (err, results) => {
    if (err) return res.status(500).send('Error');
    res.json(results);
  });
});

app.get('/api/cities/:state', (req, res) => {
  db.query('SELECT DISTINCT city FROM locations WHERE state = ?', [req.params.state], (err, results) => {
    if (err) return res.status(500).send('Error');
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
