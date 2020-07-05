import { HandsEngine, User } from "./HandsEngine";
import express from "express";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const coreMap = new Map<string,HandsEngine>();

const app = express();
let http = require("http").Server(app);
let port = process.env.PORT || 3005

const server = http.listen(port, function() {
  console.log("listening on *:" + port);
});
app.use(express.static(path.join(__dirname, '../../client/out')));

interface ConnectionParams {
  userName: string,
  room: string,
}

let io = require("socket.io")(http);

io.on("connect", (socket: any) => {

  var params:ConnectionParams = socket.handshake.query as ConnectionParams;

  if (!coreMap.has(params.room)){
    console.log("Created New Room "+ params.room);
    coreMap.set(params.room, new HandsEngine());
  }
  var handsEngine:HandsEngine = coreMap.get(params.room) || new HandsEngine();
  socket.join(params.room);

  if (!socket.user) {
    console.log("Registering User %s", params.userName);
    const user: User = {
      id: uuidv4(),
      name: params.userName,
      wantsToTalk: false,
      queuedAt: null
    };
    handsEngine.registerUser(user);
    socket.user = user;
  }
  const usr: User = socket.user;

  socket.on("toggleHands", () => {
    handsEngine.toggleHands(usr);
  })

  socket.on('disconnect', () => {
    console.log("Un-Registering User %s", usr.name);
    handsEngine.deRegisterUser(usr)
    if (handsEngine.userCount() == 0){
      console.log("Tearing down room " + params.room);
      coreMap.delete(params.room);
    }
  })

  handsEngine.registerStateChangeHook((state) => {
    io.to(params.room).emit("state", state);
  })

});
