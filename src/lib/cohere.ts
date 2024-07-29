const { CohereClient } = require('cohere-ai');

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
      console.log("test");
      const key = process.env.COHERE_API_KEY;
      const cohere = new CohereClient({
        token: key,
      });

      (async () => {
        // append sent message to chat history
        Characters[character].conversationHistory.push({
          role: 'USER',
          message: message
        })
        // fetch response with cohere api
        console.log("making api call");
        const response = await cohere.chat({
          chatHistory: Characters[character].conversationHistory,
          message: message,
          preamble: Characters[character].personality
        });

        if (response.statusCode !== 200) {
          console.log("cohere error");
          console.log(response.body.message);
        }
        else {
          console.log("received api response");
        console.log(response.text);
        // append received response to chat history
        Characters[character].conversationHistory.push({
          role: 'CHATBOT',
          message: response.text
        })
        }        
      })();
    }
    catch(e) {
      console.log(e);
      return "Error"
    }
  }
}

interface ConversationHistory {
  role: string,
  message: string
}