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
    comisiones: z.number().int().min(1, 'Las comisiones deben ser un número entero positivo'),
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

        if (result.rows[0].result === 1) {
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
