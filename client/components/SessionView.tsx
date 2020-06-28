import socketIOClient from "socket.io-client";
import { useEffect, useState, ReactElement } from "react";
import dynamic from "next/dynamic";
import styles from "./SessionView.module.css";

interface SessionViewProps {
    name: string
}

interface User {
    id: string,
    name: string
}

interface State {
    active?: User,
    queue: User[]
}

const SessionView = (props: SessionViewProps) => {

    var [sessionState, setSessionState] = useState<State>();
    var [socket, setSocket] = useState<SocketIOClient.Socket>();

    useEffect(() => {
        var socket = socketIOClient("http://localhost:3005");
        socket.emit("registerUser", {
            "name": props.name
        })
        socket.on("state", (state: State) => {
            setSessionState(state);
        })
        setSocket(socket);
    }, []);

    const toggleHands = () => {
        if (!socket) return;
        socket.emit("toggleHands", true)
    }

    const StatusBlock = () => {
        var emoji:string;
        var statusLine:ReactElement;
        var activeStyle:any;
        if (sessionState?.active) {
            if (sessionState?.active?.name == props.name) {
                emoji = "👌";
                statusLine = (<p>You're Talking</p>);
                activeStyle = styles.activeColor;
            } else {
                emoji = "✋";
                statusLine = (<p>Hold on <u>{sessionState?.active?.name}</u> Is Talking</p>);
                activeStyle = styles.inactiveColor;
            }
        } else {
            emoji =  "👐";
            statusLine = (<p>No One Is Talking?!</p>)
        }

        var nextOnQueue:string;
        if (sessionState?.queue[0].name == props.name){
            nextOnQueue = "You are";
        } else {
            nextOnQueue = sessionState?.queue[0].name;
        }

        return (
            <div className={[styles.emojiHolder, activeStyle].join(' ')}>
                <h1 className={styles.emoji}>{emoji}</h1>
                <h3>{statusLine}</h3>
                <h4><u>{nextOnQueue}</u> is next on queue</h4>
            </div>
        )
    }

    return (
        <>
            <div onClick={()=>toggleHands()}>
                <StatusBlock/>
                {/* <div className={styles.cutInButton}>✂️</div> */}
            </div>
        </>
    )
}

export default dynamic(() => Promise.resolve(SessionView), {
    ssr: false
})
