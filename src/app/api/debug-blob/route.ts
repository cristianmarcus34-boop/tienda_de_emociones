import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        tokenLength: process.env.BLOB_READ_WRITE_TOKEN?.length ?? 0,
        tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 25) ?? 'undefined',
        hasStoreId: !!process.env.BLOB_STORE_ID,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasSecret: !!process.env.PAYLOAD_SECRET,
        nodeEnv: process.env.NODE_ENV,
    });
}