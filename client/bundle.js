'use strict';

// Disabling full file because linter is not required on client side
/* eslint-disable */

var selection = {
  urlField: '/getUsers',
  methodSelect: 'GET'
};

var statusCodes = {
  200: 'Success',
  201: 'Create',
  204: 'Updated (No Content)',
  400: 'Bad Request',
  404: 'Resource Not Found'
};

var handleResponse = function handleResponse(xhr) {
  var content = document.querySelector('#content');
  var status = xhr.status;

  var resHTML = '';
  if (xhr.response) {
    var obj = JSON.parse(xhr.response);
    console.dir('Displaying JSON response for grader...');
    console.dir(obj);
    var id = obj.id,
        message = obj.message;

    Object.keys(obj).map(function (key) {
      return resHTML = resHTML + '<p>' + key + ': ' + JSON.stringify(obj[key]) + '</p>';
    });
  }
  content.innerHTML = '\n    <div>\n      <h2>' + statusCodes[status] + '</h2>\n      ' + resHTML + '\n    </div>\n  ';
};

var addUser = function addUser(e) {
  //Prevent default values
  e.preventDefault();
  var values = { name: selection.name, age: selection.age };
  var url = '/api/addUser?name=' + selection.name + '&age=' + selection.age;
  sendAjax(url, 'POST');
};

var userFormSubmit = function userFormSubmit(e) {
  e.preventDefault();
  var url = '/api' + selection.urlField;
  sendAjax(url, selection.methodSelect);
};

var sendAjax = function sendAjax(url, httpMethod) {
  var xhr = new XMLHttpRequest();
  xhr.open(httpMethod, url);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onload = function () {
    return handleResponse(xhr);
  };
  xhr.send();
};

var init = function init() {
  var urlField = document.querySelector('#urlField');
  var methodSelect = document.querySelector('#methodSelect');
  var nameField = document.querySelector('#nameField');
  var ageField = document.querySelector('#ageField');
  var nameForm = document.querySelector('#nameForm');
  var userForm = document.querySelector('#userForm');

  urlField.addEventListener('change', function (e) {
    return selection.urlField = e.target.value;
  });
  methodSelect.addEventListener('change', function (e) {
    return selection.methodSelect = e.target.value;
  });
  nameField.addEventListener('change', function (e) {
    return selection.name = e.target.value;
  });
  ageField.addEventListener('change', function (e) {
    return selection.age = e.target.value;
  });
  nameForm.addEventListener('submit', addUser);
  userForm.addEventListener('submit', userFormSubmit);
};

window.onload = init;
