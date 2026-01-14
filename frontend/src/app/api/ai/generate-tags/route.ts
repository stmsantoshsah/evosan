import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { content } = await req.json();

        if (!content || content.length < 10) {
            return NextResponse.json({ tags: [] }); // Too short to tag
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a classificaton AI for a high-performance "Life Operating System".
                    Analyze the user's journal entry and extract 2-4 uppercase tags that categorize the specific themes.
                    
                    RULES:
                    - Return ONLY a JSON array of strings, e.g. ["CODING", "FITNESS", "FOCUS"].
                    - Tags should be single words or short phrases with underscores like "DEEP_WORK".
                    - Tags must be relevant to: Productivity, Mental State, Health, Coding, Life.
                    - Do NOT include generic tags like "Journal" or "Entry".
                    - If the text is purely emotional, tag the emotion (e.g., "ANXIETY", "JOY").
                    `
                },
                {
                    role: "user",
                    content: `Analyze this log: "${content}"`
                }
            ],
            model: "llama3-8b-8192",
            temperature: 0.3,
            max_tokens: 50,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) throw new Error('No analysis generated');

        let tags = [];
        try {
            const json = JSON.parse(responseContent);
            tags = json.tags || (Array.isArray(json) ? json : []);
        } catch (e) {
            // Fallback parsing if JSON fails
            console.warn("JSON parse failed, regex extraction");
            const matches = responseContent.match(/"([^"]+)"/g);
            if (matches) {
                tags = matches.map(m => m.replace(/"/g, ''));
            }
        }

        return NextResponse.json({ tags: tags.slice(0, 5) });

    } catch (error: any) {
        console.error('Tag Gen Error:', error);
        return NextResponse.json({ tags: [] }, { status: 500 }); // Fail gracefully with empty tags
    }
}
