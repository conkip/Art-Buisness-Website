/*
    Author: Connor Kippes

    JS used in all pages.
*/

//add nav
fetch('/nav.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('nav-container').innerHTML = html;
    });

// add footer
fetch('/footer.html')
    .then(res => res.text())
    .then(html => {
        document.getElementById('footer-container').innerHTML = html;
    });