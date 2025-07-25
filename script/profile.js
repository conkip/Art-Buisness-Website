/*
    Author: Connor Kippes

    Fills up liked paintings based on the current user.
    Restructured to await for observer.
*/

async function afterStartup() {
    try {
        const response = await fetch(`/getCurUser`);
        let data = null;

        if (response.headers.get("Content-Length") !== "0") {
            data = await response.json();
        }

        console.log("Response:", data);

        if (data == null) {
            document.getElementById("profile-greeting").innerText =
                "Hello, Guest";
            await setupGuestPaintings();
        } else {
            document.getElementById(
                "profile-greeting"
            ).innerText = `Hello, ${data.username}!`;
            await setupPaintings(data.my_likes, data.my_bids);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function setupGuestPaintings() {
    try {
        const response = await fetch("/getGuestPaintings");
        let data = await response.text();
        data = data.trim();

        //makes it an empty array if there is no data
        let guestPaintings = data ? data.split(",") : [];

        for (let paintingName of guestPaintings) {
            const response2 = await fetch(`/getPainting/${paintingName}`);
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
        for (let paintingName of likes) {
            const response = await fetch(`/getPainting/${paintingName}`);
            const data = await response.json();

            const grid = document.getElementById("profile-grid");
            addPainting(grid, data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

afterStartup().then(() => {
    const hiddenElements = document.getElementsByClassName("hidden");

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});
