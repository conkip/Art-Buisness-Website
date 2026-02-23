/*
    Author: Connor Kippes

    JS used in all pages.
*/

//add nav
fetch("/nav.html")
    .then((res) => res.text())
    .then((html) => {
        document.getElementById("nav-container").innerHTML = html;
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
