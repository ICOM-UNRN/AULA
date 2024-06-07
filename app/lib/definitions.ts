export type Asignacion = {
  id_aula: string;
  id_materia: string;
  dia: string;
  horario_comienzo: string;
  horario_fin: string;
};

export type Aula = {
  id_aula: string;
  id_edificio: string;
};

export type Edificio = {
  id: string;
  direccion: string;
  altura: string;
};

export type Evento = {
  id: string;
  nombre: string;
  descripcion: string;
  id_aula: string;
};

export type Materia = {
  id: string;
  codigo_guarani: string;
  carrera: string;
  nombre: string;
  anio: string;
  cuatrimestre: string;
  taxonomia: string;
  horas_semanales: string;
  comisiones: string;
}

export type Profesor = {
  id: string;
  documento: string;
  nombre: string;
  apellido: string;
  condicion: string;
  categoria: string;
  dedicacion: string;
  periodo_a_cargo: string;
};

export type ProfesorPorMateria = {
  id_materia: string;
  id_profesor: string;
  alumnos_esperados: string;
  tipo_clase: string;
};

export type Recurso = {
  id: string;
  descripcion: string;
  cantidad: string;
};

export type RecursoPorAula = {
  id_aula: string;
  id_recurso: string;
  cantidad: string;
};

