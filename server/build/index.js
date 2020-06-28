"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HandsEngine_1 = require("./HandsEngine");
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var uuid_1 = require("uuid");
var handsEngine = new HandsEngine_1.HandsEngine();
var app = express_1.default();
var http = require("http").Server(app);
var server = http.listen(3005, function () {
    console.log("listening on *:3005");
});
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/out')));
var io = require("socket.io")(http);
io.on("connect", function (socket) {
    socket.on("registerUser", function (usr) {
        console.log("Registering User %s", usr.name);
        var user = {
            id: uuid_1.v4(),
            name: usr.name
        };
        handsEngine.registerUser(user);
        socket.user = user;
    });
    socket.on("toggleHands", function () {
        var usr = socket.user;
        handsEngine.toggleHands(usr);
    });
    socket.on('disconnect', function () {
        var usr = socket.user;
        console.log("Un-Registering User %s", usr.name);
        handsEngine.deRegisterUser(usr);
    });
    handsEngine.registerStateChangeHook(function (state) {
        io.emit("state", state);
    });
    socket.on("msg", function (msg) {
        console.log("Got message by %s - %s", socket.userName, msg);
        io.emit("msg", socket.userName + " - " + msg);
    });
});
