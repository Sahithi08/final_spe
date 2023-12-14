const express = require('express')
const cors = require("cors");
const bodyParser = require('body-parser')
const corsOptions = {
    origin:'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}

const app = express()
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json())
require("dotenv").config();
const db=require('./db')
const path = require('path')

app.use(cors({
    origin: '*',
    methods: '*',   
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin: *');
    res.header('Access-Control-Allow-Methods: *');
    res.header('Access-Control-Allow-Headers: *');
    next();
});

const roomsRoutes = require('./routes/roomsRoute')
const userRoute = require('./routes/userRoute')
const bookingsRoute=require('./routes/bookingsRoute')
app.use('/api/rooms',roomsRoutes)
app.use('/api/users' , userRoute)
app.use('/api/bookings' , bookingsRoute)

if(process.env.NODE_ENV ==='production')
{
    app.use('/' , express.static('client/build'))

    app.get('*' , (req , res)=>{

        res.sendFile(path.resolve(__dirname  , 'client/build/index.html'))

    })
}
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Node JS Server Started`))
module.exports = app;
