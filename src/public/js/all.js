/*
    Author: Connor Kippes

    JS used in all pages.
*/

//add nav
fetch("/nav.html")
    .then((res) => res.text())
    .then((html) => {
        document.getElementById("nav-container").innerHTML = html;

        const navScript = document.createElement("script");
        navScript.src = "/js/nav.js?v=2";
        document.body.appendChild(navScript);
    });

// add footer
fetch("/footer.html")
    .then((res) => res.text())
    .then((html) => {
        document.getElementById("footer-container").innerHTML = html;
    });

function showToast(message, duration = 2000, className = "") {
    const toastContainer = document.getElementById("toast-container");
    let toast = document.createElement("div");
    toast.classList.add("toast");
    if (className) {
        toast.classList.add(className);
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}

function showConfirmModal({
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}) {
    // prevent duplicates
    closeModal();

    const modalHTML = `
    <div id="modal-container">
        <div id="modal-content">
            <p class="big-p">${message}</p>
            <button id="modal-confirm">${confirmText}</button>
            <button id="modal-cancel">${cancelText}</button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const container = document.getElementById("modal-container");
    const content = document.getElementById("modal-content");
    const confirmBtn = document.getElementById("modal-confirm");
    const cancelBtn = document.getElementById("modal-cancel");

    // stop inside clicks from closing
    content.addEventListener("click", (e) => e.stopPropagation());

    // actions
    confirmBtn.onclick = () => {
        closeModal();
        onConfirm?.();
    };

    cancelBtn.onclick = () => {
        closeModal();
        onCancel?.();
    };

    // click outside closes
    container.addEventListener("click", () => {
        closeModal();
        onCancel?.();
    });
}

function closeModal() {
    document.getElementById("modal-container")?.remove();
}