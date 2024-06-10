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
        return 'Algo salió mal :(';
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

    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'La materia ya existe.' });
    } else {
      revalidatePath('/dashboard/materias');
      return 'Materia creada con éxito';
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
    return 'Materia actualizada con éxito';
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
  nombre: z.string().min(1, 'El nombre es requerido'),
  id_edificio: z.number().int().positive('El ID del edificio debe ser un número entero positivo'),
});

// Crear una aula
const CreateAula = AulaFormSchema.omit({ id_aula: true });

export async function createAula(formData: FormData): Promise<string> {
  const validatedFields = CreateAula.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al crear aula.',
    });
  }

  const { id_edificio, nombre } = validatedFields.data;

  try {
    const result = await sql`
      SELECT public.insert_aula(${id_edificio}, ${nombre}) as result;
    `;

    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'El aula ya existe.' });
    } else if (result.rows[0].result === 2) {
      return Promise.reject({ message: 'El edificio no existe.' });
    } else {
      revalidatePath('/dashboard/aulas');
      return 'Aula creada con éxito';
    }
  } catch (error) {
    revalidatePath('/dashboard/aulas');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo crear el aula.' });
  }
}

// Actualizar un aula
export async function updateAula(id_aula: string, formData: FormData): Promise<string> {
  const validatedFields = AulaFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar aula.',
    });
  }

  const { id_edificio, nombre } = validatedFields.data;

  try {
    await sql`
      UPDATE aula
      SET id_edificio = ${id_edificio}, nombre = ${nombre}
      WHERE id_aula = ${id_aula}
    `;
    revalidatePath(`/dashboard/aulas/${id_aula}`);
    return 'Aula actualizada con éxito';
  } catch (error) {
    revalidatePath(`/dashboard/aulas/${id_aula}`);
    return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar el aula.' });
  }
}

// Eliminar un aula
export async function deleteAula(id_aula: string): Promise<string> {
  try {
    await sql`
      DELETE FROM aula WHERE id_aula = ${id_aula}
    `;
    revalidatePath('/dashboard/aulas');
    return 'Aula eliminada con éxito';
  } catch (error) {
    revalidatePath('/dashboard/aulas');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo eliminar el aula.' });
  }
}

// Esquema de validación para la creación de un edificio
const EdificioFormSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  direccion: z.string().min(1, 'La dirección es requerida'),
  altura: z.number().int().positive('La altura debe ser un número entero positivo'),
});

// Crear un edificio
const CreateEdificio = EdificioFormSchema.omit({ id: true });

export async function createEdificio(formData: FormData): Promise<string> {
  const validatedFields = CreateEdificio.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al crear edificio.',
    });
  }

  const { nombre, direccion, altura } = validatedFields.data;

  try {
    const result = await sql`
      SELECT public.insert_edificio(${nombre}, ${direccion}, ${altura}) as result;
    `;

    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'El edificio ya existe.' });
    } else {
      revalidatePath('/dashboard/edificios');
      return 'Edificio creado con éxito';
    }
  } catch (error) {
    revalidatePath('/dashboard/edificios');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo crear el edificio.' });
  }
}

// Actualizar un edificio
export async function updateEdificio(id: string, formData: FormData): Promise<string> {
  const validatedFields = EdificioFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar edificio.',
    });
  }

  const { nombre, direccion, altura } = validatedFields.data;

  try {
    await sql`
      UPDATE edificio
      SET nombre = ${nombre}, direccion = ${direccion}, altura = ${altura}
      WHERE id = ${id}
    `;
    revalidatePath(`/dashboard/edificios/${id}`);
    return 'Edificio actualizado con éxito';
  } catch (error) {
    revalidatePath(`/dashboard/edificios/${id}`);
    return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar el edificio.' });
  }
}

// Eliminar un edificio
export async function deleteEdificio(id: string): Promise<string> {
  try {
    await sql`
      DELETE FROM edificio WHERE id = ${id}
    `;
    revalidatePath('/dashboard/edificios');
    return 'Edificio eliminado con éxito';
  } catch (error) {
    revalidatePath('/dashboard/edificios');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo eliminar el edificio.' });
  }
}

