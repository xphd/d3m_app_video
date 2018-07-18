var express = require("express");
var http = require("http");
var socketIO = require("socket.io");
var fs = require("fs");

var app = express();
var router = express.Router();

const BASE_URL = "http://localhost:3000/";

// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(express.static("public"));
var server = http.createServer(app);
var io = socketIO(server);
io.on("connection", socket => {
  console.log("Server: get Client");

  // listen to "getVideoLinks" emmited from frontend
  socket.on("requestVideoLinks", () => {
    console.log("requestVideoLinks activated");
    // get the list of links to Video file in this server
    var videoLinks = [];
    const videoFolder = "./public/";
    fs.readdirSync(videoFolder).forEach(subFolder => {
      fs.readdirSync(videoFolder + "/" + subFolder).forEach(file => {
        var link = BASE_URL + subFolder + "/" + file;
        videoLinks.push(link);
      });
    });

    // emit "returnVideoLinks" to the frontend with VideoLinks
    socket.emit("responseVideoLinks", videoLinks);
    console.log("responseVideoLinks activated");
  });
});

app.get("/", (req, res) => res.send("Hello"));
app.get("/world", (req, res) => res.send("Hello World!"));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));