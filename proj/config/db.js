const mongoose = require("mongoose");


//const mongoString = process.env.MONGODB_URI;
//mongoose.connect(mongoString);

mongoose.connect(process.env.MONGODB_URI).then(
    () => {console.log("database connected..")},
    err => {
        console.error("database connection failed", err)
        process.exit()
    }
);

const database = mongoose.connection;

/*database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})*/



module.exports ={ mongoose ,database}