// Esquema de validación para la creación de un evento
const EventoFormSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  comienzo: z.string().min(1, 'La fecha de comienzo es requerida'),
  fin: z.string().min(1, 'La fecha de fin es requerida')
});
  
// Crear un evento
const CreateEvento = EventoFormSchema.omit({ id: true });
  
export async function createEvento(formData: FormData): Promise<string> {
  const validatedFields = CreateEvento.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al crear evento.',
    });
  }
  
  const { nombre, descripcion, comienzo, fin } = validatedFields.data;
  
  try {
    const result = await sql`
        SELECT public.insert_evento(${nombre}, ${descripcion}, ${comienzo}, ${fin}) as result;
      `;
  
    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'El evento ya existe.' });
    } else {
      revalidatePath('/dashboard/eventos');
      return 'Evento creado con éxito';
    }
  } catch (error) {
    revalidatePath('/dashboard/eventos');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo crear el evento.' });
  }
}
  
// Actualizar un evento
export async function updateEvento(id: string, formData: FormData): Promise<string> {
  const validatedFields = EventoFormSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar evento.',
    });
  }
  
  const { nombre, descripcion, comienzo, fin } = validatedFields.data;
  
  try {
    await sql`
        UPDATE evento
        SET nombre = ${nombre}, descripcion = ${descripcion}, comienzo = ${comienzo}, fin = ${fin}
        WHERE id = ${id}
      `;
    revalidatePath(`/dashboard/eventos/${id}`);
    return 'Evento actualizado con éxito';
  } catch (error) {
    revalidatePath(`/dashboard/eventos/${id}`);
    return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar el evento.' });
  }
}
  
// Eliminar un evento
export async function deleteEvento(id: string): Promise<string> {
  try {
    await sql`
        DELETE FROM evento WHERE id = ${id}
      `;
    revalidatePath('/dashboard/eventos');
    return 'Evento eliminado con éxito';
  } catch (error) {
    revalidatePath('/dashboard/eventos');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo eliminar el evento.' });
  }
}

// Esquema de validación para la creación de un profesor por materia
const ProfesorPorMateriaFormSchema = z.object({
  id_materia: z.number().int().positive('El ID de la materia debe ser un número entero positivo'),
  id_profesor: z.number().int().positive('El ID del profesor debe ser un número entero positivo'),
  alumnos_esperados: z.number().int().positive('La cantidad de alumnos esperados debe ser un número entero positivo'),
  tipo_clase: z.string().min(1, 'El tipo de clase es requerido')
});
  
// Crear un profesor por materia
const CreateProfesorPorMateria = ProfesorPorMateriaFormSchema;
  
export async function createProfesorPorMateria(formData: FormData): Promise<string> {
  const validatedFields = CreateProfesorPorMateria.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al asignar profesor a la materia.',
    });
  }
  
  const { id_materia, id_profesor, alumnos_esperados, tipo_clase } = validatedFields.data;
  
  try {
    const result = await sql`
        SELECT public.insert_profesor_por_materia(
          ${id_materia},
          ${id_profesor},
          ${alumnos_esperados},
          ${tipo_clase}
        ) as result;
      `;
  
    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'El profesor ya está asignado a esa materia con ese tipo de clase.' });
    } else if (result.rows[0].result === 2) {
      return Promise.reject({ message: 'No existe la materia o el profesor.' });
    } else {
      revalidatePath('/dashboard/profesores_por_materia');
      return 'Profesor asignado a la materia con éxito';
    }
  } catch (error) {
    revalidatePath('/dashboard/profesores_por_materia');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo asignar el profesor a la materia.' });
  }
}
  
