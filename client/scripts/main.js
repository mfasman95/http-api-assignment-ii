// Disabling full file because linter is not required on client side
/* eslint-disable */

const selection = {
  urlField: '/getUsers',
  methodSelect: 'GET',
};

const statusCodes = {
  200: 'Success',
  201: 'Create',
  204: 'Updated (No Content)',
  400: 'Bad Request',
  404: 'Resource Not Found',
};

const handleResponse = (xhr) => {
  const content = document.querySelector('#content');
  const { status } = xhr;
  let resHTML = '';
  if (xhr.response) {
    const obj = JSON.parse(xhr.response);
    console.dir('Displaying JSON response for grader...');
    console.dir(obj);
    const { id, message } = obj;
    Object.keys(obj).map(key => resHTML = `${resHTML}<p>${key}: ${JSON.stringify(obj[key])}</p>`);
  }
  content.innerHTML = `
    <div>
      <h2>${statusCodes[status]}</h2>
      ${resHTML}
    </div>
  `;
};

const addUser = (e) => {
  //Prevent default values
  e.preventDefault();
  const values = { name: selection.name, age: selection.age };
  const url = `/api/addUser?name=${selection.name}&age=${selection.age}`;
  sendAjax(url, 'POST');
};

const userFormSubmit = (e) => {
  e.preventDefault();
  const url = `/api${selection.urlField}`;
  sendAjax(url, selection.methodSelect);
};

const sendAjax = (url, httpMethod) => {
  const xhr = new XMLHttpRequest();
  xhr.open(httpMethod, url);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = () => handleResponse(xhr);
  xhr.send();
};

const init = () => {
  const urlField = document.querySelector('#urlField');
  const methodSelect = document.querySelector('#methodSelect');
  const nameField = document.querySelector('#nameField');
  const ageField = document.querySelector('#ageField');
  const nameForm = document.querySelector('#nameForm');
  const userForm = document.querySelector('#userForm');

  urlField.addEventListener('change', e => selection.urlField = e.target.value);
  methodSelect.addEventListener('change', e => selection.methodSelect = e.target.value);
  nameField.addEventListener('change', e => selection.name = e.target.value);
  ageField.addEventListener('change', e => selection.age = e.target.value);
  nameForm.addEventListener('submit', addUser);
  userForm.addEventListener('submit', userFormSubmit);
};

window.onload = init;
