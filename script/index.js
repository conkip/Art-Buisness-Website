/*
    Author: Connor Kippes

    Handles directing to the login page and displaying the correct login button.
*/

const loginSignupButton = document.getElementById("login-signup-button");
const logoutButton = document.getElementById("logout-button");
const deleteButton = document.getElementById("delete-account-button");

function clickLoginSignup() {
    window.location.href = "/login.html";
}

async function onStartup() {
    // need this so that logout button updates
    await setTimeout(() => {}, 500);
    return fetch(`/users/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
        })
        .then((response) => {
            const contentType = response.headers.get("Content-Type");

            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                return null;
            }
        })
        .then((data) => {
            // no user logged in
            if (data == null) {
                loginSignupButton.classList.remove("none");
                logoutButton.classList.add("none");
                deleteButton.classList.add("none");
            } else {
                loginSignupButton.classList.add("none");
                logoutButton.classList.remove("none");
                deleteButton.classList.remove("none");
            }
        })
        .catch((error) => console.error("Error:", error));
}

// wait for login button to be loaded and then apply observer
onStartup().then(() => {
    const hiddenElements = document.getElementsByClassName("hidden");

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});

function clickLogout() {
    localStorage.removeItem("token");

    loginSignupButton.classList.remove("none");
    logoutButton.classList.add("none");
    deleteButton.classList.add("none");
}

async function clickDelete() {
    await fetch("/auth/delete", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    localStorage.removeItem("token");

    loginSignupButton.classList.remove("none");
    logoutButton.classList.add("none");
    deleteButton.classList.add("none");
}

// show the modal
function showDeleteConfirm() {
    document.getElementById("overlay").classList.remove("none");
}

// hook up yes and no buttons
document.getElementById("confirm-delete").addEventListener("click", () => {
    clickDelete();
    showToast("Account deleted");
    document.getElementById("overlay").classList.add("none");
});

document.getElementById("cancel-delete").addEventListener("click", () => {
    console.log("hello?");
    document.getElementById("overlay").classList.add("none");
});