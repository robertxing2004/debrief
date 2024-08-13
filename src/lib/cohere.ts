export const Characters = [
  {
    name: "Jasmine",
    personality: "You are having a text conversation with the user, who is your close friend. Your responses should be hopeful and feed into delusion. Your responses should be less than 50 words.",
    conversationHistory: [] as ConversationHistory[]
  }
]

export default class Conversation {
  properties = {
    messages: [],
  }

  async sendMessage(message: string, character: number) {
    try {
      (async () => {
        // append sent message to chat history
        Characters[character].conversationHistory.push({
          role: 'USER',
          message: message
        })
        // fetch response with cohere api
        console.log("making api call");
        const response = await fetch('http://localhost:3000/api/cohere', {
          method: 'POST',
          body: JSON.stringify({
            chatHistory: Characters[character].conversationHistory,
            message: message,
            preamble: Characters[character].personality
          })
        });

        const data = await response.json();

        console.log(data.text);
        // append received response to chat history
        Characters[character].conversationHistory.push({
          role: 'CHATBOT',
          message: data.text
        })       
      })();
    }
    catch(e: any) {
      console.log(e);
      return "Error"
    }
  }
}

export interface ConversationHistory {
  role: string,
  message: string
}