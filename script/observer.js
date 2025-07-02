/*
    Author: Connor Kippes

    Function to initialize an observer to make elements fade in and out.
*/

window.observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show"); //fade in
        } else {
            entry.target.classList.remove("show"); //fade out
        }
    });
});

//test