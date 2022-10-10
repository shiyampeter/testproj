var express = require('express');
const bodyParser = require('body-parser');
var path = require('path');

require('dotenv').config();
require('./config/db');
const fileUpload = require('express-fileupload');

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/*app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));*/

var adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

//console.log("hi")
app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})