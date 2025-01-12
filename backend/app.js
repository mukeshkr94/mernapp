const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const buildpath = path.join(__dirname, "../frontend/build");
console.log(buildpath)
const app = express();
app.use(express.json());
app.use(express.static(buildpath));
app.use(cors(
     { 
        origin: "https://itsmukesh.site:3000",
        credentials: true,
    }
));
app.use(cookieParser());
require('./db/config');
app.get('/', (req, res)=>{
    res.send('App working');
})

const candidateRoute = require('./routes/candidateRoute');
// routes

app.use('/api', candidateRoute);
app.listen(process.env.PORT,(req, res)=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})