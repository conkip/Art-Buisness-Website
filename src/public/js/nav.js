const hamburger = document.getElementById("hamburger-menu");
const navLinks = document.getElementById("nav-links");
const navLoggedOut = document.getElementById("nav-logged-out");
const navLoggedIn = document.getElementById("nav-logged-in");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    navLoggedOut.classList.toggle("active");
    navLoggedIn.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// Check login status and toggle nav lists
async function checkLoginStatus() {
    try {
        const res = await fetch("/user/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (res.ok) {
            // logged in
            navLoggedOut.style.display = "none";
            navLoggedIn.style.display = "flex";
        } else {
            // not logged in
            navLoggedOut.style.display = "flex";
            navLoggedIn.style.display = "none";
        }
    } catch (error) {
        console.error("Error checking login:", error);
        // assume not logged in
        navLoggedOut.style.display = "flex";
        navLoggedIn.style.display = "none";
    }
}

checkLoginStatus();

// Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.reload(true);
}

// Delete account function
async function deleteAccount() {
    await fetch("/auth/delete", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    localStorage.removeItem("token");
    window.location.reload(true);
    showToast("Account deleted");
}

// Show delete confirmation modal
function showDeleteAccountModal() {
    const modalHTML = `
    <div id="modal-container">
        <div id="modal-content">
            <p class="big-p">Are you sure you want to delete your account?</p>
            <button id="confirm-delete" class="hover-shadow">Yes, delete</button>
            <button id="cancel-delete" class="hover-shadow">Cancel</button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Prevent clicks inside modal from bubbling
    document.getElementById("modal-content").addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Add onclicks to buttons
    document.getElementById("cancel-delete").onclick = closeModal;
    document.getElementById("confirm-delete").onclick = () => {
        deleteAccount();
        closeModal();
    };

    // Click outside closes
    document.getElementById("modal-container").addEventListener("click", (e) => {
        if (!e.target.closest("#modal-content")) closeModal();
    });

}

function closeModal() {
    console.log("modal closed!");
    document.getElementById("modal-container")?.remove();
}

// Check admin status
fetch("/auth/admin-status", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
})
    .then((response) => {
        if (response.ok) {
            document.getElementById("admin-link").style.display = "block";
        }
    })
    .catch(() => {
        // Not admin, link stays hidden
    });
