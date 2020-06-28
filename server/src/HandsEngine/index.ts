
export interface User {
    id: string,
    name: string
}

export interface State {
    active?: User,
    queue: User[]
}

export interface StateChangeHook {
    (state: State): void
}

export interface IHandsEngine {
    registerUser(usr: User): State
    deRegisterUser(usr: User): void
    toggleHands(usr: User): void
    cutInUser(usr: User): void
    registerStateChangeHook(hook: StateChangeHook): void
}

export class HandsEngine implements IHandsEngine {

    private users: User[] = new Array();
    private handQueue: User[] = new Array();

    private hook?: StateChangeHook;

    private buildState(): State {

        var handQueue = this.handQueue;
        var activeUser = handQueue.length == 0 ? undefined : handQueue[0];
        if (activeUser != undefined){
            handQueue = handQueue.filter((usr)=> usr.id !== activeUser?.id);
        }
        const data = {
            active: activeUser,
            queue: handQueue
        }
        if (this.hook){
            this.hook(data);
        }
        return data;
    }

    registerUser(usr: User): State {

        this.users.push(usr);
        return this.buildState();
    }

    deRegisterUser(usr: User): boolean {

        this.users = this.users.filter((item) => item.id !== usr.id);
        this.handQueue = this.handQueue.filter((item) => item.id !== usr.id);
        this.buildState();
        return true;
    }

    toggleHands(usr: User): void {
        if (this.handQueue.find((cur)=>cur.id == usr.id)){
            this.handQueue = this.handQueue.filter((item) => item.id !== usr.id);
        } else {
            this.handQueue.push(usr);
        }
        this.buildState();
    }
    
    cutInUser(usr: User): void {
        throw new Error("Method not implemented.");
    }

    registerStateChangeHook(hook: StateChangeHook): void {
        this.hook = hook;
    }

}