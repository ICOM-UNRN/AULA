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
      const evento = await sql`SELECT * FROM evento WHERE id=${id}`;
      return NextResponse.json(evento.rows[0], { status: 200 });
    } else if (!query && currentPage) {
      const eventos = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            nombre,
            descripcion,
            id_aula
          FROM evento
        ) AS subquery
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(eventos.rows, { status: 200 });
    } else if (query && currentPage) {
      const eventos = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            nombre,
            descripcion,
            id_aula
          FROM evento
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          descripcion ILIKE ${`%${query}%`} OR
          id_aula::text ILIKE ${`%${query}%`}
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(eventos.rows, { status: 200 });
    } else if (query && !currentPage) {
      const eventos = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            nombre,
            descripcion,
            id_aula
          FROM evento
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          descripcion ILIKE ${`%${query}%`} OR
          id_aula::text ILIKE ${`%${query}%`}
        ORDER BY id DESC
      `;
      return NextResponse.json(eventos.rows, { status: 200 });
    } else {
      const eventos = await sql`
        SELECT
          id,
          nombre,
          descripcion,
          id_aula
        FROM evento
        ORDER BY id DESC
      `;
      return NextResponse.json(eventos.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
