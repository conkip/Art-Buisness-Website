/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for index.js
  handles directing to the login page
*/

document.cookie = "username=GUEST; expires=Sun, 1 January 2025 12:00:00 UTC; path=/"
console.log(navigator.cookieEnabled);

function clickLoginSignup() {
    window.location.href = '/login.html';
}

function setUserCookie(username) {
  const date = new Date();
  date.setTime(date.getTime() * 365 *24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();

  document.cookie = `username=${username}; ${expires}; path=/`;
}

function deleteUserCookie(username) {
  setCookie(username, null, null);
}

function getCookie(name) {
  const cDecoded = decodeURIComponent(document.cookie);
  const cArray = cDecoded.split("; ");
  let result = null

  cArray.forEach(element => {
    if(element.indexOf(name) == 0){
      result = element.substring(name.length +1)
    }
  })
}