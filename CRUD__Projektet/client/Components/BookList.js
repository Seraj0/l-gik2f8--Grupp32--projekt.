// funktionen för listan 
const BookList = (bookList) => {
  let html = `<ul class="w-2/4 book-list rounded-md border-2 border-blue-400 bg-white mx-auto">`;
// for-loop för att gå igenom varje element i bookList-arrayen. 
  for (let i = 0; i < bookList.length; i++) {
    html += BookListItem(bookList[i]);
  }
  html += `</ul>`;
  return html;
};