const path = require("path")
const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require("./config/db");
const cors = require('cors'); // Import the cors middleware
const port = process.env.PORT || 5001;

var cron = require('node-cron');
const axios = require('axios');

connectDB()

const app = express();

app.use(cors(
    {
    origin: 'http://localhost:3000/', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    }
)); // Use the cors middleware

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/notaSpese', require('./routes/notaSpeseRoutes'))
app.use('/api/schedaSpese', require('./routes/schedaSpeseRoutes'))


//serve frontend
if (process.env.NODE_ENV === 'production') {
    //set static folder
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get('*', (req, res)=> res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html' )))
} else {
   app.get('/', (req, res) => res.send("set .env to production")) 
}

app.use(errorHandler)

app.listen(port, ()=> console.log(`Server started on port ${port}`));

// cron.schedule('*/10 * * * * *', async () => {

  
//       const response = await axios.get('http://localhost:5000/api/event');
//       console.log(response.data, "NO PROTECTION"); // Handle the response as needed

//   });