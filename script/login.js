/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for login.js
  handles loging in or creating a new account
*/
let invaldLoginText = document.getElementById("invalidLoginText");
invalidLoginText.style.visibility = 'hidden';

let invalidSignupText = document.getElementById("invalidSignupText");
invalidSignupText.style.visibility = 'hidden';

function clickLoginButton() {
    let usernameTextbox = document.getElementById("loginUsername");
    let username = usernameTextbox.value;
    let domainName = "127.0.0.1:3000"; // change to "leah.knodel.me"
    fetch(`http://${domainName}/login/${username}`)
        .then(data => {
            console.log('Response:', data);
            if(!data){
                // no user found so display no user found of that name
                invalidLoginText.style.visibility = 'visible';
                setTimeout(() => {
                    invalidLoginText.style.visibility = 'hidden';
                }, 2000);
            }
            else{
                data.json();

                //window.location.href = '/index.html';
            }
        })
        .catch(error => console.error('Error:', error));
}

function clickSignupButton() {
    let usernameTextbox = document.getElementById("signupUsername");
    let username = usernameTextbox.value;
    let domainName = "127.0.0.1:3000"; // change to "leah.knodel.me"
    fetch(`http://${domainName}/signup/${username}`)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if(data){
                fetch(`http://${domainName}/login/${username}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response:', data);
                    })
                    .catch(error => console.error('Error:', error));
                window.location.href = '/index.html';
            }
            else {
                invalidSignupText.style.visibility = 'visible';
                setTimeout(() => {
                    invalidSignupText.style.visibility = 'hidden';
                }, 2000);
            }
        })
        .catch(error => console.error('Error:', error));
}