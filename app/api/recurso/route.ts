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
      const recurso = await sql`SELECT * FROM recurso WHERE id_recurso=${id}`;
      return NextResponse.json(recurso.rows[0], { status: 200 });
    } else if (!query && currentPage) {
      const recursos = await sql`
        SELECT *
        FROM (
          SELECT
            id_recurso,
            nombre,
            descripcion
          FROM recurso
        ) AS subquery
        ORDER BY id_recurso DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(recursos.rows, { status: 200 });
    } else if (query && currentPage) {
      const recursos = await sql`
        SELECT *
        FROM (
          SELECT
            id_recurso,
            nombre,
            descripcion
          FROM recurso
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          descripcion ILIKE ${`%${query}%`}
        ORDER BY id_recurso DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(recursos.rows, { status: 200 });
    } else if (query && !currentPage) {
      const recursos = await sql`
        SELECT *
        FROM (
          SELECT
            id_recurso,
            nombre,
            descripcion
          FROM recurso
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          descripcion ILIKE ${`%${query}%`}
        ORDER BY id_recurso DESC
      `;
      return NextResponse.json(recursos.rows, { status: 200 });
    } else {
      const recursos = await sql`
        SELECT
          id_recurso,
          nombre,
          descripcion
        FROM recurso
        ORDER BY id_recurso DESC
      `;
      return NextResponse.json(recursos.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
