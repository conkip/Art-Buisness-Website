/*
    Author: Connor Kippes

    Handles loging in or creating a new account.
*/

const invalidText = document.getElementById("invalid-text");
invalidText.style.visibility = "hidden";

let clickedButton = null;

// have to do this so it doesnt choose the wrong button when the form is submitted
document
    .querySelectorAll('#login-form button[type="submit"]')
    .forEach((btn) => {
        btn.addEventListener("click", (e) => {
            clickedButton = e.target;
        });
    });

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    if (clickedButton?.name && clickedButton?.value) {
        formData.set(clickedButton.name, clickedButton.value);
    }
    const data = Object.fromEntries(formData.entries());

    const buttonName = e.submitter.value;
    let res = null;
    if(buttonName === "login") {
        res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    } else if(buttonName === "signup") {
        res = await fetch("/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    }

    if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem("token", token);
        window.location.href = "/index.html";
    } else {
        const errorMsg = await res.text();
        invalidText.innerText = errorMsg;
        invalidText.style.visibility = "visible";
        setTimeout(() => {
            invalidText.style.visibility = "hidden";
        }, 2000);
    }

    clickedButton = null;
});
