/*
    Author: Connor Kippes

    Handles authentication (login and signup).
*/

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode");

if (mode === "login") {
    document.getElementById("auth-title").textContent = "Welcome Back";
    document.querySelector("button[name='action']").textContent = "Login";
    document.querySelector("button[name='action']").value = "login";
} else if (mode === "signup") {
    document.getElementById("auth-title").textContent = "Welcome";
    document.querySelector("button[name='action']").textContent = "Signup";
    document.querySelector("button[name='action']").value = "signup";
}

/**
 * Handles form submission for login or signup.
 * @param {Event} e - The submit event.
 */
async function handleAuthSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const action = e.submitter.value; // "login" or "signup"
    const endpoint = `/auth/${action}`;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const { token } = await res.json();
            localStorage.setItem("token", token);
            window.location.replace("./index.html");
        } else {
            const errorMsg = await res.text();
            showToast(errorMsg, 3000, "toast-error");
        }
    } catch (error) {
        showToast("An error occurred. Please try again.", 3000, "toast-error");
        console.error("Auth error:", error);
    }
}

function showPassword() {
    let password = document.getElementById("password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}

// Attach event listener to the form
document
    .getElementById("auth-form")
    .addEventListener("submit", handleAuthSubmit);
