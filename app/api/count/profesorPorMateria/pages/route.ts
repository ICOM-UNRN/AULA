import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export async function GET(request: Request) {
  noStore();
  const ITEMS_PER_PAGE = 6;
  const { searchParams } = new URL(request.url);
  const currentPage = searchParams.get('page');
  const query = searchParams.get('query');
  const idMateria = searchParams.get('idMateria');
  const idProfesor = searchParams.get('idProfesor');
  const offset = (Number(currentPage) - 1) * ITEMS_PER_PAGE;

  try {
    if (idMateria && idProfesor) {
      const assignment = await sql`
        SELECT * 
        FROM profesor_por_materia 
        WHERE id_materia=${idMateria} AND id_profesor=${idProfesor}`;
      return NextResponse.json(assignment.rows[0], { status: 200 });
    } else if (!query && currentPage) {
      const assignments = await sql`
        SELECT * 
        FROM profesor_por_materia
        ORDER BY id_materia DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(assignments.rows, { status: 200 });
    } else if (query && currentPage) {
      const assignments = await sql`
        SELECT * 
        FROM profesor_por_materia
        WHERE
          tipo_clase ILIKE ${`%${query}%`}
        ORDER BY id_materia DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
      return NextResponse.json(assignments.rows, { status: 200 });
    } else if (query && !currentPage) {
      const assignments = await sql`
        SELECT * 
        FROM profesor_por_materia
        WHERE
          tipo_clase ILIKE ${`%${query}%`}
        ORDER BY id_materia DESC
      `;
      return NextResponse.json(assignments.rows, { status: 200 });
    } else {
      const assignments = await sql`
        SELECT * 
        FROM profesor_por_materia
        ORDER BY id_materia DESC
      `;
      return NextResponse.json(assignments.rows, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
