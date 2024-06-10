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
      const profesorPorMateria = await sql`
        SELECT * FROM profesor_por_materia WHERE (id_materia=${id} OR id_profesor=${id}) AND activo = TRUE
      `;
      return NextResponse.json(profesorPorMateria.rows, { status: 200 });
    } else if (!query && currentPage) {
      const profesoresPorMateria = await sql`
        SELECT *
        FROM (
          SELECT
            id_materia,
            id_profesor,
            alumnos_esperados,
            tipo_clase
          FROM profesor_por_materia
          WHERE activo = TRUE
        ) AS subquery
        ORDER BY id_materia DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(profesoresPorMateria.rows, { status: 200 });
    } else if (query && currentPage) {
      const profesoresPorMateria = await sql`
        SELECT *
        FROM (
          SELECT
            id_materia,
            id_profesor,
            alumnos_esperados,
            tipo_clase
          FROM profesor_por_materia
          WHERE activo = TRUE
        ) AS subquery
        WHERE
          id_materia::text ILIKE ${`%${query}%`} OR
          id_profesor::text ILIKE ${`%${query}%`} OR
          alumnos_esperados::text ILIKE ${`%${query}%`} OR
          tipo_clase ILIKE ${`%${query}%`}
        ORDER BY id_materia DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(profesoresPorMateria.rows, { status: 200 });
    } else if (query && !currentPage) {
      const profesoresPorMateria = await sql`
        SELECT *
        FROM (
          SELECT
            id_materia,
            id_profesor,
            alumnos_esperados,
            tipo_clase
          FROM profesor_por_materia
          WHERE activo = TRUE
        ) AS subquery
        WHERE
          id_materia::text ILIKE ${`%${query}%`} OR
          id_profesor::text ILIKE ${`%${query}%`} OR
          alumnos_esperados::text ILIKE ${`%${query}%`} OR
          tipo_clase ILIKE ${`%${query}%`}
        ORDER BY id_materia DESC
      `;
      return NextResponse.json(profesoresPorMateria.rows, { status: 200 });
    } else {
      const profesoresPorMateria = await sql`
        SELECT
          id_materia,
          id_profesor,
          alumnos_esperados,
          tipo_clase
        FROM profesor_por_materia
        WHERE activo = TRUE
        ORDER BY id_materia DESC
      `;
      return NextResponse.json(profesoresPorMateria.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
