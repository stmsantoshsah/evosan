import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { username, token } = await req.json();

        if (!username) {
            return NextResponse.json({ success: false, error: 'Username required' }, { status: 400 });
        }

        // Fetch User Info
        const userRes = await fetch(`https://api.github.com/users/${username}`, {
            headers: token ? { Authorization: `token ${token}` } : {}
        });

        if (!userRes.ok) {
            throw new Error('GitHub User not found');
        }

        const userData = await userRes.json();

        // Check recent activity (events)
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`, {
            headers: token ? { Authorization: `token ${token}` } : {}
        });
        const events = await eventsRes.json();

        // Count today's commits (PushEvent)
        const today = new Date().toISOString().split('T')[0];
        let commitCount = 0;

        // @ts-ignore
        events.forEach(event => {
            const eventDate = event.created_at.split('T')[0];
            if (eventDate === today && event.type === 'PushEvent') {
                commitCount += event.payload?.commits?.length || 0;
            }
        });

        // Update Database: "Coding Practice" Habit
        if (commitCount > 0) {
            const db = (await dbConnect()).connection.db;
            if (db) {
                // Find and update habit... assuming habit_id or name matches "Coding Practice"
                // For now, let's look for a habit named 'Coding Practice' or similar
                const habit = await db.collection('habits').findOne({ name: { $regex: /code|coding/i } });

                if (habit) {
                    await db.collection('habit_logs').updateOne(
                        { habit_id: habit._id, date: today },
                        {
                            $set: {
                                completed: true,
                                completedAt: new Date(),
                                source: 'github_auto_sync'
                            }
                        },
                        { upsert: true }
                    );
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                username: userData.login,
                avatar: userData.avatar_url,
                public_repos: userData.public_repos,
                commits_today: commitCount
            }
        });

    } catch (error: any) {
        console.error('GitHub Sync Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
