import { NextRequest, NextResponse } from 'next/server';
import getCollection from '@/db';

export async function POST(req: NextRequest) {
    const { alias, url } = await req.json();

    const urlPattern = /^https:\/\/www\./;
    if (!urlPattern.test(url)) {
        return NextResponse.json(
            { error: 'Invalid URL. Ensure it starts with https://www.' },
            { status: 400 }
        );
    }

    if (!alias || !url) {
        return NextResponse.json({ error: 'Alias and URL are required.' }, { status: 400 });
    }

    try {
        const collection = await getCollection('alias-archive');
        const existing = await collection.findOne({ alias });
        if (existing) {
            return NextResponse.json({ error: 'Alias already taken' }, { status: 409 });
        }

        const newEntry = { alias, url };
        await collection.insertOne(newEntry);
        return NextResponse.json({ message: 'Alias created', alias }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
