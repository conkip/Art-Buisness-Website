/*
    Author: Connor Kippes

    Handles get opperations and talking to the database.
    includes setting and getting cookies,
    getting the current user,
    getting paintings,
*/
const setupPaintings = require("./setupPaintings");

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const domainName = "127.0.0.1";
const port = 3000;

// let domainName = 'kaseycreativecanvas.com';
// let port = 443;

let databaseName = "localhost:27017";

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const mongoose = require("mongoose");
const URL = `mongodb://${databaseName}/projdb`;

let User = null;
let Painting = null;

/**
 * startServer contains all of the information for creating the http server and
 * listening to it.
 */
async function startServer() {
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
        my_likes: { type: [String], default: [] },
    });

    User = mongoose.model("User", UserSchema);

    //delete first and then add paintings to db when running the server
    await mongoose.connection.db.collection("paintings").deleteMany({});
    await setupPaintings(Painting);

    // login routes

    app.get("/login/:someUsername/:somePassword", async (req, res) => {

        let someUsername = decodeURIComponent(req.params.someUsername);
        let somePassword = decodeURIComponent(req.params.somePassword);

        let user = await User.findOne({ username: someUsername });

        if (user != null) {
            let isMatch = await bcrypt.compare(somePassword, user.password);
            if (isMatch) {
                // set up the username cookie when you login successfully
                res.cookie("username", someUsername, { httpOnly: true });
                res.send(true);
            } else {
                res.send(false);
            }
        } else {
            res.send(false);
        }
    });

    app.get("/signup/:someUsername/:somePassword", async (req, res) => {

        let someUsername = decodeURIComponent(req.params.someUsername);

        let somePassword = decodeURIComponent(req.params.somePassword);
        somePassword = await hashPassword(somePassword);

        let user = await User.findOne({ username: someUsername });

        // user exists
        if (user != null) {
            // sends t/f if successful or not
            res.send(false);
        } else {
            const newUser = new User({
                username: someUsername,
                password: somePassword,
            });

            await newUser.save();

            res.send(true);
        }
    });

    app.get("/getCurUser", async (req, res) => {

        // get current cookie
        let curUsername = req.cookies.username;
        if (curUsername != undefined) {
            curUsername = decodeURIComponent(curUsername);
        }

        // search db for it
        let user = await User.findOne({ username: curUsername });

        res.send(user);
    });

    // logout route

    app.get("/clearCookies/:cookieName", (req, res) => {
        let cookieName = decodeURIComponent(req.params.cookieName);

        res.clearCookie(cookieName);
        res.send("Cookie Cleared");
    });

    // db routes

    app.get("/getPaintings", async (req, res) => {
        const paintings = await Painting.find();
        res.send(paintings);
    });

    app.get("/getPainting/:paintingName", async (req, res) => {
        let paintingName = decodeURIComponent(req.params.paintingName);

        let painting = await Painting.findOne({ name: paintingName });
        res.send(painting);
    });

    app.get(
        "/updateLike/:curUsername/:paintingName/:isLiked",
        async (req, res) => {

            let curUsername = decodeURIComponent(req.params.curUsername);
            let paintingName = decodeURIComponent(req.params.paintingName);
            let isLiked = req.params.isLiked;

            let theUser = await User.findOne({ username: curUsername });

            if (isLiked == "false") {
                theUser.my_likes.push(paintingName);
            } else {
                const index = theUser.my_likes.indexOf(paintingName);
                theUser.my_likes.splice(index, 1);
            }

            theUser.save();
            res.send("Updated like successfully");
        }
    );

    // this route is for if a guest likes any paintings to save them as cookies
    app.get("/updateGuestLike/:paintingName", (req, res) => {
        let paintingName = decodeURIComponent(req.params.paintingName);

        // get current cookie
        let curPaintings = req.cookies.paintings;
        if (curPaintings == undefined) {
            // create the new cookie with the painting name
            res.cookie("paintings", paintingName, { httpOnly: true });
            res.send("Cookie set!");
        } else {
            curPaintings = decodeURIComponent(curPaintings);
            let splitPaintings = curPaintings.split(",");
            let foundPainting = false;

            for (let painting of splitPaintings) {
                if (painting == paintingName) {
                    foundPainting = true;
                    break;
                }
            }

            if (foundPainting) {
                //remove the painting from likes
                let index = splitPaintings.indexOf(paintingName);
                splitPaintings.splice(index, 1);

                //convert back to a string
                let newCurPaintings = "";
                for (let painting of splitPaintings) {
                    newCurPaintings += painting + ",";
                }
                //remove trailing comma if it exists
                let trimmed = newCurPaintings.endsWith(",")
                    ? newCurPaintings.slice(0, -1)
                    : newCurPaintings;

                res.cookie("paintings", trimmed, { httpOnly: true });
                res.send("Cookie set!");
            } else {
                if(curPaintings == "")
                {
                    res.cookie("paintings", paintingName, {httpOnly: true,});
                }
                else {
                    // add the painting to the end if theres already one
                    res.cookie("paintings", curPaintings + "," + paintingName, {
                        httpOnly: true,
                    });
                }
                res.send("Cookie set!");
            }
        }
    });

    // this route is used for filling up the guest's profile with their likes
    app.get("/getGuestPaintings", (req, res) => {
        // get current cookie
        let curPaintings = req.cookies.paintings;
        if (curPaintings != undefined) {
            curPaintings = decodeURIComponent(curPaintings);
            res.send(curPaintings);
        } else {
            res.send("");
        }
    });

    app.use(express.static("public_html"));
    app.use("/img", express.static("img"));
    app.use("/paintings_webp", express.static("paintings_webp"));
    app.use("/script", express.static("script"));
    app.use("/style", express.static("style"));

    // error for undefined routes
    app.use((req, res, next) => {
        res.status(404).send("<h1>404 - Page Not Found</h1>");
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
