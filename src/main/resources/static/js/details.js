function openDetails() {
  const modal = document.getElementById("details-modal");
  modal.classList.remove("details-modal-inactive");
  modal.classList.add("details-modal-active");
}

function closeDetails() {
  const modal = document.getElementById("details-modal");
  modal.classList.remove("details-modal-active");
  modal.classList.add("details-modal-inactive");
}
