/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable no-plusplus */

// Global variables
let controlToDo;
let prevContent = 'main';
const date = new Date();
const today = new Date();
const iconUrl = [
  '../src/assets/icons/icon.svg',
  '../src/assets/icons/icon__active.svg',
];
const uncompletedIcon = '../src/assets/icons/icon.svg';
const completedIcon = '../src/assets/icons/icon__active.svg';
const formatMonth = [
  '0',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Storage form
// targets : ['목표1', '목표2', ...]
// 목표1 : { 'Feb-1-2021' : { '할일1' : 0, '할일2' : 1, ... }, 'Feb-2-2021' : { '할일1' : 0, '할일2' : 1, ... }, ... }
// 목표2 : { 'Feb-1-2021' : { '할일1' : 0, '할일2' : 1, ... }, 'Feb-2-2021' : { '할일1' : 0, '할일2' : 1, ... }, ... }
// ...

// Storage functions
const getStorage = (key) => JSON.parse(window.localStorage.getItem(key));

const updateStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

function setStorage() {
  const targets = getStorage('targets');
  for (let i = 0; i < targets.length; i++) {
    if (!getStorage(targets[i])) {
      updateStorage(targets[i], {});
    }
  }
}

// Common functions
const formatDate = (data) => {
  const [m, d, y] = data.split(' ');

  if (m.length === 1) {
    return `${m}-0${d}-${y}`;
  }
  return `${m}-${d}-${y}`;
};

const spaceToDash = (data) => data.replace(/ /g, '-');

const dashToSpace = (data) => data.replace(/-/g, ' ');

const createDivWithClass = (className) => {
  const div = document.createElement('div');
  div.className = className;
  return div;
};

const appendToParent = (parent, children) => {
  children.forEach((child) => parent.appendChild(child));
};

// modal functions
function openFunction() {
  const functionModal = document.getElementById('modal-function');

  if (functionModal.style.display === 'flex') {
    functionModal.style.display = 'none';
  } else {
    functionModal.style.display = 'flex';
  }
}

function openModal(event) {
  const modal = document.querySelector('.modal');
  modal.style.display = 'flex';

  controlToDo = event.target.closest('.todo');
}

function closeModal() {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
}

// Date functions
function selectedDate() {
  const targetId = date.getDate();
  const targetDate = document.getElementById(`${targetId}`);
  targetDate.querySelector('.date__num').style.backgroundColor = '#000';
  targetDate.querySelector('.date__num').style.color = '#fff';
}

function resetSelectedDate() {
  const targetId = date.getDate();
  const targetDate = document.getElementById(`${targetId}`);
  targetDate.querySelector('.date__num').style.backgroundColor = '';
  targetDate.querySelector('.date__num').style.color = '';
}

function selectDate(event) {
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

// Render Calendar
function renderCalendar() {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const targets = getStorage('targets');

  const calendarTitle = document.querySelector('.calendar__title');
  calendarTitle.innerHTML = `${currentYear}년 ${currentMonth + 1}월`;

  const firstDate = new Date(currentYear, currentMonth, 1);
  const firstDay = firstDate.getDay();

  const dateBoard = document.querySelector('.calendar__dateBoard');

  while (dateBoard.firstChild) {
    dateBoard.removeChild(dateBoard.firstChild);
  }

  if (firstDay === 0) {
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

  for (
    let i = 1;
    i <= new Date(currentYear, currentMonth + 1, 0).getDate();
    i++
  ) {
    const dateDiv = createDivWithClass('date');
    const dateIcon = createDivWithClass('common__icon');
    const img = document.createElement('img');
    const todoCnt = createDivWithClass('todo__cnt');
    const dateNum = createDivWithClass('date__num');
    let cnt = 0;
    let emptyCnt = 0;
    const keyDate = formatDate(
      `${formatMonth[currentMonth + 1]} ${i} ${currentYear}`,
    );

    for (let j = 0; j < targets.length; j++) {
      try {
        const keys = Object.keys(getStorage(targets[j])[keyDate]);
        for (let k = 0; k < keys.length; k++) {
          if (getStorage(targets[j])[keyDate][keys[k]] === 0) {
            cnt++;
          }
        }
      } catch (error) {
        emptyCnt++;
      }
    }

    dateDiv.id = `${i}`;
    dateNum.textContent = i;

    if (
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear() &&
      i === today.getDate()
    ) {
      dateNum.id = 'today';
    }

    img.src = uncompletedIcon;
    img.id = 'icon';
    if (emptyCnt !== targets.length) {
      if (cnt === 0) {
        img.src = completedIcon;
      } else {
        todoCnt.textContent = cnt;
      }
    }

    appendToParent(dateIcon, [img, todoCnt]);
    appendToParent(dateDiv, [dateIcon, dateNum]);

    dateBoard.appendChild(dateDiv);
  }

  document
    .querySelectorAll('.date')
    .forEach((e) => e.addEventListener('click', selectDate));
  resetSelectedDate();
  selectedDate();
}

// To Do functions
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
  const targetElement = event.target;
  const keyDate = formatDate(date.toString().substring(4, 15));
  const { id } = event.target.closest('.target__wrapper');
  const todayListStatus = getStorage(id);

  const value = spaceToDash(event.target.parentNode.nextElementSibling.value);

  if (todayListStatus[keyDate][value] === 0) {
    todayListStatus[keyDate][value] = 1;
    targetElement.src = completedIcon;
  } else {
    todayListStatus[keyDate][value] = 0;
    targetElement.src = uncompletedIcon;
  }

  updateStorage(id, todayListStatus);

  renderCalendar();
};

const saveToDo = async (event) => {
  const targetElement = event.target;
  const inputValue = targetElement.value;

  const targetWrapper = event.target.closest('.target__wrapper');
  const target = getStorage(targetWrapper.id);
  const keyDate = formatDate(date.toString().substring(4, 15));

  if (target[keyDate][inputValue]) {
    alert('이미 있는 목표입니다');
    targetElement.value = '';
    return;
  }

  target[keyDate][inputValue] = 0;

  try {
    updateStorage(targetWrapper.id, target);
  } catch (error) {
    console.log(error);
  }

  targetElement.disabled = true;
  renderCalendar();
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
  </div>`;

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
      console.log(error);
    }
  }
};

function modifyToDo() {
  const keyDate = formatDate(date.toString().substring(4, 15));
  const todoTitle = controlToDo.querySelector('.todo__title');
  const todoPlaceholder = todoTitle.value;
  const targetId = controlToDo.closest('.target__wrapper').id;
  const icon = controlToDo.querySelector('.iconToDo');
  const target = getStorage(targetId);

  icon.src = uncompletedIcon;
  todoTitle.placeholder = todoPlaceholder;
  todoTitle.disabled = false;
  todoTitle.value = '';
  todoTitle.focus();

  delete target[keyDate][spaceToDash(todoPlaceholder)];

  updateStorage(targetId, target);
  todoTitle.addEventListener('change', saveToDo);

  closeModal();
}

function deleteToDo() {
  const keyDate = formatDate(date.toString().substring(4, 15));
  const todoTitle = controlToDo.querySelector('.todo__title');
  const targetId = controlToDo.closest('.target__wrapper').id;

  const target = getStorage(targetId);

  delete target[keyDate][spaceToDash(todoTitle.value)];
  if (Object.keys(target[keyDate]).length === 0) {
    delete target[keyDate];
  }
  controlToDo.remove();
  updateStorage(targetId, target);

  closeModal();
  renderCalendar();
}

// Render Targets in To Do List
function renderTargets() {
  const targets = getStorage('targets');

  const toDoListWrapper = document.querySelector('.toDoList__wrapper');

  toDoListWrapper.innerHTML = '';
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

// Render To Do List
function renderToDo() {
  resetToDo();
  const keyDate = formatDate(date.toString().substring(4, 15));
  const targets = getStorage('targets');

  for (let i = 0; i < targets.length; i++) {
    let todayList;
    try {
      todayList = Object.keys(getStorage(targets[i])[keyDate]);
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line no-continue
    if (todayList === undefined) continue;

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
        </div>`;
      todoWrapper.appendChild(newTodo);
      const todoMore = newTodo.querySelector('.btn-more');
      todoMore.addEventListener('click', openModal);
    }
  }
}

