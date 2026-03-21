/*
    Author: Connor Kippes

    Handles authentication (login and signup).
*/

const invalidText = document.getElementById("invalid-text");
invalidText.style.visibility = "hidden";

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
            window.location.href = "./index.html";
        } else {
            const errorMsg = await res.text();
            showError(errorMsg);
        }
    } catch (error) {
        showError("An error occurred. Please try again.");
        console.error("Auth error:", error);
    }
}

/**
 * Displays an error message temporarily.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    invalidText.innerText = message;
    invalidText.style.visibility = "visible";
    setTimeout(() => {
        invalidText.style.visibility = "hidden";
    }, 2000);
}

// Attach event listener to the form
document
    .getElementById("auth-form")
    .addEventListener("submit", handleAuthSubmit);
