/* eslint-disable indent */
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// Define schemas for each entity
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

// Helper function to create records
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
    const values = Object.values(fields).map(value => `'${value}'`).join(', ');

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${values})`;

    try {
      await sql.query(query);
      revalidatePath(`/dashboard/${tableName}`);
      resolve(`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} creado con éxito`);
    } catch (error) {
      revalidatePath(`/dashboard/${tableName}`);
      reject({ message: `Database Error: Failed to Create ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}.` });
    }
  });
}

// Helper function to update records
async function updateRecord(schema: z.ZodObject<any>, tableName: string, id: string, formData: FormData) {
  return new Promise(async (resolve, reject) => {
    const validatedFields = schema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: `Faltan datos. Error al actualizar ${tableName}.`,
      };
    }

    const fields = validatedFields.data;
    const setValues = Object.entries(fields)
      .map(([key, value]) => `${key} = '${value}'`)
      .join(', ');

    const query = `UPDATE ${tableName} SET ${setValues} WHERE id = '${id}'`;

    try {
      await sql.query(query);
      resolve(`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} actualizado con éxito`);
    } catch (error) {
      reject({ message: `Database Error: Failed to Update ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}.` });
    }

    revalidatePath(`/dashboard/${tableName}/${id}`);
  });
}

// Helper function to delete records
async function deleteRecord(tableName: string, id: string) {
  const query = `DELETE FROM ${tableName} WHERE id = '${id}'`;

  try {
    await sql.query(query);
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
