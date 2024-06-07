import { sql } from '@vercel/postgres';
import { unstable_noStore as noStore } from 'next/cache';
import { Asignacion, Aula, Edificio, Evento, Materia, Profesor, ProfesorPorMateria, Recurso, RecursoPorAula } from './definitions';

const ITEMS_PER_PAGE = 6;

export async function getAsignaciones(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const asignaciones = await sql<Asignacion>`
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
    return asignaciones.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch asignaciones.');
  }
}

export async function getAulas(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const aulas = await sql<Aula>`
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
    return aulas.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch aulas.');
  }
}

export async function getEdificios(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const edificios = await sql<Edificio>`
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
    return edificios.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch edificios.');
  }
}

export async function getEventos(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const eventos = await sql<Evento>`
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
    return eventos.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch eventos.');
  }
}

export async function getMaterias(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const materias = await sql<Materia>`
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
    return materias.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch materias.');
  }
}

export async function getProfesores(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const profesores = await sql<Profesor>`
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
    return profesores.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profesores.');
  }
}

export async function getProfesorPorMateria(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const profesoresPorMateria = await sql<ProfesorPorMateria>`
      SELECT *
      FROM (
        SELECT
          id_materia,
          id_profesor,
          alumnos_esperados,
          tipo_clase
        FROM profesor_por_materia
      ) AS subquery
      WHERE
        id_materia::text ILIKE ${`%${query}%`} OR
        id_profesor::text ILIKE ${`%${query}%`} OR
        alumnos_esperados::text ILIKE ${`%${query}%`} OR
        tipo_clase ILIKE ${`%${query}%`}
      ORDER BY id_materia DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return profesoresPorMateria.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profesoresPorMateria.');
  }
}

export async function getRecursos(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const recursos = await sql<Recurso>`
      SELECT *
      FROM (
        SELECT
          id,
          descripcion,
          cantidad
        FROM recurso
      ) AS subquery
      WHERE
        descripcion ILIKE ${`%${query}%`}
      ORDER BY id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return recursos.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch recursos.');
  }
}

export async function getRecursoPorAula(query: string, currentPage: number) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const recursosPorAula = await sql<RecursoPorAula>`
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
    return recursosPorAula.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch recursosPorAula.');
  }
}