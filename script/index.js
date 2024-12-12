/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for index.js
  handles directing to the login page
*/

let loginSignupButton = document.getElementById("loginSignupButton");
let logoutButton = document.getElementById("logoutButton");

function clickLoginSignup() {
    window.location.href = '/login.html';
}

document.addEventListener("DOMContentLoaded", () => {
  let domainName = "127.0.0.1:3000"; // change to "leah.knodel.me"
  fetch(`http://${domainName}/getCurUser`)
        .then(data => {
            console.log('Response:', data);
            // no user logged in
            if(data == null){
              loginSignupButton.style.display = "block";
              loginSignupButton.style.marginLeft = "auto";
              loginSignupButton.style.marginRight = "auto";
              logoutButton.style.display =  "none";
            }
            else {
              loginSignupButton.style.display = "none";
              logoutButton.style.display =  "block";
              logoutButton.style.marginLeft = "auto";
              logoutButton.style.marginRight = "auto";
            }
        })
        .catch(error => console.error('Error:', error));
});

function clickLogout() {
  let domainName = "127.0.0.1:3000"; // change to "leah.knodel.me"
  fetch(`http://${domainName}/clearCookies`)
        .then(data => {
            console.log('Response:', data);
            //hide buttons
            loginSignupButton.style.display = "block";
            loginSignupButton.style.marginLeft = "auto";
            loginSignupButton.style.marginRight = "auto";
            logoutButton.style.display =  "none";
        })
        .catch(error => console.error('Error:', error));
}

//check if theres a user logged in, if there is then show logout button only, but change visibility where orig button doesnt take up space in the scene