// Calendar functions

function nextMonth() {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
  renderToDo();
}

function prevMonth() {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
  renderToDo();
}

// Main2Target & Target2Main

function openTargetPage() {
  const targetWrapper = document.getElementById('target__wrapper');
  targetWrapper.style.display = 'flex';
  const mainWrapper = document.getElementById('main__wrapper');
  mainWrapper.style.display = 'none';
}

function closeTargetPage() {
  const targetWrapper = document.getElementById('target__wrapper');
  targetWrapper.style.display = 'none';
  const mainWrapper = document.getElementById('main__wrapper');
  mainWrapper.style.display = 'flex';

  renderCalendar();
  renderTargets();
  renderToDo();
}

function prevPage() {
  if (prevContent !== 'list') {
    closeTargetPage();
    openFunction();
  } else {
    renderTargetList();
  }
}

// Target functions
function createTarget(event) {
  const newTarget =
    event.target.parentNode.parentNode.querySelector('.target__input').value;
  const targets = getStorage('targets');

  if (newTarget === '') {
    alert('목표를 입력해주세요');
    return;
  }
  for (let i = 0; i < targets.length; i++) {
    if (targets[i] === newTarget) {
      alert('이미 있는 목표입니다');
      return;
    }
  }

  targets.push(newTarget);
  updateStorage('targets', targets);

  localStorage.setItem(newTarget, JSON.stringify({}));
}

