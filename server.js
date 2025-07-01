/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for testServer.js
  server for handling get opperations and talking to the database
*/
const setupPaintings = require('./setupPaintings');

const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

const domainName = '127.0.0.1';
const port = 3000;

// let domainName = 'kaseycreativecanvas.com';
// let port = 443;

let databaseName = 'localhost:27017';

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require('mongoose');
const URL = `mongodb://${databaseName}/projdb`;

let User = null;
let Painting = null;

let username = null;

/**
 * startServer contains all of the information for creating the http server and
 * listening to it.
 */
async function startServer()
{
    // database stuff
    await mongoose.connect(URL);

    const PaintingSchema = new mongoose.Schema({
        name: String,
        image: String,
        dimensions: String,
        date: String,
        paint: String,
        canvas: String,
        finish: String,
        desc: String,
        mult: { type: Boolean, default: false },
        framed: { type: Boolean, default: false },
        sold: { type: Boolean, default: false },
    });

    Painting = mongoose.model("Painting", PaintingSchema);

    const UserSchema = new mongoose.Schema({
        username: String,
        password: String,
        my_likes: { type: [String], default: [] }
    });

    User = mongoose.model("User", UserSchema);

    //delete first and then add paintings to db when running the server
    await mongoose.connection.db.collection("paintings").deleteMany({});
    await setupPaintings(Painting);


    // login routes

    app.get("/login/:someUsername/:somePassword", async (req,res) => {
        //console.log("Request to login received on URL:", req.url);

        let someUsername = req.params.someUsername.replaceAll("%20", " ");
        let somePassword = req.params.somePassword.replaceAll("%20", " ");
        
        let user = await User.findOne({username:someUsername});

        if(user != null) {
            let isMatch = await bcrypt.compare(somePassword, user.password);
            if(isMatch) {
                // set up the username cookie when you login successfully
                res.cookie("username", someUsername, { httpOnly: true });
                res.send(true); 
            }
            else {
                res.send(false);
            }
        }
        else {
            res.send(false);
        }
    });

    app.get("/signup/:someUsername/:somePassword", async(req,res) => {
        //console.log("Request to signup received on URL:", req.url);

        let someUsername = req.params.someUsername.replaceAll("%20", " ");

        let somePassword = req.params.somePassword.replaceAll("%20", " ");
        somePassword = await hashPassword(somePassword);

        let user = await User.findOne({username:someUsername})

        // user exists
        if(user != null){
            // sends t/f if successful or not
            res.send(false)
        }
        else{
            const newUser = new User({
                username: someUsername,
                password: somePassword
            });
    
            await newUser.save();
    
            res.send(true);
        }
    });

    app.get("/getCurUser", async (req,res) => {
        //console.log("Request to get the current user received on URL:", req.url);

        // get current cookie
        let curUsername = req.cookies.username;
        if(curUsername != undefined) {
            curUsername = curUsername.replaceAll("%20", " ");
        }

        // search db for it
        let user = await User.findOne({username:curUsername})

        res.send(user);
    });



    // logout route

    app.get("/clearCookies", (req, res) => {
        console.log("cleared cookies");
        res.clearCookie("username");
        res.send("Cookie Cleared");
    });

    

    // db routes

    app.get('/getPaintings', async (req, res) => {
        //console.log("got paintings");
        const paintings = await Painting.find();
        res.send(paintings);
    });

    app.get('/getPainting/:paintingName', async (req, res) => {
        let paintingName = req.params.paintingName.replaceAll("%20", " ");

        let painting = await Painting.findOne({name:paintingName});
        res.send(painting);
    });

    app.get("/updateLike/:curUsername/:paintingName/:isLiked", async (req,res) => {
        //console.log("Request to update a like received on URL:", req.url);

        let curUsername = req.params.curUsername.replaceAll("%20", " ");
        let paintingName = req.params.paintingName.replaceAll("%20", " ");
        let isLiked = req.params.isLiked;

        let theUser = await User.findOne({username:curUsername});

        if(isLiked == "false"){
            theUser.my_likes.push(paintingName);
        }
        else {
            const index = theUser.my_likes.indexOf(paintingName);
            theUser.my_likes.splice(index,1);
        }

        theUser.save();
        res.send("Updated like successfully");
    });

    // this route is for if a guest likes any paintings to save them as cookies
    app.get("/guestLike/:paintingName", (req, res) => {
        let paintingName = req.params.paintingName.replaceAll("%20", " ");

        // get current cookie
        let curPaintings = req.cookies.paintings;
        if(curPainting != undefined) {
            curPaintings = curPaintings.replaceAll("%20", " ");
        }

        // add the painting to the end
        res.cookie("paintings", curPaintings + " " + paintingName, { httpOnly: true });
        res.send("Cookie set!");
    });

    // this route is used for filling up the guest's profile with their likes
    app.get("/getGuestPaintings", (req, res) => {

        // get current cookie
        let curPaintings = req.cookies.paintings;
        if(curPainting != undefined) {
            curPaintings = curPaintings.replaceAll("%20", " ");
        }

        res.send(curPaintings);
    });


    app.use(express.static("public_html"));
    app.use("/img", express.static("img"));
    app.use("/paintings", express.static("paintings"));
    app.use("/script", express.static("script"));
    app.use("/style", express.static("style"));

    // error for undefined routes
    app.use((req, res, next) => {
        res.status(404).send('<h1>404 - Page Not Found</h1>');
    });
    

    app.listen(port, domainName, () => {
        console.log(`Server running at https://${domainName}:${port}/`);
    });
}



async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
    
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

startServer();