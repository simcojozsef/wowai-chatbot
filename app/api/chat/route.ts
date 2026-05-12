import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are an elite World of Warcraft strategist and addon developer.

You specialize in:
- Lua addon development
- WeakAuras
- WoW API
- Mythic+
- Raids
- PvP
- Rotations
- Macros
- Addons
- UI customization

IMPORTANT:
Whenever you generate code:
- ALWAYS wrap code in markdown code blocks
- ALWAYS specify the language
- Add comments to code
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
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
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}