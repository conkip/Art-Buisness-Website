/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for login.js
  handles loging in or creating a new account
*/

function clickButton() {
    let usernameTextbox = document.getElementById("loginUsername");
    let username = usernameTextbox.value;

    // change current user in database
    fetch(`http://leah.knodel.me/${username}`)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            window.location.href = '/index.html';
        })
        .catch(error => console.error('Error:', error));
    
    // change page to homepage

    // change homepage button to be logout (change visibility of them)
}