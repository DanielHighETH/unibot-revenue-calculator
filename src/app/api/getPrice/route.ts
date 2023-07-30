import { NextResponse } from 'next/server'
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'prices.json');
    let data = {};

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        data = JSON.parse(fileContents);
        console.log(data)
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
    }

    return NextResponse.json({ data })
}
