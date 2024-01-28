let date = new Date();
const today = new Date();
const iconUrl = ["../src/assets/icons/icon.svg", "../src/assets/icons/icon__active.svg"]

const getStorage = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

const updateStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const setStorage = () => {
  const targets = getStorage('targets');
  for (let i = 0; i < targets.length; i++) {
    if(getStorage(targets[i])){
      continue;
    }
    updateStorage(targets[i], {});
  }
}

const formatDate = (data) => {
  const [month, date, year] = data.split(' ');
  return `${month}-${date}-${year}`;
};

const isObject = (value) => value !== null && typeof value === 'object';

const createDivWithClass = (className) => {
  const div = document.createElement('div');
  div.className = className;
  return div;
};

const appendToParent = (parent, children) => {
  children.forEach(child => parent.appendChild(child));
};

const selectedDate = () => {
  const targetId = date.getDate();
  const targetDate = document.getElementById(`${targetId}`);
  targetDate.querySelector('.date__num').style.backgroundColor = '#000';
  targetDate.querySelector('.date__num').style.color = '#fff';
};

const resetSelectedDate = () => {
  const targetId = date.getDate();
  const targetDate = document.getElementById(`${targetId}`);
  targetDate.querySelector('.date__num').style.backgroundColor = '';
  targetDate.querySelector('.date__num').style.color = '';
};

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
};

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
    const todoCnt = createDivWithClass('todo__cnt');
    const dateNum = createDivWithClass('date__num');

    dateDiv.id = `${i}`;
    dateNum.textContent = i;

    if (currentMonth === today.getMonth() && currentYear === today.getFullYear() && i === today.getDate()) {
      dateNum.id = 'today';
    }

    img.id = 'icon';
    img.src = iconUrl[0];

    appendToParent(dateIcon, [img, todoCnt]);
    appendToParent(dateDiv, [dateIcon, dateNum]);

    dateBoard.appendChild(dateDiv);

    }

  document.querySelectorAll('.date').forEach(date => date.addEventListener('click', selectDate));
  resetSelectedDate();
  selectedDate();
};

const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  renderCalender();
  renderToDo();
};

const prevMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalender();
  renderToDo();
};

// 데이터 저장 방식 : localStorage + JSON

const openFunction = () => {
};

const createToDo = async (event) => {
  const targetWrapper = event.target.closest('.target__wrapper');
  const target = getStorage(targetWrapper.id);
  const todoWrapper = targetWrapper.querySelector('.todo__wrapper');
  const keyDate = formatDate(date.toString().substring(4, 15));


  const newTodo = createDivWithClass('todo');
  newTodo.innerHTML = `
  <div class="todo__content">
    <div class="todo__icon">
      <img id="icon" src="../src/assets/icons/icon.svg">
    </div>
  <input class="todo__title" type="text" placeholder="할 일 입력">
  </div>
  <div class="btn-more">
    <img id="more" src="../src/assets/icons/more.svg">
  </div>`

  todoWrapper.appendChild(newTodo);

  const todoInput = newTodo.querySelector('.todo__title');
  todoInput.addEventListener('change', saveToDo);

  if (!target[keyDate]) {
    target[keyDate] = {}
    try {
      updateStorage(targetWrapper.id, target);
    } catch (error) {
      console.log(error)
    };
  }
};

const saveToDo = async (event) => {
  let inputValue = event.target.value;

  const targetWrapper = event.target.closest('.target__wrapper');
  const target = getStorage(targetWrapper.id);
  const keyDate = formatDate(date.toString().substring(4, 15));

  while(target[keyDate][inputValue]){
    alert("이미 있는 목표입니다");
    event.target.value = '';
  }

  target[keyDate][inputValue] = 0;

  try {
    updateStorage(targetWrapper.id, target)
  } catch (error) {
    console.log(error)
  };

  event.target.disabled = true;
};

const renderToDo = () => {
  resetToDo();
  const keyDate = formatDate(date.toString().substring(4, 15));
  const targets = getStorage('targets');

  for (let i = 0; i < targets.length; i++) {
    let todayList;
    try{
      todayList = Object.keys(getStorage(targets[i])[keyDate]);
    } catch (error) {
      continue;
    };

    const todayListStatus = getStorage(targets[i])[keyDate];

    for (let j = 0; j < todayList.length; j++) {
      const targetWrapper = document.getElementById(`${targets[i]}`);
      const todoWrapper = targetWrapper.querySelector('.todo__wrapper');
      const newTodo = createDivWithClass('todo');
      newTodo.innerHTML = `
        <div class="todo__content">
          <div class="todo__icon" onclick="completeToDo(event);">
            <img class="iconToDo" src=${iconUrl[todayListStatus[todayList[j]]]}>
          </div>
        <input class="todo__title" type="text" disabled="true" value="${todayList[j]}">
        </div>
        <div class="btn-more">
          <img class="moreBtn" src="../src/assets/icons/more.svg">
        </div>`
      todoWrapper.appendChild(newTodo);
    }
  }
};

const resetToDo = () => {
  const targets = getStorage('targets');

  for (let i = 0; i < targets.length; i++) {
    const targetWrapper = document.getElementById(`${targets[i]}`);
    const todoWrapper = targetWrapper.querySelector('.todo__wrapper');

    while (todoWrapper.firstChild) {
      todoWrapper.removeChild(todoWrapper.firstChild);
    }
  }
};

const completeToDo = (event) => {
  const keyDate = formatDate(date.toString().substring(4, 15));
  const id = event.target.closest('.target__wrapper').id;
  const todayListStatus = getStorage(id);

  const value = event.target.parentNode.nextElementSibling.value;

  if (todayListStatus[keyDate][value] == 0) {
    todayListStatus[keyDate][value] = 1;
    event.target.src = iconUrl[1];
  } else if (todayListStatus[keyDate][value] == 1) {
    todayListStatus[keyDate][value] = 0;
    event.target.src = iconUrl[0];
  } else {
    console.log("error");
  }
  
  updateStorage(id, todayListStatus);
};

const renderTargets = () => {
  const targets = getStorage('targets');

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
};

/* toDoList 기능 */


updateStorage("targets", ["목표 1", "목표 2"]);

renderCalender();
renderTargets();
renderToDo();