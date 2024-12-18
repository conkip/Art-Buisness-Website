/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for profile.js
  fills up favorited and bidded on paintings based on the current user
*/

function afterStartup() {
    fetch(`http://${domainName}:${port}/getCurUser`)
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
            }
            else {
                document.getElementById("profileGreeting").innerText = `Hello, ${data.username}!`;
                setupPaintings(data.my_likes, data.my_bids);
            }
        })
        .catch(error => console.error('Error:', error));
}

afterStartup();

// example of profile layout
function setupPaintings(likes, bids) {
    for(let paintingName of likes) {
        fetch(`http://${domainName}:${port}/getPainting/${paintingName}`)
        .then((response) => response.json())
        .then(data => {
            console.log('Response:', data);
            let list = document.getElementById("yourFavs");
            addPainting(list.rows[0],list.rows[1], data);
        })
        .catch(error => console.error('Error:', error));
    }
    for(let paintingName of bids) {
        fetch(`http://${domainName}:${port}/getPainting/${paintingName}`)
        .then((response) => response.json())
        .then(data => {
            console.log('Response:', data);

            let list = document.getElementById("yourBids");
            addPainting(list.rows[0],list.rows[1], data);
        })
        .catch(error => console.error('Error:', error));
    }
}