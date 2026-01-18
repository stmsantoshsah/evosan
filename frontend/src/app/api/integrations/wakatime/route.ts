import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'API Key required' }, { status: 400 });
        }

        // Fetch WakaTime Stats (Today)
        // Encode API Key in Base64 for Basic Auth if needed, or just pass as param depending on endpoint
        // WakaTime API expects Base64 encoded key in Authorization header usually: Basic base64(key)

        const encodedKey = Buffer.from(apiKey).toString('base64');

        const res = await fetch('https://wakatime.com/api/v1/users/current/summaries?range=Today', {
            headers: {
                Authorization: `Basic ${encodedKey}`
            }
        });

        if (!res.ok) {
            throw new Error('WakaTime Fetch Failed: ' + res.statusText);
        }

        const data = await res.json();
        const summary = data.data[0]; // Today's summary

        const totalSeconds = summary.grand_total.total_seconds;
        const totalText = summary.grand_total.text;

        return NextResponse.json({
            success: true,
            data: {
                total_seconds: totalSeconds,
                text: totalText,
                languages: summary.languages.slice(0, 3) // Top 3 languages
            }
        });

    } catch (error: any) {
        console.error('WakaTime Sync Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
