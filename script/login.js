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

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result = await res.text();
    console.log(result);

    if (result === "login error") {
        // no user found or password is incorrect
        // so display no user found of that name

        invalidText.innerText = "Username or password is incorrect.";
        invalidText.style.visibility = "visible";
        setTimeout(() => {
            invalidText.style.visibility = "hidden";
        }, 2000);
    } else if (result === "signup error") {
        // username taken
        invalidText.innerText = "Username is already taken.";
        invalidText.style.visibility = "visible";
        setTimeout(() => {
            invalidText.style.visibility = "hidden";
        }, 2000);
    } else {
        window.location.href = "/index.html";
    }
    clickedButton = null;
});
