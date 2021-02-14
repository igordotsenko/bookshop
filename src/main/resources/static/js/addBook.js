// function addBook() {
//   // const bookName = prompt("Enter a book name");
//   // const book = { name : bookName};
//   // console.log(`Going to send a book with name ${bookName}`)
//   //
//   openDetailsModal();
//   const saveBtn = document.getElementById("save-details-button");
//   const titleEdit = document.getElementById("title_edit");
//   saveBtn.addEventListener('click', () => {
//     const title = titleEdit.value;
//     if (!title) {    
//       alert("Title cannot be empty!");
//       return;
//     }
//     const book = {title: title};
//     const httpRr = new XMLHttpRequest();
//     httpRr.onreadystatechange = () => {
//       console.log(`Received response with status=${httpRr.status} and response text ${httpRr.responseText}`);
//       // TODO add error handling
//       if (httpRr.readyState === 4 && httpRr.status === 200) {
//         // TODO add autorefresh
//         alert(`Added book with id = ${httpRr.responseText}`);
//         closeDetailsModal();
//         // addListItem("books_list", response.name);
//       }
//     }
//     httpRr.open("POST", "http://127.0.0.1:8080/book");
//     httpRr.setRequestHeader("Content-type", "application/json");
//     const body = JSON.stringify(book);
//
//     console.log(`Sending request with body ${body}`);
//     httpRr.send(body);
//   })
//
//   // httpRr.open("POST", "http://127.0.0.1:8080/add");
//
//  
//  
//
// }
//
// function addListItem(listName, item) {
//   const ul = document.getElementById(listName);
//   const li = document.createElement("li");
//   li.appendChild(document.createTextNode(item));
//   ul.append(li);
// }
