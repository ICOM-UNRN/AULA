import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: Request) {
  noStore();
  const ITEMS_PER_PAGE = 6;
  const { searchParams } = new URL(request.url);
  const currentPage = searchParams.get('page');
  const query = searchParams.get('query');
  const id = searchParams.get('id');
  const offset = (Number(currentPage) - 1) * ITEMS_PER_PAGE;

  try {
    if (id) {
      const edificio = await sql`SELECT * FROM edificio WHERE id=${id}`;
      return NextResponse.json(edificio.rows[0], { status: 200 });
    } else if (!query && currentPage) {
      const edificios = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            direccion,
            altura
          FROM edificio
        ) AS subquery
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(edificios.rows, { status: 200 });
    } else if (query && currentPage) {
      const edificios = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            direccion,
            altura
          FROM edificio
        ) AS subquery
        WHERE
          direccion ILIKE ${`%${query}%`}
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(edificios.rows, { status: 200 });
    } else if (query && !currentPage) {
      const edificios = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            direccion,
            altura
          FROM edificio
        ) AS subquery
        WHERE
          direccion ILIKE ${`%${query}%`}
        ORDER BY id DESC
      `;
      return NextResponse.json(edificios.rows, { status: 200 });
    } else {
      const edificios = await sql`
        SELECT
          id,
          direccion,
          altura
        FROM edificio
        ORDER BY id DESC
      `;
      return NextResponse.json(edificios.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
