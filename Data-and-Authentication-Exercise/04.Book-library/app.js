function booksDB() {
   let submitBtn = document.getElementById('new-book').getElementsByTagName('button')[0];
   let editBtn = document.getElementById('new-book').getElementsByTagName('button')[1];
   let bookKey = '';
   let editingSate = false;
   let loadAllBooks = document.getElementById('loadBooks');
   let booksTable = document.getElementsByTagName('tbody')[0];
   booksTable.innerHTML = '';

   loadAllBooks.addEventListener('click', listAllBooks);
   submitBtn.addEventListener('click', createNewBook);
   editBtn.addEventListener('click', updateBook);
   booksTable.addEventListener('click', updateDeleteBook);

   async function updateBook(e) {
       e.preventDefault();
       let bodyRequest = getFormInformation();
       await sendRequest(`http://localhost:3030/jsonstore/collections/books/${bookKey}`, 'PUT', JSON.stringify(bodyRequest));
       setFormInformation({ author: '', isbn: '', title: '', tags: [] });
       listAllBooks();
       submitBtn.style.display = 'block';
       editBtn.style.display = 'none';
       editingSate = false;
   }

   function updateDeleteBook(e) {
       let buttons = {
           'Edit': () => {
               let bookInfo = {
                   author: e.target.parentNode.parentNode.children[1].textContent,
                   isbn: e.target.parentNode.parentNode.children[2].textContent,
                   title: e.target.parentNode.parentNode.children[0].textContent,
                   tags: e.target.parentNode.parentNode.children[3].textContent.split(' ')
               }
               setFormInformation(bookInfo);
               submitBtn.style.display = 'none';
               editBtn.style.display = 'block';
               editingSate = true;
           },
           'Delete': () => {
               document.getElementById(`${bookKey}`).remove();
               sendRequest(`http://localhost:3030/jsonstore/collections/books/${bookKey}`, 'DELETE');
           }
       }
       if (editingSate === true && e.target.tagName === 'BUTTON') {
           setFormInformation({ author: '', isbn: '', title: '', tags: [] });
           submitBtn.style.display = 'block';
           editBtn.style.display = 'none';
           editingSate = false;
           if (e.target.textContent === 'Delete') {
               bookKey = e.target.parentNode.parentNode.getAttribute('id');
               buttons[e.target.textContent]();
           }
       } else if (e.target.tagName === 'BUTTON') {
           bookKey = e.target.parentNode.parentNode.getAttribute('id');
           buttons[e.target.textContent]();
       }
   }

   async function createNewBook(e) {
       e.preventDefault();
       let bodyRequest = getFormInformation();
       bodyRequest.tags = bodyRequest.tags.map(tag => tag.trim()).filter(tag => tag !== '');
       await sendRequest('http://localhost:3030/jsonstore/collections/books', 'POST', JSON.stringify(bodyRequest));
       setFormInformation({ author: '', isbn: '', title: '', tags: [] });
       listAllBooks();
   }

   function getFormInformation() {
       return {
           author: document.getElementById('author').value,
           isbn: document.getElementById('isbn').value,
           title: document.getElementById('title').value,
           tags: document.getElementById('tags').value.split(' ')
       }
   }

   function setFormInformation({ author, isbn, title, tags }) {
       document.getElementById('author').value = author;
       document.getElementById('isbn').value = isbn;
       document.getElementById('title').value = title;
       document.getElementById('tags').value = tags.join(' ');
   }

   async function listAllBooks() {
       let books = await sendRequest('http://localhost:3030/jsonstore/collections/books', 'GET');
       booksTable.innerHTML = '';
       for (const key in books) {
           genarateBookHTML(books[key], key);
       }
   }

   function genarateBookHTML(bookObj, key) {
       let newBook =
           `<tr id="${key}">
           <td>${bookObj.title}</td>
           <td>${bookObj.author}</td>
           <td>
           <button>Edit</button>
           <button>Delete</button>
           </td>
           </tr>`;
       booksTable.innerHTML += newBook;
   }

   async function sendRequest(url, method, body) {
       let requestObj = {
           method,
           body
       }
       if (body === undefined) {
           delete requestObj.body;
       }
       try {
           let response = await fetch(url, requestObj);
           if (response.status !== 200) {
               throw new Error('Something went wrong');
           }
           let data = await response.json();
           return data;
       } catch (error) {
           //Handle errors
       }
   }
}

booksDB();