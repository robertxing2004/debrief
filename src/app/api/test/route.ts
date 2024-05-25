import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT NOW()');
    return NextResponse.json({ time: result.rows[0].now });
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}