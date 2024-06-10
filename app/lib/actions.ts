/* eslint-disable indent */
'use server';

import { AuthError } from 'next-auth';
import { signIn } from '@/auth';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { sql } from '@vercel/postgres';

// Autenticación de usuario
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales invalidas';
                default:
                    return 'Algo salio mal :(';
            }
        }
        throw error;
    }
}

// Definición del estado de la aplicación
export type State = {
    errors?: {
      codigo_guarani?: string[];
      carrera?: string[];
      nombre?: string[];
      anio?: string[];
      cuatrimestre?: string[];
      taxonomia?: string[];
      horas_semanales?: string[];
      comisiones?: string[];
    };
    message?: string | null;
};

// Esquema de validación para la creación de una materia
const MateriaFormSchema = z.object({
    id: z.string(),
    codigo_guarani: z.string().min(1, 'El código Guarani es requerido'),
    carrera: z.string().min(1, 'La carrera es requerida'),
    nombre: z.string().min(1, 'El nombre es requerido'),
    anio: z.number().int().min(1, 'El año debe ser un número entero positivo'),
    cuatrimestre: z.number().int().min(1, 'El cuatrimestre debe ser un número entero positivo'),
    taxonomia: z.string().min(1, 'La taxonomía es requerida'),
    horas_semanales: z.number().int().min(1, 'Las horas semanales deben ser un número entero positivo'),
    comisiones: z.number().int().min(1, 'Las comisiones deben ser un número entero positivo')
});

// Crear una materia
const CreateMateria = MateriaFormSchema.omit({ id: true });

export async function createMateria(formData: FormData): Promise<string> {
    const validatedFields = CreateMateria.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return Promise.reject({
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Faltan datos. Error al crear materia.',
        });
    }

    const { codigo_guarani, carrera, nombre, anio, cuatrimestre, taxonomia, horas_semanales, comisiones } = validatedFields.data;

    try {
        const result = await sql`
            SELECT public.insert_materia(
                ${codigo_guarani}, 
                ${carrera}, 
                ${nombre}, 
                ${anio}, 
                ${cuatrimestre}, 
                ${taxonomia}, 
                ${horas_semanales}, 
                ${comisiones}
            ) as result;
        `;

        if (result.rows[0].result === 1) { // Aquí se accede a rows, no directamente a result
            return Promise.reject({ message: 'La materia ya existe.' });
        } else {
            revalidatePath('/dashboard/materias');
            return Promise.resolve('Materia creada con éxito');
        }
    } catch (error) {
        revalidatePath('/dashboard/materias');
        return Promise.reject({ message: 'Error en la base de datos: No se pudo crear la materia.' });
    }
}

// Actualizar una materia
export async function updateMateria(id: string, formData: FormData): Promise<string> {
    const validatedFields = MateriaFormSchema.safeParse({
        codigo_guarani: formData.get('codigo_guarani'),
        carrera: formData.get('carrera'),
        nombre: formData.get('nombre'),
        anio: formData.get('anio'),
        cuatrimestre: formData.get('cuatrimestre'),
        taxonomia: formData.get('taxonomia'),
        horas_semanales: formData.get('horas_semanales'),
        comisiones: formData.get('comisiones'),
    });

    if (!validatedFields.success) {
        return Promise.reject({
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Faltan datos. Error al actualizar materia.',
        });
    }

    const { codigo_guarani, carrera, nombre, anio, cuatrimestre, taxonomia, horas_semanales, comisiones } = validatedFields.data;

    try {
        await sql`
            UPDATE materia
            SET codigo_guarani = ${codigo_guarani}, carrera = ${carrera}, nombre = ${nombre}, 
            anio = ${anio}, cuatrimestre = ${cuatrimestre}, taxonomia = ${taxonomia}, 
            horas_semanales = ${horas_semanales}, comisiones = ${comisiones}
            WHERE id = ${id}
        `;
        revalidatePath(`/dashboard/materias/${id}`);
        return Promise.resolve('Materia actualizada con éxito');
    } catch (error) {
        return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar la materia.' });
    }
}

// Eliminar una materia
export async function deleteMateria(id: string): Promise<{ message: string }> {
    try {
        await sql`DELETE FROM materia WHERE id = ${id}`;
        revalidatePath('/dashboard/materias');
        return { message: 'Materia eliminada con éxito.' };
    } catch (error) {
        return { message: 'Error en la base de datos: No se pudo eliminar la materia.' };
    }
}



// Esquema de validación para la creación de un aula
const AulaFormSchema = z.object({
    id_aula: z.string().optional(),
    nombre: z.string().min(1, "El nombre es requerido"),
    id_edificio: z.number().int().positive("El ID del edificio debe ser un número entero positivo"),
});

// Crear una aula
const CreateAula = AulaFormSchema.omit({ id_aula: true });

export async function createAula(formData: FormData): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const validatedFields = CreateAula.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            reject({
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Faltan datos. Error al crear aula.',
            });
            return;
        }

        const { id_edificio, nombre } = validatedFields.data;

        try {
            const result = await sql`
                SELECT public.insert_aula(${id_edificio}, ${nombre}) as result;
            `;

            if (result.rows[0].result === 1) {
                reject({ message: 'El aula ya existe.' });
            } else if (result.rows[0].result === 2) {
                reject({ message: 'El edificio no existe.' });
            } else {
                revalidatePath('/dashboard/aulas');
                resolve('Aula creada con éxito');
            }
        } catch (error) {
            revalidatePath('/dashboard/aulas');
            reject({ message: 'Error en la base de datos: No se pudo crear el aula.' });
        }
    });
}

// Actualizar un aula
export async function updateAula(id_aula: string, formData: FormData): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const validatedFields = AulaFormSchema.safeParse(Object.fromEntries(formData.entries()));

        if (!validatedFields.success) {
            reject({
                errors: validatedFields.error.flatten().fieldErrors,
                message: 'Faltan datos. Error al actualizar aula.',
            });
            return;
        }

        const { id_edificio, nombre } = validatedFields.data;

        try {
            await sql`
                UPDATE aula
                SET id_edificio = ${id_edificio}, nombre = ${nombre}
                WHERE id_aula = ${id_aula}
            `;
            revalidatePath(`/dashboard/aulas/${id_aula}`);
            resolve('Aula actualizada con éxito');
        } catch (error) {
            revalidatePath(`/dashboard/aulas/${id_aula}`);
            reject({ message: 'Error en la base de datos: No se pudo actualizar el aula.' });
        }
    });
}

// Eliminar un aula
export async function deleteAula(id_aula: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            await sql`
                DELETE FROM aula WHERE id_aula = ${id_aula}
            `;
            revalidatePath('/dashboard/aulas');
            resolve('Aula eliminada con éxito');
        } catch (error) {
            revalidatePath('/dashboard/aulas');
            reject({ message: 'Error en la base de datos: No se pudo eliminar el aula.' });
        }
    });
}
