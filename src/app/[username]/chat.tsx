'use client';

import { useState } from 'react';
import Conversation from '@/lib/cohere';

const chatHandler = new Conversation();

export default function Chat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [character, setCharacter] = useState({
    name: 'jasmine',
    id: 0,
    path: '@/images/grad0.png'
  });
  const [messages, setMessages] = useState([
    {} as ChatMessage
  ]);

  const handleSubmit = async() => {
    if(input === "") {
      return
    }

    const newMessage = {
      message: input,
      role: 'USER',
      direction: 'outgoing'
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput("");

    // set typing state true for chatbot response
    setIsTyping(true);

    // send to cohere api
    console.log("sent to api")
    try {
      const response = await chatHandler.sendMessage(newMessage.message, character.id);
      console.log(response);
    }
    catch(e) {
      console.log(e);
    }

    setIsTyping(false);
  }

  return (
    <>
      <h1>Chat Window</h1>
      {/*maybe migrate actual messages to server side to hopefully fix cohere issue??*/}
      {
        messages.map((message: any, i: number) => {
          <div key={i}>{message.content}</div>
        })
      }

      {/*i feel like this stuff needs to be server side but it's a form that needs useState*/}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="debrief" value={input} onChange={(e) => setInput(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </>
  );
}

interface ChatMessage {
  message: string,
  role: string
}

interface Character {
  name: string,
  id: number,
  path: string
}