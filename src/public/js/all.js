/*
    Author: Connor Kippes

    JS used in all pages. Adds the nav and footer, as well as the modal and toast logic.
*/

//add nav
fetch("/nav.html")
    .then((res) => res.text())
    .then((html) => {
        // add nav container to top
        const navContainer = document.createElement("div");
        navContainer.id = "nav-container";
        navContainer.innerHTML = html;
        document.getElementById("page-wrapper").prepend(navContainer);

        const navScript = document.createElement("script");
        navScript.src = "/js/nav.js?v=2";
        document.body.appendChild(navScript);
    });

// add footer
fetch("/footer.html")
    .then((res) => res.text())
    .then((html) => {
        // add footer to bottom
        const footerContainer = document.createElement("div");
        footerContainer.id = "footer-container";
        footerContainer.innerHTML = html;
        document.getElementById("page-wrapper").append(footerContainer);
    });

/*-----------TOAST-----------*/

// always create toast container immediately
const toastContainer = document.createElement("div");
toastContainer.id = "toast-container";
document.body.appendChild(toastContainer);

function showToast(message, className = "") {
    const toastContainer = document.getElementById("toast-container");
    let toast = document.createElement("div");
    toast.classList.add("toast");
    if (className) {
        toast.classList.add(className);
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);

    const duration = 3000;
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// show any pending toast from before a reload
const pendingToast = localStorage.getItem("pendingToast");
if (pendingToast) {
    const { message, className } = JSON.parse(pendingToast);
    localStorage.removeItem("pendingToast");
    showToast(message, className);
}

/*-------MODAL---------*/

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
            <div class="modal-button-container">
                <button id="modal-confirm">${confirmText}</button>
                <button id="modal-cancel">${cancelText}</button>
            </div>
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
