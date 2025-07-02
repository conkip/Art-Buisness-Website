/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for index.js
  handles directing to the login page
*/

let loginSignupButton = document.getElementById("login-signup-button");
let logoutButton = document.getElementById("logout-button");

function clickLoginSignup() {
    window.location.href = "/login.html";
}

async function onStartup() {
    // need this so that logout button updates
    await setTimeout(() => {
        console.log("waited for a sec");
    }, 500);
    return fetch(`/getCurUser`)
        .then((response) => {
            if (response.headers.get("Content-Length") === "0") {
                return null;
            }
            return response.json();
        })
        .then((data) => {
            console.log("Response:", data);

            // no user logged in
            if (data == null) {
                loginSignupButton.style.display = "block";
                loginSignupButton.style.marginLeft = "auto";
                loginSignupButton.style.marginRight = "auto";
                logoutButton.style.display = "none";
            } else {
                loginSignupButton.style.display = "none";
                logoutButton.style.display = "block";
                logoutButton.style.marginLeft = "auto";
                logoutButton.style.marginRight = "auto";
            }
        })
        .catch((error) => console.error("Error:", error));
}

// wait for login button to be loaded and then apply observer
onStartup().then(() => {
    let hiddenElements = document.getElementsByClassName("hidden");

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});

function clickLogout() {
    fetch(`/clearCookies/username`)
        .then((data) => {
            console.log("Response:", data);
            //hide buttons
            loginSignupButton.style.display = "block";
            loginSignupButton.style.marginLeft = "auto";
            loginSignupButton.style.marginRight = "auto";
            logoutButton.style.display = "none";
        })
        .catch((error) => console.error("Error:", error));
}

//check if theres a user logged in, if there is then show logout button only, but change visibility where orig button doesnt take up space in the scene
