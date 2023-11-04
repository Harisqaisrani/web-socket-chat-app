import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, username, room}) {
    
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    
    const sendMessage = async () => {
        if(currentMessage !== "") {
            let messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":"  + new Date(Date.now()).getMinutes() + ", Date: " + new Date(Date.now()).getDate() + "/" + new Date(Date.now()).getMonth() + "/" + new Date(Date.now()).getFullYear(),
            };
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    }

    useEffect(() => {
        socket.on("recieve_message", (data) => {
        setMessageList((list) => [...list, data]);
        });
    }, [socket]);

  return ( <center>
    <div className='chat-window'>
        <div className="chat-header">
        <br/>
            <h3>Live Chat Sockets</h3>
            <br/>
        </div>
        
        <div className="chat-body">
            <ScrollToBottom className="message-container">
            {messageList.map((messageContent) => {
                return <div className="message" id={username === messageContent.author ? "you" : "other"}>
                    <div>
                    <div className="message-content">
                            <p>{messageContent.message}</p>
                        </div>
                    </div>
                    <div className="message-meta">
                    <p>This message is sent by {messageContent.author} at {messageContent.time}</p>
                    </div>
                </div>
            })}
            </ScrollToBottom>
        </div>
        <br/>
        <div className="chat-footer">
            <input type="text" value={currentMessage} placeholder="message ...." onChange={(event) => {setCurrentMessage(event.target.value)}} onKeyPress={(event) => {
                event.key === "Enter" && sendMessage();
            }} />
            <button onClick={sendMessage}>&#9658;</button>
            <br/>
        </div>
        <br/>
    </div></center>
  )
}

export default Chat;