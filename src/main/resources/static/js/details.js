function openDetails(e) {
  e.preventDefault();
  
  const bookId = e.target.dataset.bookid;
  const form = getForm();
  
  // Show delete button if it is existing item  
  console.log(`Book id = ${bookId}`);
  
  const httpRr = new XMLHttpRequest();
  httpRr.onreadystatechange = () => {
    console.log(`Open details: received response with status=${httpRr.status} and response text ${httpRr.responseText}`);
    if (httpRr.readyState === 4 && httpRr.status === 200) {
      const response = JSON.parse(httpRr.responseText);
      form.bookId = bookId;
      form.title_edit.value = response.title;
      form.author_edit.value = response.author;
      form.price_edit.value = response.price;
      if (response.description) form.description_edit.value = response.description;
      if (response.yearPublished) form.year_published_edit.value = response.yearPublished;
      if (response.publisher) form.publisher_edit.value = response.publisher;
    } else {
      handleRequestError(httpRr);
    }
  }
  // TODO add await window
  httpRr.open("GET", `http://127.0.0.1:8080/book/${bookId}`);
  httpRr.send()
  openDetailsModal(true);
  getDeleteBtn().addEventListener('click', () => deleteBook(bookId));
}

function saveDetails(form) {
  // alert(form.title_edit.value);
  if (form.bookId) {
    alert(`Going to update book with id = ${form.bookId}`);
  } else {
    alert(`Going to add a new book`);
  }
  const isNewBook = !form.bookId;
  const book = {
    title : form.title_edit.value,
    author : form.author_edit.value,
    price : form.price_edit.value
  }
  if (form.description_edit.value) book.description = form.description_edit.value;
  if (form.year_published_edit.value) book.yearPublished = form.year_published_edit.value;
  if (form.publisher_edit.value) book.publisher = form.publisher_edit.value;
  
  const httpRr = new XMLHttpRequest();
  httpRr.onreadystatechange = () => {
    console.log(`Save details: received response with status=${httpRr.status} and response text ${httpRr.responseText}`);
    
    handleResponse(httpRr, () => {
      const response = JSON.parse(httpRr.responseText);
      if (isNewBook) {
        alert(`New book is added. Book id = ${response}`);
        addNewGridItem(response, book);
      } else {
        alert(`Book with id = ${form.bookId} has been updated`);
        updateGridItem(form.bookId, book);
      }
      closeDetailsModal();
    });
    // if (httpRr.readyState === 4 && httpRr.status === 200) {
    //   const response = JSON.parse(httpRr.responseText);
    //   if (isNewBook) {
    //     alert(`New book is added. Book id = ${response}`);
    //     addNewGridItem(response, book);
    //   } else {
    //     alert(`Book with id = ${form.bookId} has been updated`);
    //     updateGridItem(form.bookId, book);
    //   }
    //   closeDetailsModal();
    // } else {
    //   handleRequestError(httpRr);
    // }
  }

  const body = JSON.stringify(book);
  if (isNewBook) {
    httpRr.open("POST", "/book");
    console.log(`Sending POST request with body = ${body}`);
  } else {
    httpRr.open("PUT", `/book/${form.bookId}`);
    console.log(`Sending PUT request with body = ${body}`);
  }
  httpRr.setRequestHeader("Content-type", "application/json");
  httpRr.send(body);
}

function handleResponse(httpRr, successHandler) {
  if (httpRr.readyState === 4 && httpRr.status === 200) {
    successHandler();
  } else {
    handleRequestError(httpRr);
  }
}

function deleteBook(bookId) {
  const httpRr = new XMLHttpRequest();
  httpRr.onreadystatechange = () => handleResponse(httpRr, () => {
    alert(`Book with id = ${bookId} has been deleted`);
    deleteGridItem(bookId);
    closeDetailsModal();
  });
  httpRr.open("DELETE", `http://127.0.0.1:8080/book/${bookId}`);
  httpRr.send();
}

function deleteGridItem(bookId) {
  document.getElementById(`book-item-card-id-${bookId}`).remove();
}

function openDetailsModal(showDeleteBtn) {
  clearForm();
  const modal = document.getElementById("details-modal");
  modal.classList.remove("details-modal-inactive");
  modal.classList.add("details-modal-active");
  if (showDeleteBtn) {
    getDeleteBtn().style.display = "block";
  } else {
    getDeleteBtn().style.display = "none";
  }
}
function closeDetailsModal() {
  const modal = document.getElementById("details-modal");
  modal.classList.remove("details-modal-active");
  modal.classList.add("details-modal-inactive");
}

function clearForm() {
  const form = getForm();
  form.reset();
  form.bookId = undefined;
}

function getForm() {
  return document.getElementById("details-form");
}

function handleRequestError(httpRr) {
  if (httpRr.readyState === 4 && httpRr.status === 404) {
    alert("Book not found!");
  } else if (httpRr.readyState === 4 && httpRr.status === 500) {
    alert("Server error. Try later");
  } else if (httpRr.readyState === 4) {
    alert(`Unexpected server response. Status = ${httpRr.status}`);
  }
}

function buildGridItem(bookId, book) {
  const gridItem = document.createElement('div');
  gridItem.id = `book-item-card-id-${bookId}`;
  gridItem.className = "book-item-card";
  
  const bookImg = document.createElement('img');
  bookImg.className = "book-image";
  // TODO update to real URL
  bookImg.src = "https://dogtowndogtraining.com/wp-content/uploads/2012/06/300x300-061-e1340955308953.jpg";
  
  gridItem.appendChild(bookImg);
  gridItem.appendChild(createP(['title', 'overflow-text'], book.title));
  gridItem.appendChild(createP(['author'], book.author));
  console.log(`New book description = ${book.description}`)
  gridItem.appendChild(createP(['description'], getDescription(book.description)));
  gridItem.appendChild(createP(['price'], formatPrice(book.price)));
  
  const editBtn = document.createElement('button');
  editBtn.className = "edit-button";
  editBtn.setAttribute("data-bookid", bookId);
  editBtn.onclick = () => openDetails(event);
  editBtn.innerHTML = "Click for details";
  gridItem.appendChild(editBtn);
  
  return gridItem;
}

function createP(classes, text) {
  const p = document.createElement('p');
  p.classList.add(...classes);
  p.innerHTML = text;
  return p;
}

function addNewGridItem(bookId, book) {
  const grid = document.getElementById("grid-container");
  const gridItem = buildGridItem(bookId, book);
  grid.prepend(gridItem);
}

function updateGridItem(bookId, book) {
  const gridItem = document.getElementById(`book-item-card-id-${bookId}`);
  gridItem.querySelector(".title").innerHTML = book.title;
  gridItem.querySelector(".author").innerHTML = book.author;
  gridItem.querySelector(".description").innerHTML = getDescription(book.description);
  gridItem.querySelector(".price").innerHTML = formatPrice(book.price);
}

function formatPrice(price) {
  const formattedNumber = parseFloat(price).toFixed(2);
  return `${formattedNumber} UAH`;
}

function getDescription(initDescription) {
  return initDescription ? initDescription : "No description yet..."
}

function getDeleteBtn() {
  return document.getElementById("delete-book-btn");
}
