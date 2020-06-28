"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandsEngine = void 0;
var HandsEngine = /** @class */ (function () {
    function HandsEngine() {
        this.users = new Array();
        this.handQueue = new Array();
    }
    HandsEngine.prototype.buildState = function () {
        var handQueue = this.handQueue;
        var activeUser = handQueue.length == 0 ? undefined : handQueue[0];
        if (activeUser != undefined) {
            handQueue = handQueue.filter(function (usr) { return usr.id !== (activeUser === null || activeUser === void 0 ? void 0 : activeUser.id); });
        }
        var data = {
            active: activeUser,
            queue: handQueue
        };
        if (this.hook) {
            this.hook(data);
        }
        return data;
    };
    HandsEngine.prototype.registerUser = function (usr) {
        this.users.push(usr);
        return this.buildState();
    };
    HandsEngine.prototype.deRegisterUser = function (usr) {
        this.users = this.users.filter(function (item) { return item.id !== usr.id; });
        this.handQueue = this.handQueue.filter(function (item) { return item.id !== usr.id; });
        this.buildState();
        return true;
    };
    HandsEngine.prototype.toggleHands = function (usr) {
        if (this.handQueue.find(function (cur) { return cur.id == usr.id; })) {
            this.handQueue = this.handQueue.filter(function (item) { return item.id !== usr.id; });
        }
        else {
            this.handQueue.push(usr);
        }
        this.buildState();
    };
    HandsEngine.prototype.cutInUser = function (usr) {
        throw new Error("Method not implemented.");
    };
    HandsEngine.prototype.registerStateChangeHook = function (hook) {
        this.hook = hook;
    };
    return HandsEngine;
}());
exports.HandsEngine = HandsEngine;
