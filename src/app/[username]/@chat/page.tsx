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
    path: '/images/grad0.png'
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

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
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
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
    catch(e) {
      console.log(e);
    }

    setIsTyping(false);
  }

  return (
    <div className="w-9/12 p-2 h-screen relative float-right">
      <h1>Chat Window</h1>
      <div className="overflow-y-auto overscroll-y-contain rounded-2xl p-2 bg-slate-50 dark:bg-black dark:border-2 h-[calc(100%-2rem)] dark:border-gray-700">
        {
          messages.map((message: any, i: number) => {
            return (
              <div key={i} className="relative w-full">
                <span className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'USER' ? null : <img className="rounded-full w-8 h-8 mr-2 mt-6" src={character.path}/>}
                  <div>
                    <p className={`text-xs m-1 ${message.role === 'USER' ? 'text-right' : null}`}>{message.role === 'USER' ? 'You': character.name}</p>
                    <p className={`rounded-2xl py-1 px-3 mb-2 max-w-96 h-auto ${message.role === 'USER' ? 'bg-blue-400 text-white right-0' : 'bg-slate-200 dark:bg-gray-800 left-0'}`}>{message.content}</p>
                  </div>
                </span>
              </div>
            )
          })
        }
      </div>
      <form onSubmit={handleSubmit} className="block w-[calc(100%-1rem)] my-3 box-border absolute bottom-0 rounded-2xl p-2 bg-slate-200 dark:bg-black dark:border-2 dark:border-gray-700">
        <input className="select-none focus:outline-none active:outline-none p-1 w-10/12 bg-inherit duration-200" type="text" placeholder="debrief" value={input} onChange={(e) => setInput(e.target.value)}/>
        <button className="w-1/12 float-right text-center p-1 bg-blue-400 hover:bg-blue-500 duration-200 text-white rounded-lg" type="submit">Send</button>
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