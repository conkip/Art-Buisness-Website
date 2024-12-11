/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for testServer.js
  server for handling get opperations and talking to the database
*/

const express = require('express')
const app = express();
const port = 3000;
const hostname = '127.0.0.1'; //local host for now

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require('mongoose');
const URL = "mongodb://127.0.0.1/myDB";

let username = null;

/**
 * startServer contains all of the information for creating the http server and
 * listening to it.
 */
async function startServer()
{
    await setupDatabase();
    await mongoose.connect(URL);

    const UserSchema = new mongoose.Schema({
        username: String,
        fav_paintings: Array,
        bid_paintings: Array});
    
    const User = mongoose.model("User", UserSchema);

    await setupPaintings();

    // Define routes
    app.get('/users', async (req, res) => {
    const users = await User.find(); // Fetch all users
    res.json(users);
    });

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

async function setupPaintings() {
    const PaintingSchema = new mongoose.Schema({
        name: String,
        image: String,
        desc: String,
        bid: Number
    });

    const Painting = mongoose.model("Painting", PaintingSchema)

    let template = new Painting({
        name: "Example",
        image: "Example.jpg",
        desc: "Dimensions (ex- 24x24)\nDate (ex- 2015)\nPaint Type (ex- Oil, acrylic)\n" +
              "Support/Surface (ex- Wood, Fabric)\nFinish (Matte, Glossy)\nFramed(optional)",
        bid:0
    });

    let painting1 = new Painting({
        name: "Beyone The Limit",
        image: "BeyondTheLimit.jpg",
        desc: "24x24 x 3\n2015\nOil\nWood\nExpoxy coating",
        bid:0
    });

    await painting1.save();

    let painting2 = new Painting({
        name: "Blue Pallete",
        image: "BluePallete.jpg",
        desc: "36x36\n2015\nOil\nFabric\nTextured",
        bid:0
    });

    await painting2.save();

    let painting3 = new Painting({
        name: "Chasing Blues",
        image: "ChasingBlues.jpg",
        desc: "16x24\n2015\nOil\n_\n_",
        bid:0
    });

    await painting3.save();

    let painting4 = new Painting({
        name: "Circular Echo",
        image: "CircularEcho.jpg",
        desc: "24x24\n2015\n_\n_\n_",
        bid:0
    });

    await painting4.save();

    let painting5 = new Painting({
        name: "Colors In Motion",
        image: "ColorsInMotion.jpg",
        desc: "30x36\n2015\nAcrylic\n_\n_",
        bid:0
    });

    await painting5.save();

    let painting6 = new Painting({
        name: "Colors Of Liberty",
        image: "ColorsOfLiberty.jpg",
        desc: "24x30\n2015\n_\n_\n_",
        bid:0
    });

    await painting6.save();

    let painting7 = new Painting({
        name: "Color Spectrum",
        image: "ColorSpectrum.jpg",
        desc: "36x48\n2015\nAcrylic\nWood\nEpoxy Coating",
        bid:0
    });

    await painting7.save();

    let painting8 = new Painting({
        name: "Cosmic Tides",
        image: "CosmicTides.jpg",
        desc: "12x18\n2015\nAcrylic\n_\n_",
        bid:0
    });

    await painting8.save();

    let painting9 = new Painting({
        name: "Dot Fusion",
        image: "DotFusion.jpg",
        desc: "48x48\n2015\n_\n_\n_",
        bid:0
    });

    await painting9.save();

    let painting10 = new Painting({
        name: "Dot Symphony",
        image: "DotSymphony.jpg",
        desc: "?x?\n2015\n_\n_\n_",
        bid:0
    });

    await painting10.save();

    let painting11 = new Painting({
        name: "Eternal Light",
        image: "EternalLight.jpg",
        desc: "36x48\n2015\nOil\n_\n_\nFramed",
        bid:0
    });

    await painting11.save();

    let painting12 = new Painting({
        name: "Eternal Sunshine",
        image: "EternalSunshine.jpg",
        desc: "36x48\n2015\nAcrylic\n_\n_",
        bid:0
    });

    await painting12.save();

    let painting13 = new Painting({
        name: "Flowing Essence",
        image: "FlowingEssence.jpg",
        desc: "6x6 x 3\n2015\nAcrylic\nWood\nEpoxy Coating",
        bid:0
    });

    await painting13.save();

    let painting14 = new Painting({
        name: "Hazy Drift",
        image: "HazyDrift.jpg",
        desc: "36x60\n2015\nAcrylic\n_\n_",
        bid:0
    });

    await painting14.save();

    let painting15 = new Painting({
        name: "Liquid Dreamscapes",
        image: "LiquidDreamscapes.jpg",
        desc: "?x?\n2015\n_\n_\n_",
        bid:0
    });

    await painting15.save();

    let painting16 = new Painting({
        name: "Liquid Horizons",
        image: "LiquidHorizons.jpg",
        desc: "48x60\n2015\n_\n_\n_",
        bid:0
    });

    await painting16.save();

    let painting17 = new Painting({
        name: "Oribits In Motion",
        image: "OribitsInMotion.jpg",
        desc: "8x8 x 4\n2015\n_\nWood\n_",
        bid:0
    });

    await painting17.save();

    let painting18 = new Painting({
        name: "Pinwheel",
        image: "Pinwheel.jpg",
        desc: "36x48\n2015\nAcrylic\n_\n_",
        bid:0
    });

    await painting18.save();

    let painting19 = new Painting({
        name: "Retro Vibe",
        image: "RetroVibe.jpg",
        desc: "36x48\n2015\nAcrylic\nWood\nEpoxy coating",
        bid:0
    });

    await painting19.save();

    let painting20 = new Painting({
        name: "Spectrum Of The Sea",
        image: "SpectrumOfTheSea.jpg",
        desc: "18x24\n2015\nAcrylic\n_\n_\nFloating Frame",
        bid:0
    });

    await painting20.save();

    let painting21 = new Painting({
        name: "StrokesOfLight",
        image: "Strokes Of Light.jpg",
        desc: "18x24\n2015\nOil\n_\n_\nFramed",
        bid:0
    });

    await painting21.save();

    let painting22 = new Painting({
        name: "Sun's Awakening",
        image: "SunsAwakening.jpg",
        desc: "18x24\n2015\nAcrylic\nWood\nEpoxy Coating\nFramed",
        bid:0
    });

    await painting22.save();
}
startServer();