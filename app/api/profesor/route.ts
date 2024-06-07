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
      const profesor = await sql`SELECT * FROM profesor WHERE id=${id}`;
      return NextResponse.json(profesor.rows[0], { status: 200 });
    } else if (!query && currentPage) {
      const profesores = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            documento,
            nombre,
            apellido,
            condicion,
            categoria,
            dedicacion,
            periodo_a_cargo
          FROM profesor
        ) AS subquery
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(profesores.rows, { status: 200 });
    } else if (query && currentPage) {
      const profesores = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            documento,
            nombre,
            apellido,
            condicion,
            categoria,
            dedicacion,
            periodo_a_cargo
          FROM profesor
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          apellido ILIKE ${`%${query}%`} OR
          condicion ILIKE ${`%${query}%`} OR
          categoria ILIKE ${`%${query}%`} OR
          dedicacion ILIKE ${`%${query}%`} OR
          periodo_a_cargo ILIKE ${`%${query}%`}
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(profesores.rows, { status: 200 });
    } else if (query && !currentPage) {
      const profesores = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            documento,
            nombre,
            apellido,
            condicion,
            categoria,
            dedicacion,
            periodo_a_cargo
          FROM profesor
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          apellido ILIKE ${`%${query}%`} OR
          condicion ILIKE ${`%${query}%`} OR
          categoria ILIKE ${`%${query}%`} OR
          dedicacion ILIKE ${`%${query}%`} OR
          periodo_a_cargo ILIKE ${`%${query}%`}
        ORDER BY id DESC
      `;
      return NextResponse.json(profesores.rows, { status: 200 });
    } else {
      const profesores = await sql`
        SELECT
          id,
          documento,
          nombre,
          apellido,
          condicion,
          categoria,
          dedicacion,
          periodo_a_cargo
        FROM profesor
        ORDER BY id DESC
      `;
      return NextResponse.json(profesores.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
