const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
var cors = require("cors");
var spawn = require("child_process").spawn;
const fs = require("fs");
const path = require("path");

const io = new Server(server);
var last_img_name = "";
var img_name = "";

var save_path = "/media/pi/DISK/";

var today = new Date();

var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

if (!fs.existsSync(path.join(save_path, "photos"))) {
  fs.mkdirSync(path.join(save_path, "photos"));
}
if (!fs.existsSync(path.join(save_path, "photos", date))) {
  fs.mkdirSync(path.join(save_path, "photos", date));
}

app.use(express.static("public"));
app.use("/photos", express.static(path.join(save_path, "photos", date)));
app.use(cors());


var child = spawn("gphoto2", ["--wait-event-and-download"], {
  cwd: path.join(save_path, "photos", date),
});

child.stderr.on("data", function (data) {
  //throw errors
  console.log("stderr: " + data);
});

child.on("close", function (code) {
  console.log("child process exited with code " + code);
  process.exit(code);
});

child.stdout.on("data", function (data) {
  data = data.toString();
  if (data.includes("Overwrite? [y|n]")) child.stdin.write("y\n");
  if (data.includes("Saving file as")) {
    data = data.split("\n");
    img_name = data.filter((item) => item.includes("Saving file as"))[0];
    img_name = img_name.split(" ")[3];
    console.log("Image name: " + img_name);
  }
});

io.on("connection", (socket) => {
  console.log("client connected !");
  socket.emit("new_photo", img_name);
  setInterval(() => {
    if (last_img_name != img_name) {
      console.log("Sending image name: " + img_name);
      io.emit("new_photo", img_name);
      last_img_name = img_name;
    }
  }, 100);
});

server.listen(5600, () => {
  console.log("listening on *:5600");
});
