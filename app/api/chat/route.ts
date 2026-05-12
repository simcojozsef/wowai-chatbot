import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an elite World of Warcraft strategist and addon developer.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...body.messages,
        ],
      });

    return NextResponse.json({
      message:
        completion.choices[0].message.content || "",
    });
  } catch (error) {
    console.error("OPENAI ERROR:", error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}