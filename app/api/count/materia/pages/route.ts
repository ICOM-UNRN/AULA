import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: Request) {
  noStore();
  const ITEMS_PER_PAGE = 6;
  const { searchParams } = new URL(request.url);
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const query = searchParams.get('query');
  const id = searchParams.get('id');
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  console.log('currentPage:', currentPage);
  console.log('offset:', offset);

  if (isNaN(currentPage) || currentPage <= 0) {
    return NextResponse.json({ error: "Invalid page number" }, { status: 400 });
  }

  if (offset < 0) {
    return NextResponse.json({ error: "OFFSET must not be negative" }, { status: 400 });
  }

  console.log('Connecting to the database...');
  try {
    await sql`SELECT 1`;
    console.log('Database connection successful');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return NextResponse.json({ error: "Error connecting to the database" }, { status: 500 });
  }

  try {
    if (id) {
      console.log(`Fetching materia with id: ${id}`);
      const materia = await sql`
        SELECT * FROM materia WHERE id = ${id}
      `;
      return NextResponse.json(materia.rows[0], { status: 200 });
    } else if (query) {
      console.log(`Fetching materias with query: ${query} for page: ${currentPage}`);
      const materias = await sql`
        SELECT *
        FROM materia
        WHERE nombre ILIKE ${`%${query}%`} OR
              codigo_guarani ILIKE ${`%${query}%`} OR
              carrera ILIKE ${`%${query}%`}
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(materias.rows, { status: 200 });
    } else {
      console.log('Fetching all materias');
      const materias = await sql`
        SELECT *
        FROM materia
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(materias.rows, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching materias:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
