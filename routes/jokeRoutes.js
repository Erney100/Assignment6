// Import Express so we can create routes
const express = require('express');


// Create a router object
// Router helps organize all joke-related routes separately
const router = express.Router();


// Import the controller file
// The controller contains the actual logic for each route
const controller = require('../controllers/jokeController');



/*
-----------------------------------------
GET ROUTES
-----------------------------------------
*/


// Route to get all available joke categories
// Example URL:
// http://localhost:4000/jokebook/categories
router.get('/categories', controller.getCategories);


// Route to get all jokes from a specific category
// :category is a route parameter (dynamic value)
//
// Example:
// http://localhost:4000/jokebook/category/funnyJoke
//
// If user searches for "funnyJoke",
// it sends that category name to the controller
router.get('/category/:category', controller.getJokesByCategory);


// Route to get one random joke from the database
//
// Example:
// http://localhost:4000/jokebook/random
router.get('/random', controller.getRandomJoke);



/*
-----------------------------------------
POST ROUTES
-----------------------------------------
*/


// Route to add a new joke to the database
// This expects JSON data in the request body
//
// Example:
// {
//   "category": "funnyJoke",
//   "setup": "Why did the student bring a ladder?",
//   "delivery": "Because they wanted higher education."
// }
router.post('/add', controller.addJoke);



// Export router so server.js can use these routes
module.exports = router;