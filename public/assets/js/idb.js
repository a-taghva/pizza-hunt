// create variable to hold db connection
let db;
// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the databse version changes
request.onupgradeneeded = function(e) {
  // save reference to the database
  const db = e.target.result;
  // create an object store (table) called 'new_pizza', set it to have and auto incrementing primary key of sorts
  db.createObjectStore('new_pizza', { autoIncrement: true })
};

// finalize the connection to the database
request.onsuccess = function(e) {
  // this way we're saving reference to db in global variable!!
  db = e.target.result;

  // send all local db data to api
  // **** navigator.onLine returns boolean indicating whether the browser is working online.
  if (navigator.onLine) {
    uploadPizza();
  }
};

request.onerror = function(e) {
  console.log(e.target.errorCode);
};

function saveRecord(record) {
  // open a new transaction with read and write permission
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  const pizzaObjectStore = transaction.objectStore('new_pizza');

  pizzaObjectStore.add(record);
}  

function uploadPizza() {
  // open transaction
  const transaction = db.transaction(["new_pizza"], 'readwrite');

  const pizzaObjectStore = transaction.objectStore("new_pizza");

  const getAll = pizzaObjectStore.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('api/pizzas', {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*', 
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          // open more transaction
          const transaction = db.transaction(["new_pizza"], 'readwrite');
          const pizzaObjectStore = transaction.objectStore('new_pizza');
          pizzaObjectStore.clear();

          alert('All saved pizza has been submitted!');
        })
        .catch(console.log);
    }
  }
}

window.addEventListener('online', uploadPizza);