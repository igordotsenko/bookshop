function openDetails(e) {
  e.preventDefault();
  
  const bookId = e.target.dataset.bookid;
  const form = getForm();
  
  
  fetch(`/book/${bookId}`, { method : "get" }).
  then((fetchResponse) => {
    handleResponse(fetchResponse, () => {
      fetchResponse.text().then(responseText => {
        const response = JSON.parse(responseText);
        form.bookId = bookId;
        form.title_edit.value = response.title;
        form.author_edit.value = response.author;
        form.price_edit.value = response.price;
        if (response.description) form.description_edit.value = response.description;
        if (response.yearPublished) form.year_published_edit.value = response.yearPublished;
        if (response.publisher) form.publisher_edit.value = response.publisher;
      });
    });
  });
  
  openDetailsModal(true);
  getDeleteBtn().addEventListener('click', () => deleteBook(bookId));
}

function saveDetails(form) {
  const isNewBook = !form.bookId;
  const book = {
    title : form.title_edit.value,
    author : form.author_edit.value,
    price : form.price_edit.value
  }
  if (form.description_edit.value) book.description = form.description_edit.value;
  if (form.year_published_edit.value) book.yearPublished = form.year_published_edit.value;
  if (form.publisher_edit.value) book.publisher = form.publisher_edit.value;
  
  // Get image
  const imageFiles = form.book_image_edit.files;
  console.log("Image files = " + imageFiles);
  const image = imageFiles.length > 0 ? imageFiles[0] : undefined;
  if(image && image.size > 1024 * 1024) {
    alert("Image   cannot be larger than 1 MB");
    return;
  }

  // Build form data
  const formData = new FormData();
  formData.append("book",  new Blob([JSON.stringify(book)], {
    type: "application/json"
  }));
  if (image) {
    console.log("Appending image to request: " + image);
    formData.append("image", image);
  }
  
  const responsePromise = isNewBook ?
      // Add new book
      fetch("/book", { method: 'post', body: formData}) :
      // Else update existing book
      fetch(`/book/${form.bookId}`, { method: 'put', body: formData});
  
  responsePromise.then(function (fetchResponse) {
      handleResponse(fetchResponse, () => {
        fetchResponse.text().then((responseText) => {
          const response = JSON.parse(responseText);
          if (isNewBook) {
            alert(`New book is added. Book id = ${response}`);
            addNewGridItem(response, book, image);
          } else {
            alert(`Book with id = ${form.bookId} has been updated`);
            updateGridItem(form.bookId, response);
          }
          closeDetailsModal();
        })
      });
  }).catch(function (err) {
    alert("There was an error!: " + err);
  });
}

function handleResponse(fetchResponse, successHandler) {
  console.log(`Received response with status=${fetchResponse.status} and body ${fetchResponse.body}`);
  if (fetchResponse.status === 200) {
    successHandler();
  } else {
    handleRequestError(fetchResponse);
  }
}

function deleteBook(bookId) {
  fetch(`/book/${bookId}`, {method : "delete"})
  .then(fetchResponse => {
    handleResponse(fetchResponse, () => {
      alert(`Book with id = ${bookId} has been deleted`);
      deleteGridItem(bookId);
      closeDetailsModal();
    });
  });
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

function handleRequestError(fetchResponse) {
  if (fetchResponse.status === 404) {
    alert("Book not found!");
  } else if (fetchResponse.status === 500) {
    alert("Server error. Try later");
  } else {
    alert(`Unexpected server response. Status = ${fetchResponse.status}`);
  }
}

function buildGridItem(bookId, book, image) {
  const gridItem = document.createElement('div');
  gridItem.id = `book-item-card-id-${bookId}`;
  gridItem.className = "book-item-card";
  
  const bookImg = document.createElement('img');
  bookImg.className = "book-image";

  
  if (image) { // Set picked picture
    const fr = new FileReader();
    fr.onload = function () {
      bookImg.src = fr.result;
    }
    fr.readAsDataURL(image);
  } else {
    bookImg.src = "https://dogtowndogtraining.com/wp-content/uploads/2012/06/300x300-061-e1340955308953.jpg";
  }

  
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

function addNewGridItem(bookId, book, image) {
  const grid = document.getElementById("grid-container");
  const gridItem = buildGridItem(bookId, book, image);
  grid.prepend(gridItem);
}

function updateGridItem(bookId, book) {
  const gridItem = document.getElementById(`book-item-card-id-${bookId}`);
  gridItem.querySelector(".title").innerHTML = book.title;
  gridItem.querySelector(".author").innerHTML = book.author;
  gridItem.querySelector(".description").innerHTML = getDescription(book.description);
  gridItem.querySelector(".price").innerHTML = formatPrice(book.price);
  gridItem.querySelector(".book-image").src = `/image/${book.imageName}`;
}

function formatPrice(price) {
  const formattedNumber = parseFloat(price).toFixed(2);
  return `${formattedNumber} UAH`;
}

function getDescription(initDescription) {
  return initDescription ? initDescription : "No description added yet..."
}

function getDeleteBtn() {
  return document.getElementById("delete-book-btn");
}
