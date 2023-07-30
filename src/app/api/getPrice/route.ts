import { NextResponse } from 'next/server'
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    const filePath = path.join(process.cwd(), 'prices.json');
    let data = {};

    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        data = JSON.parse(fileContents);
    } catch (err: any) {
        console.error(`Error reading file from disk: ${err}`);
        
        if (err.code === 'ENOENT') {
            console.log('prices.json does not exist. Creating it now.');
            data = { message: 'This is a newly created file.' };

            await fs.writeFile(filePath, JSON.stringify(data), 'utf8');
        }
        else {
            throw err;
        }
    }

    return NextResponse.json({ data })
}
