function addBook() {
  const bookName = prompt("Enter a book name");
  const book = { name : bookName};
  console.log(`Going to send a book with name ${bookName}`)
  
  const httpRr = new XMLHttpRequest();
  httpRr.onreadystatechange = () => {
    console.log(`Received response with status=${httpRr.status} and response text ${httpRr.responseText}`);
    if (httpRr.readyState === 4 && httpRr.status === 200) {
      const response = JSON.parse(httpRr.responseText);
      addListItem("books_list", response.name);
    }
  }
  httpRr.open("POST", "http://127.0.0.1:8080/add");
  httpRr.setRequestHeader("Content-type", "application/json");
  const body = JSON.stringify(book);
  
  console.log(`Sending request with body ${body}`);
  httpRr.send(body);
}

function addListItem(listName, item) {
  const ul = document.getElementById(listName);
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  ul.append(li);
}
