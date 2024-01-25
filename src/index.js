/* 캘린더 기능 */
let date = new Date();
const today = new Date();
const iconUrl = ["../src/assets/icons/icon.svg", "../src/assets/icons/icon__active.svg"]
const getToDoList = () => {
  return JSON.parse(window.localStorage.getItem('toDoList'));
}
const updateToDoList = (data) => {
  window.localStorage.setItem('toDoList', JSON.stringify(data));
}

if (!getToDoList()) {
  window.localStorage.setItem('toDoList', JSON.stringify({
    "config": {
      "type": "JSON"
    },
    "toDoList": {
      "targets": ["목표 1", "목표 2"],
      "목표 1": {},
      "목표 2": {}
    }
  }));
}

const formatDate = (keyDate) => {
  let dateElements = keyDate.split(' ');
  return `${dateElements[0]}-${dateElements[1]}-${dateElements[2]}`;
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

const createDivWithClass = (className) => {
  const div = document.createElement('div');
  div.className = className;
  return div;
};

const appendToParent = (parent, children) => {
  children.forEach(child => parent.appendChild(child));
};

const resetSelectedDate = () => {
  const targetId = date.getDate();
  const targetDate = document.getElementById(`${targetId}`);
  targetDate.querySelector('.date__num').style.backgroundColor = '';
  targetDate.querySelector('.date__num').style.color = '';
  targetDate.querySelector('img').src = '../src/assets/icons/icon.svg';
}

const selectedDate = () => {
  const targetId = date.getDate();
  const targetDate = document.getElementById(`${targetId}`);

  targetDate.querySelector('.date__num').style.backgroundColor = '#000';
  targetDate.querySelector('.date__num').style.color = '#fff';
}

const selectDate = (event) => {
  resetSelectedDate();
  const targetDate = event.target.closest('.date');
  if (targetDate.id === 'empty') {
    return;
  }
  date.setDate(targetDate.id);
  date.setHours(0);
  renderToDo();
  selectedDate();
}

const renderCalender = () => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const calenderTitle = document.querySelector('.calender__title');
  calenderTitle.innerHTML = `${currentYear}년 ${currentMonth + 1}월`

  const firstDate = new Date(currentYear, currentMonth, 1);
  const firstDay = firstDate.getDay();

  const dateBoard = document.querySelector('.calender__dateBoard');
  while (dateBoard.firstChild) {
    dateBoard.removeChild(dateBoard.firstChild);
  }

  if (firstDay == 0) {
    for (let i = 0; i < 7; i++) {
      const emptyDate = createDivWithClass('date');
      emptyDate.id = 'empty';
      dateBoard.appendChild(emptyDate);
    }
  } else {
    for (let i = 0; i < firstDay - 1; i++) {
      const emptyDate = createDivWithClass('date');
      emptyDate.id = 'empty';
      dateBoard.appendChild(emptyDate);
    }
  }

  for (let i = 1; i <= new Date(currentYear, currentMonth + 1, 0).getDate(); i++) {
    const dateDiv = createDivWithClass('date');
    const dateIcon = createDivWithClass('common__icon');
    const img = document.createElement('img');
    const dateNum = createDivWithClass('date__num');

    dateDiv.id = `${i}`;

    if (currentMonth === today.getMonth() && currentYear === today.getFullYear() && i === today.getDate()) {
      dateNum.id = 'today';
    }

    img.id = 'icon';
    img.src = '../src/assets/icons/icon.svg';

    dateNum.textContent = i;

    appendToParent(dateIcon, [img]);
    appendToParent(dateDiv, [dateIcon, dateNum]);

    dateBoard.appendChild(dateDiv);
  }

  document.querySelectorAll('.date').forEach(date => {
    date.addEventListener('click', selectDate);
  });

  resetSelectedDate();
  selectedDate();
}

const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalender();
  resetSelectedDate();
}

const prevMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalender();
  resetSelectedDate();
}


/* 캘린더 기능 */

// 데이터 저장 방식 : localStorage + JSON 객체

/* toDoList 기능 */

const openFunction = () => {
}

//C
const createToDo = async (event) => {
  const targetWrapper = event.target.closest('.target__wrapper');
  let id = targetWrapper.id;
  const todoWrapper = targetWrapper.querySelector('.todo__wrapper');
  const toDoList = getToDoList();
  const keyDate = formatDate(date.toString().substring(4, 15));


  const newTodo = createDivWithClass('todo');
  newTodo.innerHTML = `
  <div class="todo__content">
    <div class="todo__icon">
      <img id="icon" src="../src/assets/icons/icon.svg">
    </div>
  <input class="todo__title" type="text">
  </div>
  <div class="btn-more">
    <img id="more" src="../src/assets/icons/more.svg">
  </div>`

  todoWrapper.appendChild(newTodo);

  const todoInput = newTodo.querySelector('.todo__title');
  todoInput.addEventListener('change', saveToDo);

  if (!isObject(toDoList.toDoList[id][keyDate])) {
    toDoList.toDoList[id][keyDate] = {
      contents : [],
      status : {}
    };
    try {
      updateToDoList(toDoList);
    } catch (error) {
      console.log(error)
    };
  }
}

