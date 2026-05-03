// This message prints in the terminal when the server first starts
// It helps us know the file is running correctly
console.log("Starting server...");


// Import the Express framework
// Express helps us create routes and handle requests/responses
const express = require('express');


// Create our Express application
// The app variable will be used to configure the server
const app = express();


// Import all routes from jokeRoutes.js
// These routes handle API requests like categories, random jokes, etc.
const routes = require('./routes/jokeRoutes');


// Middleware that allows the server to read JSON data
// This is needed for POST requests when users send data
// Example: adding a new joke
app.use(express.json());


// This tells Express to serve static frontend files
// It looks inside the "public" folder for files like:
// index.html
// style.css
// script.js
app.use(express.static('public'));


// Test route used to make sure the server is working
// If you visit localhost:4000/test in the browser,
// this message should appear
app.get('/test', (req, res) => {
  res.send('This is my current server.js');
});


// Connect all joke-related routes to /jokebook
// Example routes:
// /jokebook/categories
// /jokebook/random
// /jokebook/category/funnyJoke
app.use('/jokebook', routes);


// Start the server on port 4000
// Once running, users can access the app through localhost
app.listen(4000, () => {

  // Print confirmation message in terminal
  console.log('Server running on http://localhost:4000');
});