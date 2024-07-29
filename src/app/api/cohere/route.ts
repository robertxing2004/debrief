const { CohereClient } = require('cohere-ai');

export async function GET(request: Request, { params }: { params: { message: string, character: any }}) {
  try {
    console.log("test received");
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });

    (async () => {
      // append sent message to chat history
      params.character.conversationHistory.push({
        role: 'USER',
        message: params.message
      })
      // fetch response with cohere api
      const response = await cohere.chat({
        chatHistory: params.character.conversationHistory,
        message: params.message,
        preamble: params.character.personality
      });

      console.log(response);
      // append received response to chat history
      params.character.conversationHistory.push({
        role: 'CHATBOT',
        message: response
      })
    })();
  }
  catch(error: any) {
    console.log(error);
  }
}