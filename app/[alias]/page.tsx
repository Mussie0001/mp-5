import { redirect } from 'next/navigation';
import getCollection from '@/db';

interface PageProps {
    params: { alias: string };
}

export default async function AliasPage({ params }: PageProps) {
    const { alias } = params;
    const collection = await getCollection("alias-archive");
    const entry = await collection.findOne({ alias });

    if (entry) {
        redirect(entry.url);
    } else {
        return <h1>Alias not found</h1>;
    }
}
