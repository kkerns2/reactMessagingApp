//=========================================================
//server.js file
//Written By: Keegan Kerns
//Last Updated: Nov 27 2020
//Purpose: Hosts socketio interactions. Instanciates the router
//         and server connections as well as renders the build
//         file from the front end.
//==========================================================

const express     = require('express');
const http        = require('http');
const cors        = require('cors');
const socketio    = require('socket.io');
const app         = express();
const mysql       = require('mysql');
const session     = require('express-session');
const path        = require('path');
const morgan      = require ('morgan');
const dotenv      = require ('dotenv');
const MySQLStore  = require('express-mysql-session')(session);
const Router      = require('./Router');


app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());


//PORT config
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketio(server);

//Database connection
const db = mysql.createConnection({
  host:'localhost',
  user:'admin',
  password:'@dm!nsql4331C',
  database:'users'
});

db.connect(function(err){
  if(err){
    console.log('DB Error Occured');
    throw err;
    return false;
  }
});
//session logging
const sessionStore = new MySQLStore({
  expiration: (1825 * 86400 * 1000),    //session length
  endConnectionOnClose: false
}, db);

//session information and cookie config
app.use(session({
  key: 'fhsfu9ujwyr83498547ujkdjfoijemfm',
  secret: 'jfkdsjmfdskfjdskfdlsakkndiiur94975',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie:{
    maxAge:(1825 * 86400 * 1000),
    httpOnly: false,
    secure: false
  }
}));

//socket io interactions and handling
var connectedUsers = {};
io.on("connection", (socket) => {
  console.log(`A user has connected to a Socket`);

  socket.on("login", (id) => {
    connectedUsers[id] = socket.id;
    console.log(connectedUsers);
  })
  //find the user based on their socket

  socket.on("message", (messages, id) => {
    let sender = messages[messages.length -1].member.username;
    socket.to(connectedUsers[id]).emit("message", messages, sender);
  })//send the message to user

  socket.on("logout", (id) => {
    delete connectedUsers[id];
    console.log("User is leaving");
  })

  socket.on("disconnect",(socket) => {
    console.log("user disconnected from Socket")
  })

})


//Instance of new router
new Router(app, db);

//renders the build folder aka the frontend
app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`)); //end at 18:07

//with this now we can start the app with node.js instead of booting the front end and back end separately.
