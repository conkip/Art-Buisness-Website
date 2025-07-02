/*
    Author: Connor Kippes

    Handles loging in or creating a new account.
*/

let invaldLoginText = document.getElementById("invalid-login-text");
invalidLoginText.style.display = 'none';

let invalidSignupText = document.getElementById("invalid-signup-text");
invalidSignupText.style.display = 'none';

async function clickLoginButton() {
    let usernameTextbox = document.getElementById("username");
    let username = usernameTextbox.value;

    let passwordTextbox = document.getElementById("password");
    let password = passwordTextbox.value;

    fetch(`/login/${username}/${password}`)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if(!data){
                // no user found or password is incorrect
                // so display no user found of that name
                invalidLoginText.style.display = 'block';
                setTimeout(() => {
                    invalidLoginText.style.display = 'none';
                }, 2000);
            }
            else{
                window.location.href = '/index.html';
            }
        })
        .catch(error => console.error('Error:', error));
}

async function clickSignupButton() {
    let usernameTextbox = document.getElementById("username");
    let username = usernameTextbox.value;

    let passwordTextbox = document.getElementById("password");
    let password = passwordTextbox.value;

    fetch(`/signup/${username}/${password}`)
        .then(response => response.json())
        .then(data => {
            console.log('Response:', data);
            if(data){
                fetch(`/login/${username}/${password}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Response:', data);
                    })
                    .catch(error => console.error('Error:', error));
                window.location.href = '/index.html';
            }
            else {
                // username taken
                invalidSignupText.style.display = "block";
                setTimeout(() => {
                    invalidSignupText.style.display = 'none';
                }, 2000);
            }
        })
        .catch(error => console.error('Error:', error));
}

