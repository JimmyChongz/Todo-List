let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", e => {
    e.preventDefault();

    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

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
        text.style.textDecoration = "line-through";
        completeButton.addEventListener("click", () => {
            text.style.textDecoration = 'none';
        })
    })
    
    let trashButton = document.createElement("button");
    trashButton.classList.add("trashcan");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>'

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    section.appendChild(todo);

    todo.style.animation = "scaleUp 0.3s forwards";
})

