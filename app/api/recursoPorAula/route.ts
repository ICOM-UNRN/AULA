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
      const recursoPorAula = await sql`
        SELECT * FROM recurso_por_aula WHERE id_aula=${id} OR id_recurso=${id}
      `;
      return NextResponse.json(recursoPorAula.rows, { status: 200 });
    } else if (!query && currentPage) {
      const recursosPorAula = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_recurso,
            cantidad
          FROM recurso_por_aula
        ) AS subquery
        ORDER BY id_aula DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(recursosPorAula.rows, { status: 200 });
    } else if (query && currentPage) {
      const recursosPorAula = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_recurso,
            cantidad
          FROM recurso_por_aula
        ) AS subquery
        WHERE
          id_aula::text ILIKE ${`%${query}%`} OR
          id_recurso::text ILIKE ${`%${query}%`}
        ORDER BY id_aula DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(recursosPorAula.rows, { status: 200 });
    } else if (query && !currentPage) {
      const recursosPorAula = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_recurso,
            cantidad
          FROM recurso_por_aula
        ) AS subquery
        WHERE
          id_aula::text ILIKE ${`%${query}%`} OR
          id_recurso::text ILIKE ${`%${query}%`}
        ORDER BY id_aula DESC
      `;
      return NextResponse.json(recursosPorAula.rows, { status: 200 });
    } else {
      const recursosPorAula = await sql`
        SELECT
          id_aula,
          id_recurso,
          cantidad
        FROM recurso_por_aula
        ORDER BY id_aula DESC
      `;
      return NextResponse.json(recursosPorAula.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
