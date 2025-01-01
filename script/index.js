/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for index.js
  handles directing to the login page
*/

let domainName = "127.0.0.1";
let port = 3000

// let domainName = '142.93.207.86';
// let port = 80;

let loginSignupButton = document.getElementById("loginSignupButton");
let logoutButton = document.getElementById("logoutButton");

function clickLoginSignup() {
    window.location.href = '/login.html';
}

function onStartup() {
    document.getElementById("logo").style.filter = 'sepia(1) brightness(0.35) contrast(1.2)';

  	fetch(`http://${domainName}:${port}/getCurUser`)
		.then((response) => {
			if (response.headers.get('Content-Length') === '0') {
				return null;
			}
			return response.json();
		})
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
}

onStartup();

function clickLogout() {
	fetch(`http://${domainName}:${port}/clearCookies`)
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