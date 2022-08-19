const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); // MongoDB database driver
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');

// import the dotenv package and run the config command to get it working so we can store hidden environment variables
require('dotenv').config();

// configure the app by calling Express as a function
const app = express();

// define the port that express will listen on and 
const PORT = process.env.PORT || 9000;

// declare a server variable that we will assign the Express server to
let server;

// configure middleware
// app.use gets run with every request
app.use(cors()); // cross-origin resource sharing
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' })); // bodyParser deprecated but I think the useNewUrlParser property in the connect config will handle this. Limit on what we can recieve and process set to an arbitrary 5mb to account for images.
app.use(bodyParser.json({ limit: '5mb' })); 
// app.use(express.json()); // middleware that handles json data parsing

// check for this route and render userRoutes
app.use('/api/users/', userRoutes);

/** ------ connect to the database ------
 * 
 * pass in the database URI string as the first argument and an options object as the second argument
 * .connect() also returns a promise so handle that
 * https://mongoosejs.com/docs/connections.html
*/ 
mongoose.connect(process.env.DB_URI, {
  // avoid deprecation warnings and issues with the following settings...
  useUnifiedTopology: true, // use the new Server Discover and Monitoring engine
  useNewUrlParser: true // use the new parser. Once connected, parser is no longer important
}).then(() => { console.log('Database connection established')})
.catch((err) => {'Error conencting to MongoDB instance', err});

// initialize the express server
// the server.listen() method listens for requests on the port name or host name you give it.
server = app.listen(PORT, () => {
  console.log(`Node server running on port: ${PORT}`);
});
