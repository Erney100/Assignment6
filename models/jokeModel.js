// Import Pool from PostgreSQL package
// Pool helps us connect Node.js to our PostgreSQL database
const { Pool } = require('pg');



/*
-----------------------------------------
DATABASE CONNECTION
-----------------------------------------
*/

// Create connection to Neon PostgreSQL database
const pool = new Pool({

  // Database connection string
  // This tells Node where your database is located
  connectionString:
    'postgresql://neondb_owner:npg_yGhI0eERfY4z@ep-misty-darkness-anuup5yb-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',

  // Neon requires SSL connection
  ssl: {
    rejectUnauthorized: false
  }
});



/*
-----------------------------------------
GET ALL CATEGORIES
-----------------------------------------
*/

// This function gets all category names from database
const getCategories = async () => {

  // SQL query selects all category names
  const res = await pool.query(
    'SELECT name FROM categories'
  );

  // Return database rows
  return res.rows;
};





/*
-----------------------------------------
GET JOKES BY CATEGORY
-----------------------------------------
*/

// Gets jokes from a specific category
// Optional limit parameter allows fewer jokes
const getJokesByCategory = async (category, limit) => {

  // Join jokes table with categories table
  // This lets us search by category name instead of category ID
  let query = `
    SELECT setup, delivery 
    FROM jokes
    JOIN categories 
    ON jokes.category_id = categories.id
    WHERE categories.name = $1
  `;


  // If user adds a limit:
  // Example: ?limit=2
  if (limit) {
    query += ` LIMIT ${limit}`;
  }


  // Run SQL query
  const res = await pool.query(
    query,
    [category]
  );

  // Return jokes found
  return res.rows;
};





/*
-----------------------------------------
GET RANDOM JOKE
-----------------------------------------
*/

// Gets one random joke from database
const getRandomJoke = async () => {

  const res = await pool.query(`
    SELECT setup, delivery 
    FROM jokes
    ORDER BY RANDOM()
    LIMIT 1
  `);

  // Return only one joke
  return res.rows[0];
};





/*
-----------------------------------------
ADD NEW JOKE
-----------------------------------------
*/

// Adds a new joke into database
const addJoke = async (category, setup, delivery) => {


  /*
  Step 1:
  Check if category already exists
  */

  let cat = await pool.query(
    'SELECT id FROM categories WHERE name = $1',
    [category]
  );


  let categoryId;



  /*
  Step 2:
  If category doesn't exist,
  create a new category
  */

  if (cat.rows.length === 0) {

    const newCat = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING id',
      [category]
    );

    // Save newly created category ID
    categoryId = newCat.rows[0].id;

  } else {

    // Use existing category ID
    categoryId = cat.rows[0].id;
  }



  /*
  Step 3:
  Insert new joke into jokes table
  */

  await pool.query(
    'INSERT INTO jokes (category_id, setup, delivery) VALUES ($1, $2, $3)',
    [categoryId, setup, delivery]
  );



  /*
  Step 4:
  Return updated jokes for that category
  */

  return getJokesByCategory(category);
};





/*
-----------------------------------------
EXPORT FUNCTIONS
-----------------------------------------
*/

// Export functions so controller can use them
module.exports = {
  getCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke
};