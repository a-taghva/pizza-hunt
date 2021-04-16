// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the databse version changes
request.onupgradeneeded = function(e) {
  // save reference to the database
  const db = e.target.result;
  // create an object store (table) called 'new_pizza', set it to have and auto incrementing primary key of sorts
  db.createObjectStore('new_pizza', { autoIncrement: ture })
};

// finalize the connection to the database
request.onsuccess = function(e) {
  // this way we're saving reference to db in global variable!!
  db = e.target.result;

  // send all local db data to api
  // **** navigator.onLine returns boolean indicating whether the browser is working online.
  if (navigator.onLine) {
    // uploadPizza();
  }
};

request.onerror = function(e) {
  console.log(e.target.errorCode);
};