const links = document.getElementById("nav-links");
const loggedInElems = document.querySelectorAll(".nav-logged-in");
const loggedOutElems = document.querySelectorAll(".nav-logged-out");

// Check login status and toggle nav lists
async function checkLoginStatus() {
    try {
        const res = await fetch("/user/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (res.ok) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    } catch (error) {
        console.error("Error checking login:", error);
        // assume not logged in
        setLoggedIn(false);
    }
}

function setLoggedIn(loggedIn) {
    for(const elem of loggedInElems) {
        elem.style.display = loggedIn ? "flex" : "none";
    }
    for(const elem of loggedOutElems) {
        elem.style.display = loggedIn ? "none": "flex";
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
            <button id="modal-confirm-delete" class="hover-shadow">Yes, delete</button>
            <button id="modal-cancel-delete" class="hover-shadow">Cancel</button>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Prevent clicks inside modal from bubbling
    document.getElementById("modal-content").addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Add onclicks to buttons
    document.getElementById("modal-cancel-delete").onclick = closeModal;
    document.getElementById("modal-confirm-delete").onclick = () => {
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
            document.querySelectorAll(".admin-link").forEach(elem => elem.style.display = "block");
        }
    })
    .catch(() => {
        // Not admin, link stays hidden
    });

const menuIcon = document.getElementById('nav-menu-icon');
const menu = document.getElementById('nav-mobile-menu');
menu.style.display = 'none';

menuIcon.addEventListener('click', openMenu);

function openMenu() {
    menuIcon.removeEventListener('click', openMenu);
    menuIcon.addEventListener('click', closeMenu);
    menu.style.display = 'flex';
}

function closeMenu(){
    menuIcon.removeEventListener('click', closeMenu);
    menuIcon.addEventListener('click', openMenu);
    menu.style.display = 'none';
}

window.addEventListener("resize", () => {
    if (window.innerWidth > 940) {
        menuIcon.click();
    }
});