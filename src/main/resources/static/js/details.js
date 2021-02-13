function openDetails(e) {
  e.preventDefault();
  const bookId = e.target.dataset.bookid;
  const bookTitleEdit = document.getElementById("title-edit");
  
  const httpRr = new XMLHttpRequest();
  httpRr.onreadystatechange = () => {
    // TODO handle not found case
    console.log(`Open details: received response with status=${httpRr.status} and response text ${httpRr.responseText}`);
    if (httpRr.readyState === 4 && httpRr.status === 200) {
      const response = JSON.parse(httpRr.responseText);
      bookTitleEdit.value = response.title;
    }
  }
  // TODO add await window
  httpRr.open("GET", `http://127.0.0.1:8080/book/${bookId}`);
  httpRr.send()
  openDetailsModal();
}

function openDetailsModal() {
  const modal = document.getElementById("details-modal");
  modal.classList.remove("details-modal-inactive");
  modal.classList.add("details-modal-active");

}
function closeDetailsModal() {
  const modal = document.getElementById("details-modal");
  modal.classList.remove("details-modal-active");
  modal.classList.add("details-modal-inactive");
}
