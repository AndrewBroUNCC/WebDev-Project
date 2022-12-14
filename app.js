//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');

//install in terminal [npm i mongoose] and call it below
const mongoose = require('mongoose');

const connectionRoutes = require('./routes/connectionRoutes');
const mainRoutes = require('./routes/mainRoute');



//create app
const app = express();

//config app
let port = 3000;
let host = 'localhost';
//set url to mongo's database which is local hosted.
let url = 'mongodb://localhost:27017/NBAD';
app.set('view engine', 'ejs');

//connect to MongoDB
mongoose.connect(url)
.then(()=>{
    //start the server
    app.listen(port, host, ()=>{
    console.log('Server is running on port', port);
})
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes
app.use('/', mainRoutes);
// app.get('/', (req, res) => {
//     res.render('index');
// });

app.use('/stories', connectionRoutes);

//404 error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    //this makes the next error handler use this error
    next(err);
});

//next deals with 404 errors
//500 error handling
app.use((err, req, res, next)=>{
    
    //show the err logs
    console.log(err.stack);
    
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});

//start the server
//(update) moved to mongoDB
// app.listen(port, host, () => {
//     console.log('Server is running on port', port);
// });