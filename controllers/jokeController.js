// Import the model file
// The model handles all database queries
const model = require('../models/jokeModel');



/*
-----------------------------------------
GET ALL CATEGORIES
-----------------------------------------
*/

// This function gets all available joke categories
// Example route:
// GET /jokebook/categories
exports.getCategories = async (req, res) => {

  // Call the model function to get categories from database
  const categories = await model.getCategories();

  // Send categories back as JSON response
  res.json(categories);
};




/*
-----------------------------------------
GET JOKES BY CATEGORY
-----------------------------------------
*/

// This function gets jokes from a specific category
// Example:
// /jokebook/category/funnyJoke
exports.getJokesByCategory = async (req, res) => {

  // Get category from URL parameter
  const { category } = req.params;

  // Get optional limit from query string
  // Example:
  // ?limit=2
  const { limit } = req.query;

  // Ask model for jokes in this category
  let jokes = await model.getJokesByCategory(category, limit);



  /*
  -----------------------------------------
  EXTRA CREDIT SECTION
  -----------------------------------------
  */

  // If no jokes are found in our database:
  if (jokes.length === 0) {

    try {

      // Search external JokeAPI
      // amount=3 means get up to 3 jokes
      // type=twopart ensures setup + delivery jokes only
      // blacklistFlags removes inappropriate content
      const response = await fetch(
        `https://sv443.net/jokeapi/v2/joke/${category}?amount=3&type=twopart&blacklistFlags=nsfw,religious,political,racist,sexist,explicit`
      );

      // Convert API response into JSON
      const data = await response.json();

      console.log("JokeAPI response:", data);


      // If JokeAPI says category doesn't exist
      if (data.error) {
        return res.status(404).json({
          error: data.message || 'Category not found in JokeAPI'
        });
      }


      // If API returns multiple jokes
      if (data.jokes) {

        // Loop through each joke
        for (let j of data.jokes) {

          // Save each joke into our own database
          await model.addJoke(
            category,
            j.setup,
            j.delivery
          );
        }
      }

      // If API returns only one joke
      else if (data.setup && data.delivery) {

        // Save that joke to database
        await model.addJoke(
          category,
          data.setup,
          data.delivery
        );
      }


      // Get updated jokes from database after saving
      jokes = await model.getJokesByCategory(category);

      // Return updated joke list
      return res.json(jokes);

    }

    // Handle API errors
    catch (err) {
      console.log("External API error:", err);

      return res.status(500).json({
        error: 'Could not fetch jokes from external API'
      });
    }
  }


  // If jokes were already found in database,
  // return them normally
  res.json(jokes);
};





/*
-----------------------------------------
GET RANDOM JOKE
-----------------------------------------
*/

// Returns one random joke from database
// Example:
// GET /jokebook/random
exports.getRandomJoke = async (req, res) => {

  // Get random joke from model
  const joke = await model.getRandomJoke();

  // Return joke to user
  res.json(joke);
};





/*
-----------------------------------------
ADD NEW JOKE
-----------------------------------------
*/

// Adds a new joke to database
// Example:
// POST /jokebook/add
exports.addJoke = async (req, res) => {

  // Get values from request body
  const { category, setup, delivery } = req.body;


  // Validate that all required fields exist
  if (!category || !setup || !delivery) {

    return res.status(400).json({
      error: 'Missing fields'
    });
  }


  // Save joke into database
  const jokes = await model.addJoke(
    category,
    setup,
    delivery
  );


  // Return updated category jokes
  res.json(jokes);
};