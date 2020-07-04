
export interface User {
    id: string,
    name: string,
    wantsToTalk: boolean,
    queuedAt: Date | null
}

export interface State {
    users: User[]
}

export interface StateChangeHook {
    (state: State): void
}

export interface IHandsEngine {
    registerUser(usr: User): State
    deRegisterUser(usr: User): void
    toggleHands(usr: User): void
    userCount(usr: User): number
    registerStateChangeHook(hook: StateChangeHook): void
}

export class HandsEngine implements IHandsEngine {

    private users: User[] = new Array();

    private hook?: StateChangeHook;

    private buildState(): State {

        const users = this.users;
        const data = {
            users: users
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
        this.buildState();
        return true;
    }

    toggleHands(usr: User): void {
        const userIndex = this.users.findIndex((user) => user.id === usr.id);
        this.users[userIndex].wantsToTalk = !this.users[userIndex].wantsToTalk;
        this.users[userIndex].queuedAt = this.users[userIndex].wantsToTalk ? new Date() : null;
        this.buildState();
    }
    
    userCount(): number {
        return this.users.length;
    }

    registerStateChangeHook(hook: StateChangeHook): void {
        this.hook = hook;
    }

}