// funktionen BookListItem som berör elementen i listan 
const BookListItem = (book) => {
  
  let html = `<li id="${book.id}"
                class="mx-auto book-list__item mb-1  last:mb-0 p-2 text-stone-900 last:border-b-0 border-b border-blue-900 cursor-pointer">
              ${book.author} - ${book.title} 
              </li>`;
              return html;
};