/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for profile.js
  fills up favorited and bidded on paintings based on the current user
*/

function afterStartup() {
    fetch(`/getCurUser`)
        .then((response) => {
            if (response.headers.get('Content-Length') === '0') {
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);

            if(data == null){
                document.getElementById("profileGreeting").innerText = "Hello, Guest";
                setupGuestPaintings()
            }
            else {
                document.getElementById("profileGreeting").innerText = `Hello, ${data.username}!`;
                setupPaintings(data.my_likes, data.my_bids);
            }
        })
        .catch(error => console.error('Error:', error));
}

afterStartup();

//
function setupGuestPaintings() {
    fetch(`/getGuestPaintings`)
        .then((response) => response.json())
        .then(data => {
            console.log('Response:', data);

            let guestPaintings = data.split(" ");
            for(let paintingName of guestPaintings) {
                fetch(`/getPainting/${paintingName}`)
                .then((response) => response.json())
                .then(data => {
                    console.log('Response:', data);
                    let list = document.getElementById("yourLikes");
                    addPainting(list.rows[0],list.rows[1], data);
                })
                .catch(error => console.error('Error:', error));
            }

            let list = document.getElementById("yourLikes");
            addPainting(list.rows[0],list.rows[1], data);
        })
        .catch(error => console.error('Error:', error));
}

// example of profile layout
function setupPaintings(likes, bids) {
    for(let paintingName of likes) {
        fetch(`/getPainting/${paintingName}`)
        .then((response) => response.json())
        .then(data => {
            console.log('Response:', data);
            let list = document.getElementById("yourLikes");
            addPainting(list.rows[0],list.rows[1], data);
        })
        .catch(error => console.error('Error:', error));
    }
}