/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for index.js
  handles directing to the login page
*/

function clickLoginSignup() {
    window.location.href = '/login.html';
}

document.addEventListener("DOMContentLoaded", () => {
  //do something with this
  //document.getElementById("test1").textContent = "hwkhekahldhlwa"
});

function clickLogout() {
  window.location.href = '/login.html';
}

//check if theres a user logged in, if there is then show logout button only, but change visibility where orig button doesnt take up space in the scene