/*
  Connor Kippes, Leah Knodel, Blue Garrabrant
  CSC337
  Final Project - Creative Canvas Art Website

  Javascript for testServer.js
  server for handling get opperations and talking to the database
*/

const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

const domainName = '127.0.0.1';
const port = 3000;

// let domainName = 'kaseycreativecanvas.com';
// let port = 80;

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
        desc: String,
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
    await setupPaintings();


    // login routes

    app.get("/login/:someUsername/:somePassword", async (req,res) => {
        console.log("Request received on URL:", req.url);
        res.statusCode = 200;

        let someUsername = req.params.someUsername;
        someUsername = someUsername.replaceAll("%20", " ");

        let somePassword = req.params.somePassword;
        somePassword = somePassword.replaceAll("%20", " ");
        
        let user = await User.findOne({username:someUsername});

        if(user != null) {
            let isMatch = await bcrypt.compare(somePassword, user.password);
            if(isMatch) {
                // set up the username cookie when you login successfully
                res.cookie("username", someUsername);
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
        console.log("Request received on URL:", req.url);
        res.statusCode = 200;

        let someUsername = req.params.someUsername;
        someUsername = someUsername.replaceAll("%20", " ");

        let somePassword = req.params.somePassword;
        somePassword = somePassword.replaceAll("%20", " ");
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
        console.log("Request received on URL:", req.url);
        res.statusCode = 200;

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
        res.clearCookie("username");
        res.send("Cookie Cleared");
    });

    

    // db routes

    app.get('/getPaintings', async (req, res) => {
        const paintings = await Painting.find();
        res.send(paintings);
    });

    app.get('/getPainting/:paintingName', async (req, res) => {
        let paintingName = req.params.paintingName;
        paintingName = paintingName.replaceAll("%20", " ");

        let painting = await Painting.findOne({name:paintingName});
        res.send(painting);
    });

    app.get("/updateLike/:curUsername/:paintingName/:isLiked", async (req,res) => {
        console.log("Request received on URL:", req.url);
        res.statusCode = 200;

        let curUsername = req.params.curUsername;
        curUsername = curUsername.replaceAll("%20", " ");
        let paintingName = req.params.paintingName;
        paintingName = paintingName.replaceAll("%20", " ");
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
        console.log(`Server running at http://${domainName}:${port}/`);
    });
}



async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)
    
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}



