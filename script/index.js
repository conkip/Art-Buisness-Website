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
  // Function to change content
  function updatePageContent() {
    const heading = document.getElementById("dynamic-heading");
    heading.textContent = "Updated Before Page Fully Loaded";
  }

  updatePageContent();
});