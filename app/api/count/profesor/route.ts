import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: Request) {
  noStore();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  try {
    if (!query) {
      const data = await sql`SELECT COUNT(*) FROM profesor`;
      return NextResponse.json(Number(data.rows[0].count), { status: 200 });
    } else {
      const data = await sql`SELECT COUNT(*) FROM profesor 
            WHERE nombre ILIKE ${`%${query}%`} OR
                  apellido ILIKE ${`%${query}%`} OR
                  condicion ILIKE ${`%${query}%`} OR
                  categoria ILIKE ${`%${query}%`} OR
                  dedicacion ILIKE ${`%${query}%`} OR
                  periodo_a_cargo ILIKE ${`%${query}%`}`;
      return NextResponse.json(Number(data.rows[0].count), { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
