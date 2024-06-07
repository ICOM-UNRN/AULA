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
      const aula = await sql`SELECT * FROM aula WHERE id_aula=${id}`;
      return NextResponse.json(aula.rows[0], { status: 200 });
    } else if (!query && currentPage) {
      const aulas = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_edificio
          FROM aula
        ) AS subquery
        ORDER BY id_aula DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(aulas.rows, { status: 200 });
    } else if (query && currentPage) {
      const aulas = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_edificio
          FROM aula
        ) AS subquery
        WHERE
          id_edificio::text ILIKE ${`%${query}%`}
        ORDER BY id_aula DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(aulas.rows, { status: 200 });
    } else if (query && !currentPage) {
      const aulas = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_edificio
          FROM aula
        ) AS subquery
        WHERE
          id_edificio::text ILIKE ${`%${query}%`}
        ORDER BY id_aula DESC
      `;
      return NextResponse.json(aulas.rows, { status: 200 });
    } else {
      const aulas = await sql`
        SELECT
          id_aula,
          id_edificio
        FROM aula
        ORDER BY id_aula DESC
      `;
      return NextResponse.json(aulas.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
