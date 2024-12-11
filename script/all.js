/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for login.js
  handles loging in or creating a new account
*/
currentPage = ""

function updatePage(pageName) {
    currentPage = pageName
    //get current username
    //update page based on that
    if(username == null){
        window.location.href = '/login.html';
    }
    else{
        window.location.href = `/${pageName}`;
    }
}

//