// Actualizar un profesor por materia
export async function updateProfesorPorMateria(id_materia: number, id_profesor: number, formData: FormData): Promise<string> {
  const validatedFields = ProfesorPorMateriaFormSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar la asignación del profesor a la materia.',
    });
  }
  
  const { alumnos_esperados, tipo_clase } = validatedFields.data;
  
  try {
    await sql`
        UPDATE profesor_por_materia
        SET alumnos_esperados = ${alumnos_esperados}, tipo_clase = ${tipo_clase}
        WHERE id_materia = ${id_materia} AND id_profesor = ${id_profesor}
      `;
    revalidatePath(`/dashboard/profesores_por_materia/${id_materia}/${id_profesor}`);
    return 'Asignación de profesor a materia actualizada con éxito';
  } catch (error) {
    revalidatePath(`/dashboard/profesores_por_materia/${id_materia}/${id_profesor}`);
    return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar la asignación del profesor a la materia.' });
  }
}
  
// Eliminar un profesor por materia (Borrado lógico)
export async function deleteProfesorPorMateria(id_materia: number, id_profesor: number): Promise<string> {
  try {
    await sql`
      UPDATE profesor_por_materia
      SET activo = FALSE
      WHERE id_materia = ${id_materia} AND id_profesor = ${id_profesor}
    `;
    revalidatePath('/dashboard/profesores_por_materia');
    return 'Asignación de profesor a materia desactivada con éxito';
  } catch (error) {
    revalidatePath('/dashboard/profesores_por_materia');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo desactivar la asignación del profesor a la materia.' });
  }
}

// Esquema de validación para la creación de un profesor
const ProfesorFormSchema = z.object({
  id: z.string().optional(),
  documento: z.number().int().positive('El documento debe ser un número entero positivo'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  apellido: z.string().min(1, 'El apellido es requerido'),
  condicion: z.string().min(1, 'La condición es requerida'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  dedicacion: z.string().min(1, 'La dedicación es requerida'),
  periodo_a_cargo: z.string().min(1, 'El periodo a cargo es requerido')
});
  
// Crear un profesor
const CreateProfesor = ProfesorFormSchema.omit({ id: true });
  
export async function createProfesor(formData: FormData): Promise<string> {
  const validatedFields = CreateProfesor.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al crear profesor.',
    });
  }
  
  const { documento, nombre, apellido, condicion, categoria, dedicacion, periodo_a_cargo } = validatedFields.data;
  
  try {
    const result = await sql`
        SELECT public.insert_profesor(
          ${documento},
          ${nombre},
          ${apellido},
          ${condicion},
          ${categoria},
          ${dedicacion},
          ${periodo_a_cargo}
        ) as result;
      `;
  
    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'El profesor ya existe.' });
    } else {
      revalidatePath('/dashboard/profesores');
      return 'Profesor creado con éxito';
    }
  } catch (error) {
    revalidatePath('/dashboard/profesores');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo crear el profesor.' });
  }
}
  
// Actualizar un profesor
export async function updateProfesor(id: string, formData: FormData): Promise<string> {
  const validatedFields = ProfesorFormSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar profesor.',
    });
  }
  
  const { documento, nombre, apellido, condicion, categoria, dedicacion, periodo_a_cargo } = validatedFields.data;
  
  try {
    await sql`
        UPDATE profesor
        SET documento = ${documento}, nombre = ${nombre}, apellido = ${apellido},
        condicion = ${condicion}, categoria = ${categoria}, dedicacion = ${dedicacion},
        periodo_a_cargo = ${periodo_a_cargo}
        WHERE id = ${id}
      `;
    revalidatePath(`/dashboard/profesores/${id}`);
    return 'Profesor actualizado con éxito';
  } catch (error) {
    revalidatePath(`/dashboard/profesores/${id}`);
    return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar el profesor.' });
  }
}
  
// Eliminar un profesor
export async function deleteProfesor(id: string): Promise<string> {
  try {
    await sql`
        DELETE FROM profesor WHERE id = ${id}
      `;
    revalidatePath('/dashboard/profesores');
    return 'Profesor eliminado con éxito';
  } catch (error) {
    revalidatePath('/dashboard/profesores');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo eliminar el profesor.' });
  }
}

// Esquema de validación para la creación de un recurso por aula
const RecursoPorAulaFormSchema = z.object({
  id_aula: z.number().int().positive('El ID del aula debe ser un número entero positivo'),
  id_recurso: z.number().int().positive('El ID del recurso debe ser un número entero positivo'),
  cantidad: z.number().int().positive('La cantidad debe ser un número entero positivo')
});
  
