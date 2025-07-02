/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for profile.js
  fills up favorited and bidded on paintings based on the current user
*/

async function afterStartup() {
    fetch(`/getCurUser`)
        .then((response) => {
            if (response.headers.get("Content-Length") === "0") {
                return null;
            }
            return response.json();
        })
        .then((data) => {
                console.log("Response:", data);

                if (data == null) {
                    document.getElementById("profile-greeting").innerText =
                        "Hello, Guest";
                    setupGuestPaintings();
                } else {
                    document.getElementById(
                        "profile-greeting"
                    ).innerText = `Hello, ${data.username}!`;
                    setupPaintings(data.my_likes, data.my_bids);
                }
            })
        .catch((error) => console.error("Error:", error));
}

afterStartup();

/*afterStartup().then(() => {
    const hiddenElements = document.getElementsByClassName('hidden');

    for (let i = 0; i < hiddenElements.length; i++) {
        window.observer.observe(hiddenElements[i]);
    }
});*/

async function setupGuestPaintings() {
    fetch("/getGuestPaintings")
        .then((response) => response.text())
        .then((data) => 
            async function getPaintings()
            {
                data = data.trim();
                let guestPaintings = [];
                if (data != "") {
                    guestPaintings = data.split(",");
                }

                for (let paintingName of guestPaintings) {
                    fetch(`/getPainting/${paintingName}`)
                        .then((response2) => response2.json())
                        .then((data2) => {
                            console.log("Response:", data2);
                            let list = document.getElementById("your-likes");
                            addPainting(list.rows[0], list.rows[1], data2);
                        })
                        .catch((error) => console.error("Error:", error));
                }
            })
        .catch((error) => console.error("Error:", error));
}

async function setupPaintings(likes, bids) {
    for (let paintingName of likes) {
        fetch(`/getPainting/${paintingName}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Response:", data);
                let list = document.getElementById("your-likes");
                addPainting(list.rows[0], list.rows[1], data);
            })
            .catch((error) => console.error("Error:", error));
    }
}
