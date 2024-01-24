/* 캘린더 기능 */

let date = new Date();
const today = new Date();
const getToDoList = window.localStorage.getItem('toDoList');
const updateToDoList = (data) => {
  window.localStorage.setItem('toDoList', JSON.stringify(data));
}

if (!getToDoList) {
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
const createToDo = (event) => {
  const targetWrapper = event.target.closest('.target__wrapper');
  let id = targetWrapper.id;
  
  const todoWrapper = targetWrapper.querySelector('.todo__wrapper');

  const newTodo = createDivWithClass('todo');
  newTodo.innerHTML = `
  <div class="todo__content">
    <div class="todo__icon">
      <img id="icon" src="../src/assets/icons/icon.svg">
    </div>
  <input class="todo__title" type="text" onchange="saveToDo(event)">
  </div>
  <div class="btn-more">
    <img id="more" src="../src/assets/icons/more.svg">
  </div>`
  todoWrapper.appendChild(newTodo);
}

const saveToDo = (event) => {
  let inputValue = event.target.value;
  const targetWrapper = event.target.closest('.target__wrapper');
  let id = targetWrapper.id;
  const keyDate = date.toString().substring(4, 15);
  const toDoList = JSON.parse(getToDoList);

  if(toDoList.toDoList[id][keyDate] == undefined){
    toDoList.toDoList[id][keyDate] = [];
  }

  toDoList.toDoList[id][keyDate].push(inputValue);

  updateToDoList(toDoList);

  console.log(window.localStorage.getItem("toDoList"));
  
}

//R
const renderToDo = () => {
  const keyDate = date.toString().substring(4, 15);
  const toDoList = JSON.parse(getToDoList);
  const targets = toDoList.toDoList.targets;

}

// target
//C
const createTarget = () => {
  const toDoList = JSON.parse(getToDoList);
  const targets = toDoList.toDoList.targets;

  if (targets.includes('목표 3')) {
    alert("이미 존재하는 목표입니다.")
  }
  else {
    targets.push('목표 3');
    toDoList.toDoList["목표 3"] = {};
  }

  updateToDoList(toDoList);
}
//R
const renderTargets = () => {
  const toDoList = JSON.parse(getToDoList).toDoList;
  const targets = toDoList.targets;

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