// Crear un recurso por aula
const CreateRecursoPorAula = RecursoPorAulaFormSchema;
  
export async function createRecursoPorAula(formData: FormData): Promise<string> {
  const validatedFields = CreateRecursoPorAula.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al asignar recurso al aula.',
    });
  }
  
  const { id_aula, id_recurso, cantidad } = validatedFields.data;
  
  try {
    const result = await sql`
        SELECT public.insert_recurso_por_aula(
          ${id_aula},
          ${id_recurso},
          ${cantidad}
        ) as result;
      `;
  
    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'El recurso ya está asignado a esa aula.' });
    } else if (result.rows[0].result === 2) {
      return Promise.reject({ message: 'No existe el aula o el recurso.' });
    } else {
      revalidatePath('/dashboard/recursos_por_aula');
      return 'Recurso asignado al aula con éxito';
    }
  } catch (error) {
    revalidatePath('/dashboard/recursos_por_aula');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo asignar el recurso al aula.' });
  }
}
  
// Actualizar un recurso por aula
export async function updateRecursoPorAula(id_aula: number, id_recurso: number, formData: FormData): Promise<string> {
  const validatedFields = RecursoPorAulaFormSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar el recurso por aula.',
    });
  }
  
  const { cantidad } = validatedFields.data;
  
  try {
    await sql`
        UPDATE recurso_por_aula
        SET cantidad = ${cantidad}
        WHERE id_aula = ${id_aula} AND id_recurso = ${id_recurso}
      `;
    revalidatePath(`/dashboard/recursos_por_aula/${id_aula}/${id_recurso}`);
    return 'Recurso por aula actualizado con éxito';
  } catch (error) {
    revalidatePath(`/dashboard/recursos_por_aula/${id_aula}/${id_recurso}`);
    return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar el recurso por aula.' });
  }
}
  
// Eliminar un recurso por aula
export async function deleteRecursoPorAula(id_aula: number, id_recurso: number): Promise<string> {
  try {
    await sql`
        DELETE FROM recurso_por_aula WHERE id_aula = ${id_aula} AND id_recurso = ${id_recurso}
      `;
    revalidatePath('/dashboard/recursos_por_aula');
    return 'Recurso por aula eliminado con éxito';
  } catch (error) {
    revalidatePath('/dashboard/recursos_por_aula');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo eliminar el recurso por aula.' });
  }
}

// Esquema de validación para la creación de un recurso
const RecursoFormSchema = z.object({
  id_recurso: z.string().optional(),
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida')
});
  
// Crear un recurso
const CreateRecurso = RecursoFormSchema.omit({ id_recurso: true });
  
export async function createRecurso(formData: FormData): Promise<string> {
  const validatedFields = CreateRecurso.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al crear recurso.',
    });
  }
  
  const { nombre, descripcion } = validatedFields.data;
  
  try {
    const result = await sql`
        SELECT public.insert_recurso(
          ${nombre},
          ${descripcion}
        ) as result;
      `;
  
    if (result.rows[0].result === 1) {
      return Promise.reject({ message: 'El recurso ya existe.' });
    } else {
      revalidatePath('/dashboard/recursos');
      return 'Recurso creado con éxito';
    }
  } catch (error) {
    revalidatePath('/dashboard/recursos');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo crear el recurso.' });
  }
}
  
// Actualizar un recurso
export async function updateRecurso(id_recurso: string, formData: FormData): Promise<string> {
  const validatedFields = RecursoFormSchema.safeParse(Object.fromEntries(formData.entries()));
  
  if (!validatedFields.success) {
    return Promise.reject({
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan datos. Error al actualizar recurso.',
    });
  }
  
  const { nombre, descripcion } = validatedFields.data;
  
  try {
    await sql`
        UPDATE recurso
        SET nombre = ${nombre}, descripcion = ${descripcion}
        WHERE id_recurso = ${id_recurso}
      `;
    revalidatePath(`/dashboard/recursos/${id_recurso}`);
    return 'Recurso actualizado con éxito';
  } catch (error) {
    revalidatePath(`/dashboard/recursos/${id_recurso}`);
    return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar el recurso.' });
  }
}
  
