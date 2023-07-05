let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", (e) => {
    e.preventDefault();

    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    let listArray = JSON.parse(localStorage.getItem("list"));
    // let i = 1;
    // let tmpText = todoText;
    // listArray.forEach((item) => {
    //     if (item.todoText === todoText) {
    //         i++;
    //         todoText = tmpText + " (" + i + ")";
    //     }
    // });

    // if (i != 1) {
    //     todoText = tmpText + " (" + i + ")";
    // }

    if (!todoText || !todoMonth || !todoDate || todoMonth > 12 || todoDate > 31) {
        alert("代辦事項及日期不能為空，或請輸入正確的日期!");
        form.children[1].value = "";
        form.children[2].value = "";
        return;
    }

    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";

    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + "月" + "/" + todoDate + "日";
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    todo.appendChild(text);
    todo.appendChild(time);
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    section.appendChild(todo);

    todo.style.animation = "scaleUp 0.3s forwards";

    completeButton.addEventListener("click", (e) => {
        let Text = e.target.parentElement.children[0].innerText;
        let listArray = JSON.parse(localStorage.getItem("list"));
        listArray.forEach((item) => {
            if (item.todoText == Text) {
                if (item.finish === false) {
                    todo.classList.add("done");
                    item.finish = true;
                } else {
                    todo.classList.remove("done");
                    item.finish = false;
                }
                localStorage.setItem("list", JSON.stringify(listArray));
            }
        });
    });

    trashButton.addEventListener("click", (e) => {
        let Item = e.target.parentElement;
        let Text = Item.children[0].innerText;
        Item.style.animation = "scaleDown 0.3s forwards";
        Item.addEventListener("animationend", () => {
            let listArray = JSON.parse(localStorage.getItem("list"));
            listArray.forEach((item, index) => {
                if (item.todoText == Text) {
                    listArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(listArray));
                }
            });
            Item.remove();
        });
    });

    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate,
        finish: false,
    };

    let list = localStorage.getItem("list");
    if (list == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let listArray = JSON.parse(list);
        listArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(listArray));
    }
});

loadData();

function loadData() {
    let listArray = JSON.parse(localStorage.getItem("list"));
    listArray.forEach((item) => {
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let todoText = document.createElement("p");
        todoText.classList.add("todo-text");
        todoText.innerText = item.todoText;
        let todoTime = document.createElement("p");
        todoTime.classList.add("todo-time");
        todoTime.innerText = item.todoMonth + "月" + "/" + item.todoDate + "日";
        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = '<i class="fas fa-check"></i>';
        let trashButton = document.createElement("button");
        trashButton.classList.add("trash");
        trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

        todo.appendChild(todoText);
        todo.appendChild(todoTime);
        todo.appendChild(completeButton);
        todo.appendChild(trashButton);
        section.appendChild(todo);

        if (item.finish == true) {
            todo.classList.add("done");
        }

        completeButton.addEventListener("click", (e) => {
            let Text = e.target.parentElement.children[0].innerText;
            listArray.forEach((item) => {
                if (item.todoText == Text) {
                    if (item.finish === false) {
                        item.finish = true;
                        todo.classList.add("done");
                    } else {
                        item.finish = false;
                        todo.classList.remove("done");
                    }
                    localStorage.setItem("list", JSON.stringify(listArray));
                }
            });
        });

        trashButton.addEventListener("click", (e) => {
            let Item = e.target.parentElement;
            let Text = Item.children[0].innerText;
            Item.style.animation = "scaleDown 0.3s forwards";
            Item.addEventListener("animationend", () => {
                let listArray = JSON.parse(localStorage.getItem("list"));
                listArray.forEach((item, index) => {
                    if (item.todoText == Text) {
                        listArray.splice(index, 1);
                        localStorage.setItem("list", JSON.stringify(listArray));
                    }
                });
                Item.remove();
            });
        });
    });
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let mid = Math.floor(arr.length / 2);
        let left = arr.slice(0, mid);
        let right = arr.slice(mid, arr.length);
        return merge(mergeSort(left), mergeSort(right));
    }
}

function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {
        if (Number(left[i].todoMonth) < Number(right[j].todoMonth)) {
            result.push(left[i]);
            i++;
        } else if (Number(left[i].todoMonth) > Number(right[j].todoMonth)) {
            result.push(right[j]);
            j++;
        } else if (Number(left[i].todoMonth) == Number(right[j].todoMonth)) {
            if (Number(left[i].todoDate) < Number(right[j].todoDate)) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }
    }

    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}

let button = document.querySelector("div.sort button");
button.addEventListener("click", () => {
    let sortedArr = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArr));

    let length = section.children.length;
    for (let i = 0; i < length; i++) {
        section.children[0].remove();
    }

    loadData();
});