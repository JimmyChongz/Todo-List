let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", e => {
    e.preventDefault();

    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    if (todoText === "" || todoMonth === "" || todoDate === "") {
        alert("代辦事項或日期不能為空！")
        return;
    }

    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";

    // create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + "/" + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    // create green check and red trash can.
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trashcan");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>'
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.3s forwards";
        todoItem.addEventListener("animationend", () => {
            let text = todoItem.children[0].innerText;
            let myListArr = JSON.parse(localStorage.getItem("list"));
            myListArr.forEach( (item, index) => {
                if ( item.todoText == text ) {
                    myListArr.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArr));
                }
            } )
            todoItem.remove();
        })
    })

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    section.appendChild(todo);

    todo.style.animation = "scaleUp 0.3s forwards";

    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    }

    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArr = JSON.parse(myList);
        myListArr.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArr));
    }

    console.log(JSON.parse(localStorage.getItem("list")));
    
})

let myListArr = JSON.parse(localStorage.getItem("list"));
myListArr.map(item => {
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = item.todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = item.todoMonth + "/" + item.todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    })
    let trashButton = document.createElement("button");
    trashButton.classList.add("trashcan");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.style.animation = "scaleDown 0.3s forwards"
        todoItem.addEventListener("animationend", () => {
            let text = todoItem.children[0].innerText;
            let myListArr = JSON.parse(localStorage.getItem("list"))
            myListArr.forEach( (item, index) => {
                if (item.todoText == text) {
                    myListArr.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArr));
                }
            })
            todoItem.remove();
        })
    })
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    section.appendChild(todo);
})

// localStorage.clear();