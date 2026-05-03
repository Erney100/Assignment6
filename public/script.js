// Base API URL
// This points to your backend server
const API = 'http://localhost:4000/jokebook';



/*
-----------------------------------------
LOAD RANDOM JOKE WHEN PAGE STARTS
-----------------------------------------
*/

// This runs automatically when the page loads
// It calls the random joke endpoint
fetch(API + '/random')

  // Convert response into JSON format
  .then(res => res.json())

  // Display random joke on page
  .then(data => {
    document.getElementById('random').innerHTML = `
      <p><strong>${data.setup}</strong></p>
      <p>${data.delivery}</p>
    `;
  })

  // Error handling if random joke fails
  .catch(error => {
    console.log(error);

    document.getElementById('random').innerText =
      'Could not load random joke.';
  });





/*
-----------------------------------------
GET ALL CATEGORIES
-----------------------------------------
*/

// This function gets all categories from database
function getCategories() {

  fetch(API + '/categories')

    // Convert response to JSON
    .then(res => res.json())

    // Display category list
    .then(data => {

      const list =
        document.getElementById('categories');

      // Clear previous categories
      list.innerHTML = '';



      // Loop through all categories
      data.forEach(c => {

        // Create list item
        const li =
          document.createElement('li');

        // Display category name
        li.innerText = c.name;



        // When user clicks category,
        // load jokes from that category
        li.onclick = () => loadCategory(c.name);



        // Add category to page
        list.appendChild(li);
      });
    })


    // Error handling
    .catch(error => {
      console.log(error);
      alert('Could not load categories.');
    });
}





/*
-----------------------------------------
LOAD JOKES FROM CATEGORY
-----------------------------------------
*/

// This function loads jokes from one category
function loadCategory(cat) {

  fetch(API + '/category/' + cat)

    .then(res => res.json())

    .then(data => {

      const display =
        document.getElementById('random');



      // Show category title
      display.innerHTML = `<h2>${cat} Jokes</h2>`;


      // Handle invalid category errors
      if (data.error) {
        display.innerHTML += `<p>${data.error}</p>`;
        return;
      }



      // Loop through all jokes
      data.forEach(joke => {

        display.innerHTML += `
          <div>
            <p><strong>${joke.setup}</strong></p>
            <p>${joke.delivery}</p>
            <hr>
          </div>
        `;
      });
    })


    // Error handling
    .catch(error => {
      console.log(error);
      alert('Could not load jokes.');
    });
}





/*
-----------------------------------------
SEARCH CATEGORY
-----------------------------------------
*/

// Allows user to type category manually
function searchCategory() {

  const val =
    document.getElementById('searchInput')
    .value
    .trim();


  // Prevent empty searches
  if (val === '') {
    alert('Please enter a category.');
    return;
  }


  // Load jokes for searched category
  loadCategory(val);
}





/*
-----------------------------------------
ADD NEW JOKE
-----------------------------------------
*/

// Adds a new joke into database
function addJoke() {

  // Get values from form inputs
  const category =
    document.getElementById('cat')
    .value
    .trim();

  const setup =
    document.getElementById('setup')
    .value
    .trim();

  const delivery =
    document.getElementById('delivery')
    .value
    .trim();



  // Make sure user fills all fields
  if (
    category === '' ||
    setup === '' ||
    delivery === ''
  ) {
    alert('Please fill in all fields.');
    return;
  }



  // Send POST request to backend
  fetch(API + '/add', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },


    // Convert form data into JSON
    body: JSON.stringify({
      category: category,
      setup: setup,
      delivery: delivery
    })
  })


    .then(res => res.json())

    .then(data => {

      alert('Joke added!');


      // Clear form after submission
      document.getElementById('cat').value = '';
      document.getElementById('setup').value = '';
      document.getElementById('delivery').value = '';



      // Reload category to show new joke
      loadCategory(category);
    })


    // Error handling
    .catch(error => {
      console.log(error);
      alert('Could not add joke.');
    });
}