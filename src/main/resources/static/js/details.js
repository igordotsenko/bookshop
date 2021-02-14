function openDetails(e) {
  e.preventDefault();
  
  const bookId = e.target.dataset.bookid;
  const form = getForm();
  
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
  openDetailsModal();
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
  if (form.description_edit.value) book.price = form.description_edit.value;
  if (form.year_published_edit.value) book.yearPublished = form.year_published_edit.value;
  if (form.publisher_edit.value) book.publisher = form.publisher_edit.value;
  
  const httpRr = new XMLHttpRequest();
  httpRr.onreadystatechange = () => {
    console.log(`Save details: received response with status=${httpRr.status} and response text ${httpRr.responseText}`);

    // Alert
    // If new book: add item to grid
    // If existing book: update grid item
    // Close modal
    if (httpRr.readyState === 4 && httpRr.status === 200) {
      const response = JSON.parse(httpRr.responseText);
      if (isNewBook) {
        alert(`New book is added. Book id = ${response}`)
      } else {
        alert(`Book with id = ${form.bookId} has been updated`)
      }
      closeDetailsModal();
      // form.bookId = bookId;
      // form.title_edit.value = response.title;
      // form.author_edit.value = response.author;
      // form.price_edit.value = response.price;
      // if (response.description) form.description_edit.value = response.description;
      // if (response.yearPublished) form.year_published_edit.value = response.yearPublished;
      // if (response.publisher) form.publisher_edit.value = response.publisher;
    } else {
      handleRequestError(httpRr);
    }
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

function openDetailsModal() {
  clearForm();
  const modal = document.getElementById("details-modal");
  modal.classList.remove("details-modal-inactive");
  modal.classList.add("details-modal-active");

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
