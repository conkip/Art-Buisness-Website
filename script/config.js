const mongoose = require('mongoose');
const mongoDB = "mongodb://leah.knodel.me/projdb" ;
const db = mongoose.connection;

async function main() {
    await mongoose.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.console();
    });
}
