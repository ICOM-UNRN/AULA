/* eslint-disable indent */
'use server';

import { z } from 'zod';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { signIn } from '@/auth';
import { sql } from '@vercel/postgres';

export type State = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

// Esquemas de validación
const AsignacionSchema = z.object({
  id_aula: z.string(),
  id_materia: z.string(),
  dia: z.string(),
  horario_comienzo: z.string(),
  horario_fin: z.string(),
});

const AulaSchema = z.object({
  id_aula: z.string(),
  id_edificio: z.string(),
});

const EdificioSchema = z.object({
  id: z.string(),
  direccion: z.string(),
  altura: z.string(),
});

const EventoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  id_aula: z.string(),
});

const MateriaSchema = z.object({
  id: z.string(),
  codigo_guarani: z.string(),
  carrera: z.string(),
  nombre: z.string(),
  anio: z.string(),
  cuatrimestre: z.string(),
  taxonomia: z.string(),
  horas_semanales: z.string(),
  comisiones: z.string(),
});

const ProfesorSchema = z.object({
  id: z.string(),
  documento: z.string(),
  nombre: z.string(),
  apellido: z.string(),
  condicion: z.string(),
  categoria: z.string(),
  dedicacion: z.string(),
  periodo_a_cargo: z.string(),
});

const ProfesorPorMateriaSchema = z.object({
  id_profesor: z.string(),
  id_materia: z.string(),
});

const RecursoSchema = z.object({
  id: z.string(),
  tipo: z.string(),
  descripcion: z.string(),
});

const RecursoPorAulaSchema = z.object({
  id_recurso: z.string(),
  id_aula: z.string(),
});

async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales invalidas';
        default:
          return 'Algo salió mal :(';
      }
    }
    throw error;
  }
}

async function createRecord(schema: z.ZodObject<any>, tableName: string, formData: FormData): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const validatedFields = schema.omit({ id: true }).safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      reject({
        errors: validatedFields.error.flatten().fieldErrors,
        message: `Faltan datos. Error al crear ${tableName}.`,
      });
      return;
    }

    const fields = validatedFields.data;
    const columns = Object.keys(fields).join(', ');
    const values = Object.values(fields);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

    try {
      await sql.query(query, values);
      revalidatePath(`/dashboard/${tableName}`);
      resolve(`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} creado con éxito`);
    } catch (error) {
      revalidatePath(`/dashboard/${tableName}`);
      reject({ message: `Database Error: Failed to Create ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}.` });
    }
  });
}

async function updateRecord(schema: z.ZodObject<any>, tableName: string, id: string, formData: FormData) {
  return new Promise(async (resolve, reject) => {
    const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      reject({
        errors: validatedFields.error.flatten().fieldErrors,
        message: `Faltan datos. Error al actualizar ${tableName}.`,
      });
      return;
    }

    const fields = validatedFields.data;
    const setValues = Object.entries(fields)
      .map(([key, value], index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(fields);
    const query = `UPDATE ${tableName} SET ${setValues} WHERE id = $${values.length + 1}`;

    try {
      await sql.query(query, [...values, id]);
      resolve(`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} actualizado con éxito`);
    } catch (error) {
      reject({ message: `Database Error: Failed to Update ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}.` });
    }

    revalidatePath(`/dashboard/${tableName}/${id}`);
  });
}

async function deleteRecord(tableName: string, id: string) {
  try {
    await sql.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
    revalidatePath(`/dashboard/${tableName}`);
    return { message: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} eliminado.` };
  } catch (error) {
    return { message: `Database Error: Failed to Delete ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}.` };
  }
}

// Asignacion CRUD operations
export async function createAsignacion(formData: FormData): Promise<string> {
  return createRecord(AsignacionSchema, 'asignacion', formData);
}

export async function updateAsignacion(id: string, formData: FormData) {
  return updateRecord(AsignacionSchema, 'asignacion', id, formData);
}

export async function deleteAsignacion(id: string) {
  return deleteRecord('asignacion', id);
}

// Aula CRUD operations
export async function createAula(formData: FormData): Promise<string> {
  return createRecord(AulaSchema, 'aula', formData);
}

export async function updateAula(id: string, formData: FormData) {
  return updateRecord(AulaSchema, 'aula', id, formData);
}

export async function deleteAula(id: string) {
  return deleteRecord('aula', id);
}

// Edificio CRUD operations
export async function createEdificio(formData: FormData): Promise<string> {
  return createRecord(EdificioSchema, 'edificio', formData);
}

export async function updateEdificio(id: string, formData: FormData) {
  return updateRecord(EdificioSchema, 'edificio', id, formData);
}

export async function deleteEdificio(id: string) {
  return deleteRecord('edificio', id);
}

// Evento CRUD operations
export async function createEvento(formData: FormData): Promise<string> {
  return createRecord(EventoSchema, 'evento', formData);
}

export async function updateEvento(id: string, formData: FormData) {
  return updateRecord(EventoSchema, 'evento', id, formData);
}

export async function deleteEvento(id: string) {
  return deleteRecord('evento', id);
}

// Materia CRUD operations
export async function createMateria(formData: FormData): Promise<string> {
  return createRecord(MateriaSchema, 'materia', formData);
}

export async function updateMateria(id: string, formData: FormData) {
  return updateRecord(MateriaSchema, 'materia', id, formData);
}

export async function deleteMateria(id: string) {
  return deleteRecord('materia', id);
}

// Profesor CRUD operations
export async function createProfesor(formData: FormData): Promise<string> {
  return createRecord(ProfesorSchema, 'profesor', formData);
}

export async function updateProfesor(id: string, formData: FormData) {
  return updateRecord(ProfesorSchema, 'profesor', id, formData);
}

export async function deleteProfesor(id: string) {
  return deleteRecord('profesor', id);
}

// ProfesorPorMateria CRUD operations
export async function createProfesorPorMateria(formData: FormData): Promise<string> {
  return createRecord(ProfesorPorMateriaSchema, 'profesorpormateria', formData);
}

export async function updateProfesorPorMateria(id: string, formData: FormData) {
  return updateRecord(ProfesorPorMateriaSchema, 'profesorpormateria', id, formData);
}

export async function deleteProfesorPorMateria(id: string) {
  return deleteRecord('profesorpormateria', id);
}

// Recurso CRUD operations
export async function createRecurso(formData: FormData): Promise<string> {
  return createRecord(RecursoSchema, 'recurso', formData);
}

export async function updateRecurso(id: string, formData: FormData) {
  return updateRecord(RecursoSchema, 'recurso', id, formData);
}

export async function deleteRecurso(id: string) {
  return deleteRecord('recurso', id);
}

// RecursoPorAula CRUD operations
export async function createRecursoPorAula(formData: FormData): Promise<string> {
  return createRecord(RecursoPorAulaSchema, 'recursoporaula', formData);
}

export async function updateRecursoPorAula(id: string, formData: FormData) {
  return updateRecord(RecursoPorAulaSchema, 'recursoporaula', id, formData);
}

export async function deleteRecursoPorAula(id: string) {
  return deleteRecord('recursoporaula', id);
}
