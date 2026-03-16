/*
    Author: Connor Kippes

    Fills up liked paintings based on the current user.
    Restructured to await for observer.
*/

async function onStartup() {
    try {
        const response = await fetch(`/users/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        });

        const contentType = response.headers.get("Content-Type");
        let data = null;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        }

        if (data == null) {
            document.getElementById("profile-greeting").innerText =
                "Hello, Guest";
            await setupGuestPaintings();
        } else {
            document.getElementById(
                "profile-greeting"
            ).innerText = `Hello, ${data.username}!`;
            await setupPaintings(data.my_likes);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function setupGuestPaintings() {
    try {
        const response = await fetch("/user/guest/likes");
        let data = await response.text();
        data = data.trim();

        //makes it an empty array if there is no data
        let guestPaintings = data ? data.split(",") : [];

        for (let painting of guestPaintings) {
            const response2 = await fetch(`/paintings/${painting}`);
            const data2 = await response2.json();

            const grid = document.getElementById("profile-grid");
            addPainting(grid, data2);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function setupPaintings(likes) {
    try {
        for (let painting of likes) {
            const response = await fetch(`/paintings/${painting}`);
            const data = await response.json();

            const grid = document.getElementById("profile-grid");
            addPainting(grid, data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

onStartup().then(() => {
    const hiddenElements = document.getElementsByClassName("hidden");

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});
