const { CohereClient } = require('cohere-ai');
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { chatHistory, message, preamble } = await req.json();

    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });

    // fetch response with cohere api
    const response = await cohere.chat({
      chatHistory: chatHistory,
      message: message,
      preamble: preamble
    });

    console.log(response);
    return NextResponse.json(response);
  }
  catch(error: any) {
    console.log(error);
  }
  return NextResponse.json({ message : 'Request failed'});
}