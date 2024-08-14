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
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    if(input === "") {
      return
    }

    var newMessage = {
      role: 'USER',
      content: input,
      direction: 'outgoing'
    };

    var newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput("");

    // set typing state true for chatbot response
    setIsTyping(true);

    // send to cohere api
    try {
      const response = await chatHandler.sendMessage(newMessage.content, character.id);
      console.log(response);
      newMessage = {
        role: 'CHATBOT',
        content: response,
        direction: 'incoming'
      }
    }
    catch(e) {
      console.log(e);
    }

    

    newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(false);
  }

  return (
    <div>
      <h1>Chat Window</h1>
      <div>
        {
          messages.map((message: any, i: number) => {
            return (
              <div key={i} className={`text-${message.role === 'USER' ? 'right' : 'left'}`}>
                <p>{message.content}</p>
              </div>
            )
          })
        }
      </div>
      
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="debrief" value={input} onChange={(e) => setInput(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

interface ChatMessage {
  content: string,
  role: string
}

interface Character {
  name: string,
  id: number,
  path: string
}