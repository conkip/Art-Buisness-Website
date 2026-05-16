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
    for (const elem of loggedInElems) {
        elem.style.display = loggedIn ? "flex" : "none";
    }
    for (const elem of loggedOutElems) {
        elem.style.display = loggedIn ? "none" : "flex";
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
    // fetch name before deleting
    let name = "";
    try {
        const res = await fetch("/user/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        if (res.ok) {
            const data = await res.json();
            name = data.name || data.username || "";
        }
    } catch {}

    await fetch("/auth/delete", {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    localStorage.removeItem("token");
    localStorage.setItem(
        "pendingToast",
        JSON.stringify({
            message: `User ${name} was deleted`,
            className: "toast-success",
        }),
    );
    window.location.reload(true);
}

// Check admin status
fetch("/auth/admin-status", {
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
})
    .then((response) => {
        if (response.ok) {
            document
                .querySelectorAll(".admin-link")
                .forEach((elem) => (elem.style.display = "block"));
        }
    })
    .catch(() => {
        // Not admin, link stays hidden
    });

// Define these first
function openMenu() {
    menuIcon.removeEventListener("click", openMenu);
    menuIcon.addEventListener("click", closeMenu);
    menu.style.display = "flex";
}

function closeMenu() {
    menuIcon.removeEventListener("click", closeMenu);
    menuIcon.addEventListener("click", openMenu);
    menu.style.display = "none";
}

// Then the rest of your code that uses them
const menuIcon = document.getElementById("nav-menu-icon");
const menu = document.getElementById("nav-mobile-menu");
menu.style.display = "none";
menuIcon.addEventListener("click", openMenu);

window.addEventListener("resize", () => {
    if (window.innerWidth > 940) {
        menuIcon.click();
    }
});
