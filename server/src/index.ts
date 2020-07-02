import { HandsEngine, User } from "./HandsEngine";
import express from "express";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const handsEngine = new HandsEngine();

const app = express();
let http = require("http").Server(app);
let port = process.env.PORT || 3005

const server = http.listen(port, function() {
  console.log("listening on *:" + port);
});
app.use(express.static(path.join(__dirname, '../../client/out')));

interface UserRegistration {
  name: string
}

let io = require("socket.io")(http);

io.on("connect", (socket: any) => {

  socket.on("registerUser", (usr: UserRegistration) => {
    console.log("Registering User %s", usr.name);
    const user: User = {
      id: uuidv4(),
      name: usr.name,
      wantsToTalk: false,
      queuedAt: null
    };
    handsEngine.registerUser(user);
    socket.user = user;
  });

  socket.on("toggleHands", () => {
    const usr: User = socket.user;
    if(!usr){
      return;
    }
    handsEngine.toggleHands(usr);
  })

  socket.on('disconnect', () => {
    const usr: User = socket.user;
    if(!usr){
      return;
    }
    console.log("Un-Registering User %s", usr.name);
    handsEngine.deRegisterUser(usr)
  })

  handsEngine.registerStateChangeHook((state) => {
    io.emit("state", state);
  })

  socket.on("msg", (msg: string) => {
    console.log("Got message by %s - %s", socket.userName, msg);
    io.emit("msg", socket.userName + " - " + msg);
  });

});
