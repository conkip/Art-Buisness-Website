/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for login.js
  handles loging in or creating a new account
*/

function clickButton(name) {
    let usernameTextbox = document.getElementById("loginUsername");
    let username = usernameTextbox.value;
    let domainName = "127.0.0.1"; // change to "leah.knodel.me"
    url = "";
    if(name == "loginUsername"){
        url = `http://${domainName}/login/${username}`
    }
    else {//if(name == "signupUsername"){
        url = `http://${domainName}/login/${username}`
    }
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            window.location.href = '/index.html';
        })
        .catch(error => console.error('Error with logging in or signing up', error));
    
    window.location.href = '/index.html';
    
    // change page to homepage

    // change homepage button to be logout (change visibility of them)
}