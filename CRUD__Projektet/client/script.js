todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;

const api = new Api('http://localhost:5000/tasks');


function validateField(field) {

  const { name, value } = field;

  let = validationMessage = '';
  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage =
          "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }

    case 'description': {

      if (value.length > 100) {
        descriptionValid = false;
        validationMessage =
          "Fältet 'Författare' får inte innehålla mer än 100 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validationMessage;

  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid) {
    console.log('Submit');

    saveTask();
  }
}


function saveTask() {

  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    completed: false
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}


function renderList() {
	api.getAll().then((tasks) => {
		todoListElement.innerHTML = "";
		if (tasks && tasks.length > 0) {

      sortByCompletion(tasks);
			tasks.forEach((task) => {
				todoListElement.insertAdjacentHTML("beforeend", renderTask(task));
			});
		}
	});
}

// denna function är till för att kunna rendera listan med böcker till webbsidan.
function renderBookList(bookList) {
  // variabeln existingElement söker efter elementet i boolikst.
  const existingElement = document.querySelector('.book-list');
  const searchContainer  = document.getElementById('searchBox');
// vi kollar om elementen existerar i Var existingElement sedan tas den bort ifrån searchContainer med hjälp av removeChild metoden.
  existingElement && searchContainer .removeChild(existingElement);
  bookList.length > 0 && searchField.value && searchContainer .insertAdjacentHTML('beforeend', BookList(bookList));
// querySelectorAll hämtar alla elment som finns i book-list__item sedan sparas de i variabeln bookElements
  const bookElements = document.querySelectorAll(".book-list__item");

  bookElements.forEach(book => {
    book.addEventListener("click", async () => {
      const details = await getBookDetails(book.id);
      saveBook(details);
    });
  });
}

// syftet med denna kod är att skapa en ny uppgift på servern med information från boken och om det lyckas så uppdatera listan.
async function saveBook({ title, author }) {
// vi lägger vi in dessa i variabeln task och completed som flase.
  const task = { title, description: author, completed: false };
  // Denna rad anropar funktionen från API:et och väntar på att svaret ska komma tillbaka. sedan sparas svaret i variabeln createdTask
  const createdTask = await api.create(task);
  // om createdTask är sant, anropars renderList funktionen.
  if (createdTask) {
    renderList();
  }
}



function renderTask({ id, title, description, completed }) {
	let html = `
    <li class="select-none mt-2 py-2 ${
			completed ? "text-decoration: line-through" : ""
		} border-b border-green-500  ">
      <div class="flex items-center">

      <input type="checkbox" ${
				completed ? "checked" : ""
			} onclick="updateTask(${id}) "id ="checkbox${id}">

      <h3 class="mb-3 flex-1 text-xl font-bold text-sky-500 uppercase">${title}</h3>
        <div>
        <button onclick="deleteTask(${id})" class="inline-block bg-black text-white text-xs border border-black px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;

  description &&
 
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);

  html += `
    </li>`;
  return html;
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}
function updateTask(id) {
	api.update(id).then((result) => renderList());
}

//Funktionen sorterar uppgifter i stigande ordning baserat på completed för varje uppgift.
function sortByCompletion(tasks) {
//sortera tasks arrayen efter completed
  tasks.sort((a, b) => {
//Ifall completed av task a är mindre än b, retunera -1
      if (a.completed < b.completed) {
          return -1;
//Ifall completed av task a är större än b, retunera 1
      } else if (a.completed > b.completed) {
          return 1;
      }
  });
}


renderList();


// hämtar alla böcker från API:et när webbsidan laddas och skapas en sökfunktion då filtrera igenom böckerna och visar endast de som matchar söktermen.
let bookList = [];

window.addEventListener('load', () => {
  getAll().then((apiBooks) => (bookList = apiBooks));
});

searchField.addEventListener('keyup', (e) =>
  renderBookList(
    bookList.filter(({ title, author }) => {
      const searchTerm = e.target.value.toLowerCase();
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  )
);