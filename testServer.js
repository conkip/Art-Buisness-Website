/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for testServer.js
  mock local host server for testing
*/

const express = require('express')
const app = express();
const port = 3000;
const hostname = 'localhost';

const cookieParser = require('cookie-parser');
app.use(cookieParser());

let username = null;

/**
 * startServer contains all of the information for creating the http server and
 * listening to it.
 */
async function startServer()
{
    app.get("/getCookie", (req,res) => {
        let old_count = req.cookies.username;
        if(old_count === undefined)
            old_count = "Guest"
        else
            old_count = Number(old_count);
    });

    app.get("/setCookie/:username", (req, res) => {
        res.cookie("username", "russ");
        res.send("Hello World")
    })

    app.get("/clearCookie", (req, res) => {
        res.clearCookie("username"); // Clear the "username" cookie
        res.send("Cookie has been cleared!");
    });

    app.get("/login/:username", (req,res) => {
        console.log("Request received on URL:", req.url);

        res.statusCode = 200;
        //res.setHeader("Content-Type", "text/plain");

        //serach db for the username
        username = "username";
        res.send(username);
    });

    app.get("/signup/:username", (req,res) => {
        console.log("Request received on URL:", req.url);

        res.statusCode = 200;
        //res.setHeader("Content-Type", "text/plain");

        //create new db entry for the username sent
        //if username exists, send false, else send true
        successful =true;
        res.send(successful);
    });

    app.get("/getuser", (req,res) => {
        console.log("Request received on URL:", req.url);

        res.statusCode = 200;
        //res.setHeader("Content-Type", "text/plain");

        //send the current user
        res.send(username);
    });

    /**
         * reportError is a general function called whenever the url is incorrect
         * and it displays a 404 page not found error.
         * 
         * req: request that is made to the server- not used in this
         * res: response to send to the server
         */
    function reportError(req,res) {
        res.statusCode = 404;
        //res.setHeader("Content-Type", "text/plain");
        res.send(`404: url=${req.url}`);
    }

    app.use(express.static("public_html"));
    app.use("/img", express.static("img"));
    app.use("/paintings", express.static("paintings"));
    app.use("/script", express.static("script"));
    app.use("/style", express.static("style"));
    

    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
}

startServer();