// Eliminar un recurso
export async function deleteRecurso(id_recurso: string): Promise<string> {
  try {
    await sql`
        DELETE FROM recurso WHERE id_recurso = ${id_recurso}
      `;
    revalidatePath('/dashboard/recursos');
    return 'Recurso eliminado con éxito';
  } catch (error) {
    revalidatePath('/dashboard/recursos');
    return Promise.reject({ message: 'Error en la base de datos: No se pudo eliminar el recurso.' });
  }
}

/* Esquema de validación para la creación de una asignación
const AsignacionFormSchema = z.object({
    id: z.string().optional(),
    id_aula: z.number().int().positive('El ID del aula debe ser un número entero positivo'),
    id_materia: z.number().int().positive('El ID de la materia debe ser un número entero positivo'),
    id_evento: z.number().int().positive('El ID del evento debe ser un número entero positivo'),
    dia: z.enum(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'], 'El día es requerido'),
    horario_comienzo: z.string().min(1, 'El horario de comienzo es requerido'),
    horario_fin: z.string().min(1, 'El horario de fin es requerido')
  });
  
  // Crear una asignación
  const CreateAsignacion = AsignacionFormSchema.omit({ id: true });
  
  export async function createAsignacion(formData: FormData): Promise<string> {
    const validatedFields = CreateAsignacion.safeParse(Object.fromEntries(formData.entries()));
  
    if (!validatedFields.success) {
      return Promise.reject({
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Faltan datos. Error al crear asignación.',
      });
    }
  
    const { id_aula, id_materia, id_evento, dia, horario_comienzo, horario_fin } = validatedFields.data;
  
    try {
      const result = await sql`
        SELECT public.insert_asignacion(
          ${id_aula},
          ${id_materia},
          ${id_evento},
          ${dia},
          ${horario_comienzo},
          ${horario_fin}
        ) as result;
      `;
  
      if (result.rows[0].result === 1) {
        return Promise.reject({ message: 'La asignación ya existe.' });
      } else {
        revalidatePath('/dashboard/asignaciones');
        return 'Asignación creada con éxito';
      }
    } catch (error) {
      revalidatePath('/dashboard/asignaciones');
      return Promise.reject({ message: 'Error en la base de datos: No se pudo crear la asignación.' });
    }
  }
  
  // Actualizar una asignación
  export async function updateAsignacion(id: string, formData: FormData): Promise<string> {
    const validatedFields = AsignacionFormSchema.safeParse(Object.fromEntries(formData.entries()));
  
    if (!validatedFields.success) {
      return Promise.reject({
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Faltan datos. Error al actualizar asignación.',
      });
    }
  
    const { id_aula, id_materia, id_evento, dia, horario_comienzo, horario_fin } = validatedFields.data;
  
    try {
      await sql`
        UPDATE asignacion
        SET id_aula = ${id_aula}, id_materia = ${id_materia}, id_evento = ${id_evento}, 
        dia = ${dia}, horario_comienzo = ${horario_comienzo}, horario_fin = ${horario_fin}
        WHERE id = ${id}
      `;
      revalidatePath(`/dashboard/asignaciones/${id}`);
      return 'Asignación actualizada con éxito';
    } catch (error) {
      revalidatePath(`/dashboard/asignaciones/${id}`);
      return Promise.reject({ message: 'Error en la base de datos: No se pudo actualizar la asignación.' });
    }
  }
  
  // Eliminar una asignación
  export async function deleteAsignacion(id: string): Promise<string> {
    try {
      await sql`
        DELETE FROM asignacion WHERE id = ${id}
      `;
      revalidatePath('/dashboard/asignaciones');
      return 'Asignación eliminada con éxito';
    } catch (error) {
      revalidatePath('/dashboard/asignaciones');
      return Promise.reject({ message: 'Error en la base de datos: No se pudo eliminar la asignación.' });
    }
  }*/
