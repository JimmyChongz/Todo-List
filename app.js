document.addEventListener("DOMContentLoaded", () => {
  let today = new Date();
  let dateString = today.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let currentDateElement = document.getElementById("currentDate");
  currentDateElement.innerText = `今天日期: ${dateString}`;
});

let micButton = document.getElementById("mic");
let todoInput = document.querySelector("input[type='text']");
let recognition;
let isRecognizing = false;

// 語音輸入功能
micButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (isRecognizing) {
    // 停止語音辨識
    recognition.stop();
    micButton.innerHTML = '<i class="fas fa-microphone"></i>';
    isRecognizing = false;
  } else {
    // 開始語音辨識
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "zh-TW";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    micButton.innerHTML = '<i class="fa fa-spinner fa-pulse fa-fw"></i>';
    isRecognizing = true;

    recognition.onresult = (event) => {
      let speechResult = event.results[0][0].transcript;
      todoInput.value = speechResult;
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      micButton.innerHTML = '<i class="fas fa-microphone"></i>';
      isRecognizing = false;
    };
  }
});

let addIcon = document.getElementById("add");
let section = document.querySelector("section");
let i = 1;

addIcon.addEventListener("click", (e) => {
  e.preventDefault();

  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;
  if (!form) {
    console.error("Form element not found.");
    return;
  }

  let listArray = JSON.parse(localStorage.getItem("list"));
  if (listArray) {
    listArray.forEach((item) => {
      if (item.todoText === todoText) {
        todoText = todoText + " (" + ++i + ")";
      }
    });
  }

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
  
  // 播放Todo内容
  let playButton = document.createElement("button");
  playButton.classList.add("play");
  playButton.innerHTML = '<i class="fas fa-play"></i>';

  todo.appendChild(playButton); // 添加播放按钮
  todo.appendChild(text);
  todo.appendChild(time);
  todo.appendChild(completeButton);
  todo.appendChild(trashButton);
  section.appendChild(todo);

  todo.style.animation = "scaleUp 0.3s forwards";

  // 添加播放功能
  playButton.addEventListener("click", () => {
    let textToRead = text.innerText;
    let utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "zh-TW";
    speechSynthesis.speak(utterance);
  });

  completeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    let Text = e.target.parentElement.querySelector(".todo-text").innerText; // 使用更明确的选择器
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
    let Text = Item.querySelector('.todo-text').innerText;
  
    // 更新 localStorage
    let listArray = JSON.parse(localStorage.getItem("list"));
    listArray = listArray.filter(item => item.todoText !== Text);
    localStorage.setItem("list", JSON.stringify(listArray));
  
    Item.style.animation = "scaleDown 0.3s forwards";
    Item.addEventListener("animationend", () => {
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

    // 播放按钮
    let playButton = document.createElement("button");
    playButton.classList.add("play");
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    
    // 添加播放功能
    playButton.addEventListener("click", () => {
      let utterance = new SpeechSynthesisUtterance(item.todoText);
      utterance.lang = "zh-TW";
      speechSynthesis.speak(utterance);
    });

    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    todo.appendChild(playButton);
    todo.appendChild(todoText);
    todo.appendChild(todoTime);
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    section.appendChild(todo);

    if (item.finish == true) {
      todo.classList.add("done");
    }

    completeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      let Text = e.target.parentElement.querySelector(".todo-text").innerText; // 使用更明确的选择器
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
      let Text = Item.querySelector('.todo-text').innerText;
    
      // 更新 localStorage
      let listArray = JSON.parse(localStorage.getItem("list"));
      listArray = listArray.filter(item => item.todoText !== Text);
      localStorage.setItem("list", JSON.stringify(listArray));
    
      Item.style.animation = "scaleDown 0.3s forwards";
      Item.addEventListener("animationend", () => {
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

function merge(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
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