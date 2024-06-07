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
      const materia = await sql`
        SELECT * FROM materia WHERE id=${id}
      `;
      return NextResponse.json(materia.rows[0], { status: 200 });
    } else if (!query && currentPage) {
      const materias = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            codigo_guarani,
            carrera,
            nombre,
            anio,
            cuatrimestre,
            taxonomia,
            horas_semanales,
            comisiones
          FROM materia
        ) AS subquery
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(materias.rows, { status: 200 });
    } else if (query && currentPage) {
      const materias = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            codigo_guarani,
            carrera,
            nombre,
            anio,
            cuatrimestre,
            taxonomia,
            horas_semanales,
            comisiones
          FROM materia
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          codigo_guarani ILIKE ${`%${query}%`} OR
          carrera ILIKE ${`%${query}%`}
        ORDER BY id DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(materias.rows, { status: 200 });
    } else if (query && !currentPage) {
      const materias = await sql`
        SELECT *
        FROM (
          SELECT
            id,
            codigo_guarani,
            carrera,
            nombre,
            anio,
            cuatrimestre,
            taxonomia,
            horas_semanales,
            comisiones
          FROM materia
        ) AS subquery
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          codigo_guarani ILIKE ${`%${query}%`} OR
          carrera ILIKE ${`%${query}%`}
        ORDER BY id DESC
      `;
      return NextResponse.json(materias.rows, { status: 200 });
    } else {
      const materias = await sql`
        SELECT
          id,
          codigo_guarani,
          carrera,
          nombre,
          anio,
          cuatrimestre,
          taxonomia,
          horas_semanales,
          comisiones
        FROM materia
        ORDER BY id DESC
      `;
      return NextResponse.json(materias.rows, { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
    }
  }
}
