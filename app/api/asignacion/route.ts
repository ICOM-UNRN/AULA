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
      const asignacion = await sql`
        SELECT * FROM asignacion WHERE id_aula=${id} OR id_materia=${id}
      `;
      return NextResponse.json(asignacion.rows, { status: 200 });
    } else if (!query && currentPage) {
      const asignaciones = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_materia,
            dia,
            horario_comienzo,
            horario_fin
          FROM asignacion
        ) AS subquery
        ORDER BY id_aula DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(asignaciones.rows, { status: 200 });
    } else if (query && currentPage) {
      const asignaciones = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_materia,
            dia,
            horario_comienzo,
            horario_fin
          FROM asignacion
        ) AS subquery
        WHERE
          id_aula::text ILIKE ${`%${query}%`} OR
          id_materia::text ILIKE ${`%${query}%`} OR
          dia ILIKE ${`%${query}%`} OR
          horario_comienzo::text ILIKE ${`%${query}%`} OR
          horario_fin::text ILIKE ${`%${query}%`}
        ORDER BY id_aula DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(asignaciones.rows, { status: 200 });
    } else if (query && !currentPage) {
      const asignaciones = await sql`
        SELECT *
        FROM (
          SELECT
            id_aula,
            id_materia,
            dia,
            horario_comienzo,
            horario_fin
          FROM asignacion
        ) AS subquery
        WHERE
          id_aula::text ILIKE ${`%${query}%`} OR
          id_materia::text ILIKE ${`%${query}%`} OR
          dia ILIKE ${`%${query}%`} OR
          horario_comienzo::text ILIKE ${`%${query}%`} OR
          horario_fin::text ILIKE ${`%${query}%`}
        ORDER BY id_aula DESC
      `;
      return NextResponse.json(asignaciones.rows, { status: 200 });
    } else {
      const asignaciones = await sql`
        SELECT
          id_aula,
          id_materia,
          dia,
          horario_comienzo,
          horario_fin
        FROM asignacion
        ORDER BY id_aula DESC
      `;
      return NextResponse.json(asignaciones.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