const saveToDo = async (event) => {
  let inputValue = event.target.value;

  const targetWrapper = event.target.closest('.target__wrapper');
  let id = targetWrapper.id;

  const keyDate = formatDate(date.toString().substring(4, 15));
  const toDoList = getToDoList();

  if(!toDoList.toDoList[id][keyDate].contents.includes(inputValue)){  
    toDoList.toDoList[id][keyDate].contents.push(inputValue);
  }
  else{
    alert("이미 있는 목표입니다");
    event.target.value = '';
  }
  toDoList.toDoList[id][keyDate].status[inputValue] = 0;

  try {
    updateToDoList(toDoList);
  } catch (error) {
    console.log(error)
  };

  event.target.disabled = true;
};

//R
const renderToDo = () => {
  resetToDo();
  const keyDate = formatDate(date.toString().substring(4, 15));
  const toDoList = getToDoList();
  const targets = toDoList.toDoList.targets;

  for (let i = 0; i < targets.length; i++) {
    const id = targets[i]
    const todayList = toDoList.toDoList[id][keyDate];
    if (!isObject(todayList) || todayList.contents.length == 0) {
      continue;
    }

    for (let j = 0; j < todayList.contents.length; j++) {
      const targetWrapper = document.getElementById(`${id}`);
      const todoWrapper = targetWrapper.querySelector('.todo__wrapper');
      const newTodo = createDivWithClass('todo');
      newTodo.innerHTML = `
        <div class="todo__content">
          <div class="todo__icon" onclick="completeToDo(event);">
            <img class="iconToDo" src=${iconUrl[todayList.status[todayList.contents[j]]]}>
          </div>
        <input class="todo__title" type="text" disabled="true" value="${todayList.contents[j]}">
        </div>
        <div class="btn-more">
          <img class="moreBtn" src="../src/assets/icons/more.svg">
        </div>`
      todoWrapper.appendChild(newTodo);
    }
  }
};

const resetToDo = () => {
  const toDoList = getToDoList();
  const targets = toDoList.toDoList.targets;

  for (let i = 0; i < targets.length; i++) {
    const targetWrapper = document.getElementById(`${targets[i]}`);
    const todoWrapper = targetWrapper.querySelector('.todo__wrapper');

    while (todoWrapper.firstChild) {
      todoWrapper.removeChild(todoWrapper.firstChild);
    }
  }
}

const deleteTodo = () => {

}

//U
const completeToDo = (event) => {
  const keyDate = formatDate(date.toString().substring(4, 15));
  const toDoList = getToDoList();
  const id = event.target.closest('.target__wrapper').id;
  const value = event.target.parentNode.nextElementSibling.value;

  toDoList.toDoList[id][keyDate].status[value] = 1;
  event.target.src = iconUrl[1];

  updateToDoList(toDoList);


}

// target
//C
const createTarget = () => {

}
//R
const renderTargets = () => {
  const toDoList = getToDoList()
  const targets = toDoList.toDoList.targets;

  const toDoListWrapper = document.querySelector('.toDoList__wrapper');

  for (let i = 0; i < targets.length; i++) {
    const targetWrapper = createDivWithClass('target__wrapper');
    const targetDiv = createDivWithClass('target');
    const targetIcon = createDivWithClass('target__icon');
    const targetBtn = createDivWithClass('btn-plus-todo');
    const iconImg = document.createElement('img');
    const btnImg = document.createElement('img');
    const targetTitle = createDivWithClass('target__title');
    const todoWrapper = createDivWithClass('todo__wrapper');

    targetWrapper.id = targets[i];

    iconImg.src = '../src/assets/icons/box-seam-fill.svg';
    btnImg.src = '../src/assets/icons/plus_icon.svg';

    targetTitle.innerHTML = `${targets[i]}`;
    targetBtn.addEventListener('click', createToDo);

    appendToParent(targetIcon, [iconImg]);
    appendToParent(targetBtn, [btnImg]);
    appendToParent(targetDiv, [targetIcon, targetTitle, targetBtn]);

    appendToParent(targetWrapper, [targetDiv, todoWrapper]);

    toDoListWrapper.appendChild(targetWrapper);
  }
}
//U
const updateTarget = () => {

}
//D
const deleteTarget = () => {

}

/* toDoList 기능 */
renderCalender();
renderTargets();
renderToDo();