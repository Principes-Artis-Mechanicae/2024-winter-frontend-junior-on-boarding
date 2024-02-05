let date = new Date();
let controlToDo;
const today = new Date();
const iconUrl = ["../src/assets/icons/icon.svg", "../src/assets/icons/icon__active.svg"]
const month = ['0', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getStorage = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

const updateStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const setStorage = () => {
  const targets = getStorage('targets');
  for (let i = 0; i < targets.length; i++) {
    if (getStorage(targets[i])) {
      continue;
    }
    updateStorage(targets[i], {});
  }
}

const formatDate = (data) => {
  const [month, date, year] = data.split(' ');

  if (date.length == 1) {
    return `${month}-0${date}-${year}`;
  }
  return `${month}-${date}-${year}`;
};

const spaceToDash = (data) => {
  return data.replace(/ /g, '-');
}

const dashToSpace = (data) => {
  return data.replace(/-/g, ' ');
}

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

const renderCalendar = () => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const targets = getStorage('targets');

  const calendarTitle = document.querySelector('.calendar__title');
  calendarTitle.innerHTML = `${currentYear}년 ${currentMonth + 1}월`

  const firstDate = new Date(currentYear, currentMonth, 1);
  const firstDay = firstDate.getDay();

  const dateBoard = document.querySelector('.calendar__dateBoard');

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
    let cnt = 0;
    let emptyCnt = 0;
    let complete = false;
    const keyDate = formatDate(`${month[currentMonth + 1]} ${i} ${currentYear}`);

    for (let j = 0; j < targets.length; j++) {
      try {
        const keys = Object.keys(getStorage(targets[j])[keyDate])
        for (let k = 0; k < keys.length; k++) {
          if (getStorage(targets[j])[keyDate][keys[k]] == 0) {
            cnt++;
          }
        }
      }
      catch (error) {
        emptyCnt++;
        continue;
      };
    }
    
    dateDiv.id = `${i}`;
    dateNum.textContent = i;

    if (currentMonth === today.getMonth() && currentYear === today.getFullYear() && i === today.getDate()) {
      dateNum.id = 'today';
    }

    img.src = iconUrl[0];
    img.id = 'icon';
    if(emptyCnt != targets.length){
      if(cnt == 0){
        img.src = iconUrl[1];
      }
      else{
        todoCnt.textContent = cnt;
      }
    }

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
  renderCalendar();
  renderToDo();
};

const prevMonth = () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
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
    <img class="moreBtn" src="../src/assets/icons/more.svg">
  </div>`

  todoWrapper.appendChild(newTodo);

  const todoInput = newTodo.querySelector('.todo__title');
  todoInput.addEventListener('change', saveToDo);
  const todoIcon = newTodo.querySelector('.todo__icon');
  todoIcon.addEventListener('click', completeToDo);
  const todoMore = newTodo.querySelector('.btn-more');
  todoMore.addEventListener('click', openModal);

  const moreBtn = newTodo.querySelector('.btn-more');
  moreBtn.addEventListener('click', openModal);

  if (!target[keyDate]) {
    target[keyDate] = {};
    try {
      updateStorage(targetWrapper.id, target);
    } catch (error) {
      console.log(error)
    };
  }
};

const saveToDo = async (event) => {
  let inputValue = spaceToDash(event.target.value);

  const targetWrapper = event.target.closest('.target__wrapper');
  const target = getStorage(targetWrapper.id);
  const keyDate = formatDate(date.toString().substring(4, 15));

  while (target[keyDate][inputValue]) {
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
  renderCalendar();
};

const renderToDo = () => {
  resetToDo();
  const keyDate = formatDate(date.toString().substring(4, 15));
  const targets = getStorage('targets');

  for (let i = 0; i < targets.length; i++) {
    let todayList;
    try {
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
        <input class="todo__title" type="text" disabled="true" value="${dashToSpace(todayList[j])}">
        </div>
        <div class="btn-more">
          <img class="moreBtn" src="../src/assets/icons/more.svg">
        </div>`
      todoWrapper.appendChild(newTodo);
      const todoMore = newTodo.querySelector('.btn-more');
      todoMore.addEventListener('click', openModal);
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

  const value = spaceToDash(event.target.parentNode.nextElementSibling.value);

  if (todayListStatus[keyDate][value] == 0) {
    todayListStatus[keyDate][value] = 1;
    event.target.src = iconUrl[1];
  } else if (todayListStatus[keyDate][value] == 1) {
    todayListStatus[keyDate][value] = 0;
    event.target.src = iconUrl[0];
  } else {
    console.error("error");
  }

  updateStorage(id, todayListStatus);

  renderCalendar();
};

const modifyToDo = () => {
  const keyDate = formatDate(date.toString().substring(4, 15));
  const todoTitle = controlToDo.querySelector('.todo__title');
  const todoPlaceholder = todoTitle.value;
  const targetId = controlToDo.closest('.target__wrapper').id;
  const target = getStorage(targetId);

  todoTitle.placeholder = todoPlaceholder;
  todoTitle.disabled = false;
  todoTitle.value = '';
  todoTitle.focus();

  delete target[keyDate][spaceToDash(todoPlaceholder)];

  updateStorage(targetId, target);
  todoTitle.addEventListener('change', saveToDo);

  closeModal();
}

const deleteToDo = () => {
  const keyDate = formatDate(date.toString().substring(4, 15));
  const todoTitle = controlToDo.querySelector('.todo__title');
  const targetId = controlToDo.closest('.target__wrapper').id;

  const target = getStorage(targetId);

  delete target[keyDate][spaceToDash(todoTitle.value)];
  if(Object.keys(target[keyDate]).length == 0){
    delete target[keyDate];
  };
  controlToDo.remove();
  updateStorage(targetId, target);

  closeModal();
  renderCalendar();
}

const openModal = (event) => {
  const keyDate = formatDate(date.toString().substring(4, 15));
  const modal = document.querySelector('.modal');
  modal.style.display = 'flex';

  controlToDo = event.target.closest('.todo');
  console.log(controlToDo);
}

const closeModal = () => {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}

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
setStorage();

renderCalendar();
renderTargets();
renderToDo();