const modifyTarget = (event) => {
  const targetData =
    event.target.parentNode.parentNode.querySelector(
      '.target__input',
    ).placeholder;
  const newTarget =
    event.target.parentNode.parentNode.querySelector('.target__input').value;

  if (newTarget === '') {
    alert('목표를 입력해주세요');
    return;
  }
  if (targetData === newTarget) {
    return;
  }

  const targets = getStorage('targets');
  const targetIndex = targets.indexOf(targetData);
  targets[targetIndex] = newTarget;

  updateStorage('targets', targets);
  localStorage.setItem(newTarget, localStorage.getItem(targetData));
  localStorage.removeItem(targetData);
};

const deleteTarget = (event) => {
  const targetData =
    event.target.parentNode.parentNode.querySelector('.target__input').value;
  const targets = getStorage('targets');
  const targetIndex = targets.indexOf(targetData);
  targets.splice(targetIndex, 1);
  updateStorage('targets', targets);
  localStorage.removeItem(targetData);
};

// Target page functions
function renderPlusTarget(event) {
  openTargetPage();

  try {
    console.log(event.target);
    prevContent = 'list';
  } catch (error) {
    prevContent = 'main';
  }

  const headerWrapper = document.querySelector('.header__wrapper');
  headerWrapper.lastChild.remove();

  const targetNextBtn = document.createElement('div');
  targetNextBtn.id = 'target-next-btn';
  targetNextBtn.innerText = '확인';
  targetNextBtn.addEventListener('click', [createTarget, prevPage]);

  appendToParent(headerWrapper, [targetNextBtn]);
  const bodyContents = document.querySelector('.body__contents');
  bodyContents.innerHTML = '';

  const targetInput = document.createElement('input');
  targetInput.className = 'target__input';
  targetInput.placeholder = '목표 입력';
  targetInput.focus();

  bodyContents.appendChild(targetInput);
}

function renderModifyTarget(event) {
  openTargetPage();
  prevContent = 'list';

  const headerWrapper = document.querySelector('.header__wrapper');
  headerWrapper.lastChild.remove();

  const targetNextBtn = document.createElement('div');
  targetNextBtn.id = 'target-next-btn';
  targetNextBtn.innerText = '확인';
  targetNextBtn.addEventListener('click', [modifyTarget, prevPage]);

  appendToParent(headerWrapper, [targetNextBtn]);

  const bodyContents = document.querySelector('.body__contents');
  bodyContents.innerHTML = '';

  const targetInput = document.createElement('input');
  const targetDeleteBtn = document.createElement('div');
  targetDeleteBtn.id = 'target-delete-btn';
  targetDeleteBtn.innerText = '삭제';
  targetDeleteBtn.addEventListener('click', [deleteTarget, prevPage]);

  targetInput.className = 'target__input';
  targetInput.value = event.target.textContent;
  targetInput.placeholder = event.target.textContent;

  appendToParent(bodyContents, [targetInput, targetDeleteBtn]);

  targetInput.focus();
}

function renderTargetList() {
  openTargetPage();
  prevContent = 'main';
  const headerWrapper = document.querySelector('.header__wrapper');
  headerWrapper.lastChild.remove();

  const targetNextBtn = document.createElement('div');
  targetNextBtn.id = 'target-next-btn';
  targetNextBtn.innerHTML = '';
  targetNextBtn.innerHTML = `
  <img src="../src/assets/icons/plus_icon.svg">
  `;
  targetNextBtn.addEventListener('click', renderPlusTarget);

  appendToParent(headerWrapper, [targetNextBtn]);

  const targets = getStorage('targets');
  const bodyContents = document.querySelector('.body__contents');
  bodyContents.innerHTML = '';

  for (let i = 0; i < targets.length; i++) {
    const targetDiv = createDivWithClass('target');
    const targetTitle = createDivWithClass('target__title');

    targetDiv.addEventListener('click', renderModifyTarget);
    targetTitle.innerText = targets[i];
    targetDiv.appendChild(targetTitle);
    bodyContents.appendChild(targetDiv);
  }
}

/* toDoList 기능 */

setStorage();
renderCalendar();
renderTargets();
renderToDo();
