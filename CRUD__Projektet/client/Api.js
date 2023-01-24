const URL = 'http://localhost:5000/tasks';

class Api {
  constructor(URL) {
    this.URL = URL;
  }
  
// Create metoden 
  create(data) {
    const JSONData = JSON.stringify(data);
    console.log(`Sending ${JSONData} to ${this.URL}`);
    const request = new Request(this.URL, {
        method: "POST",
        body: JSONData,
        headers: {
            "content-type": "application/json",
        },
    });

    return fetch(request)
    // konverteras svaret till JSON med hjälp av result.json()
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err));
  }

  getAll() {
    return fetch(this.URL)
        .then((result) => result.json())
        .then((data) => data)
        .catch((err) => console.log(err));
  }

  update(id) {
    return fetch(`${this.URL}/${id}`, {method: 'PATCH'})
      .then((result) => result.json())
      .catch((err) => console.log(err));
  }

  remove(id) {
    return fetch(`${this.URL}/${id}`, {method: 'DELETE'})
      .then((result) => result)
      .catch((err) => console.log(err));
  }
}

// bok API:Et 
const booksApi = 'https://gik2f8-labs.herokuapp.com/books';

// Funktioner som utför HTTP-begäran.
// try och catch för enkel felhantering.
async function getAllBooks() {
  try {
    const result = await fetch(booksApi);
  // Resultat retuneras som JSON-data
    return await result.json();
  } catch (e) {
    return e;
  }
}
// här hämtas Data ur URl:en återigen med hjälp av fetch-Metoden
async function getAll() {
  const result = await fetch(booksApi)
    .then((result) => result.json())
    .catch((e) => e);
  return result;
}

// retunerar titel och författare för boken utifrån id:t, 
// därför finns den i functionen som Parameter.
async function getBookDetails(id) {
  try {
    const result = await fetch(booksApi + "/" + id);
    const json = await result.json();
    return { title: json.title, author: json.author };
  } catch (e) {
    return e;
  }
}

