/*
    Author: Connor Kippes

    JS used in all pages.
*/

//add nav
fetch("/nav.html")
    .then((res) => res.text())
    .then((html) => {
        document.getElementById("nav-container").innerHTML = html;

        // Load nav script after nav is injected (script tags in injected HTML won't execute)
        const navScript = document.createElement("script");
        navScript.src = "/js/nav.js";
        navScript.defer = true;
        document.body.appendChild(navScript);
    });

// add footer
fetch("/footer.html")
    .then((res) => res.text())
    .then((html) => {
        document.getElementById("footer-container").innerHTML = html;
    });

function showToast(message, duration = 2000) {
    const toastContainer = document.getElementById("toast-container");
    let toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}