async function setupPaintings() {
    let template = new Painting({
        name: "Example",
        image: "Example.jpg",
        desc: "Dimensions (ex- 24x24)\nDate (ex- 2015)\nPaint Type (ex- Oil, acrylic)\n" +
              "Support/Surface (ex- Wood, Fabric)\nFinish (Matte, Glossy)\nFramed(optional)",
    });

    let painting1 = new Painting({
        name: "Beyond The Limit",
        image: "BeyondTheLimit.jpg",
        desc: "3 x 24x24\n2015\nOil Paint\nWood Canvas\nExpoxy Coating"
    });

    await painting1.save();

    let painting2 = new Painting({
        name: "Blue Pallete",
        image: "BluePallete.jpg",
        desc: "36x36\n2015\nOil Paint\nFabric Canvas\nTextured Finish"
    });

    await painting2.save();

    let painting3 = new Painting({
        name: "Chasing Blues",
        image: "ChasingBlues.jpg",
        desc: "16x24\n2015\nOil Paint\n_ Canvas\n_ Finish"
    });

    await painting3.save();

    let painting4 = new Painting({
        name: "Circular Echo",
        image: "CircularEcho.jpg",
        desc: "24x24\n2015\n_ Paint\n_ Canvas\n_ Finish"
    });

    await painting4.save();

    let painting5 = new Painting({
        name: "Colors In Motion",
        image: "ColorsInMotion.jpg",
        desc: "30x36\n2015\nAcrylic Paint\n_ Canvas\n_ Finish"
    });

    await painting5.save();

    let painting6 = new Painting({
        name: "Colors Of Liberty",
        image: "ColorsOfLiberty.jpg",
        desc: "24x30\n2015\n_ Paint\n_Canvas\n_ Finish"
    });

    await painting6.save();

    let painting7 = new Painting({
        name: "Color Spectrum",
        image: "ColorSpectrum.jpg",
        desc: "36x48\n2015\nAcrylic Paint\nWood Canvas\nEpoxy Coating"
    });

    await painting7.save();

    let painting8 = new Painting({
        name: "Cosmic Tides",
        image: "CosmicTides.jpg",
        desc: "12x18\n2015\nAcrylic Paint\n_ Canvas\n_ Finish",
        sold: true
    });

    await painting8.save();

    let painting9 = new Painting({
        name: "Dot Fusion",
        image: "DotFusion.jpg",
        desc: "48x48\n2015\n_ Paint\n_ Canvas\n_ Finish"
    });

    await painting9.save();

    let painting10 = new Painting({
        name: "Dot Symphony",
        image: "DotSymphony.jpg",
        desc: "_x_\n2015\n_ Paint\n_ Canvas\n_ Finish",
        sold: true
    });

    await painting10.save();

    let painting11 = new Painting({
        name: "Eternal Light",
        image: "EternalLight.jpg",
        desc: "36x48\n2015\nOil Paint\n_ Canvas\n_ Finish\nFramed",
        sold: true
    });

    await painting11.save();

    let painting12 = new Painting({
        name: "Eternal Sunshine",
        image: "EternalSunshine.jpg",
        desc: "36x48\n2015\nAcrylic Paint\n_ Canvas\n_ Finish",
        sold: true
    });

    await painting12.save();

    let painting13 = new Painting({
        name: "Flowing Essence",
        image: "FlowingEssence.jpg",
        desc: "3 x 6x6\n2015\nAcrylic Paint\nWood Canvas\nEpoxy Coating",
        sold: true
    });

    await painting13.save();

    let painting14 = new Painting({
        name: "Hazy Drift",
        image: "HazyDrift.jpg",
        desc: "36x60\n2015\nAcrylic Paint\n_ Canvas\n_ Finish"
    });

    await painting14.save();

    let painting15 = new Painting({
        name: "Liquid Dreamscapes",
        image: "LiquidDreamscapes.jpg",
        desc: "_x_\n2015\n_ Paint\n_ Canvas\n_ Finish",
        sold: true
    });

    await painting15.save();

    let painting16 = new Painting({
        name: "Liquid Horizons",
        image: "LiquidHorizons.jpg",
        desc: "48x60\n2015\n_ Paint\n_ Canvas\n_ Finish"
    });

    await painting16.save();

    let painting17 = new Painting({
        name: "Oribits In Motion",
        image: "OribitsInMotion.jpg",
        desc: "4 x 8x8\n2015\n_ Paint\nWood Canvas\n_ Finish"
    });

    await painting17.save();

    let painting18 = new Painting({
        name: "Pinwheel",
        image: "Pinwheel.jpg",
        desc: "36x48\n2015\nAcrylic Paint\n_ Canvas\n_ Finish",
        sold: true
    });

    await painting18.save();

    let painting19 = new Painting({
        name: "Retro Vibe",
        image: "RetroVibe.jpg",
        desc: "36x48\n2015\nAcrylic Paint\nWood Canvas\nEpoxy coating",
        sold: true
    });

    await painting19.save();

    let painting20 = new Painting({
        name: "Spectrum Of The Sea",
        image: "SpectrumOfTheSea.jpg",
        desc: "18x24\n2015\nAcrylic Paint\n_ Canvas\n_ Finish\nFloating Frame",
        sold: true
    });

    await painting20.save();

    let painting21 = new Painting({
        name: "Strokes Of Light",
        image: "StrokesOfLight.jpg",
        desc: "18x24\n2015\nOil Paint\n_ Canvas\n_ Finish\nFramed",
        sold: true
    });

    await painting21.save();

    let painting22 = new Painting({
        name: "Sun's Awakening",
        image: "SunsAwakening.jpg",
        desc: "18x24\n2015\nAcrylic Paint\nWood Canvas\nEpoxy Coating\nFramed"
    });

    await painting22.save();
}
startServer();