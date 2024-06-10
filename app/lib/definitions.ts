export type Admin = {
    id: string;
    name: string;
    email: string;
    password: string;
  };
  
export type Materia = {
    id: string;
    codigo_guarani: string;
    carrera: string;
    nombre: string;
    anio: number;
    cuatrimestre: number;
    taxonomia: string;
    horas_semanales: number;
    comisiones: number;
  };
  
export type Aula = {
    id_aula: string;
    nombre: string;
    id_edificio: number;
  };
  
export type Edificio = {
    id: string;
    nombre: string;
    direccion: string;
    altura: number;
  };
  
export type Evento = {
    id: string;
    nombre: string;
    descripcion: string;
    comienzo: string; // Assuming dates are in ISO string format
    fin: string; // Assuming dates are in ISO string format
  };
  
export type Profesor = {
    id: string;
    documento: number;
    nombre: string;
    apellido: string;
    condicion: string;
    categoria: string;
    dedicacion: string;
    periodo_a_cargo: string;
  };
  
export type ProfesorPorMateria = {
    id_materia: number;
    id_profesor: number;
    alumnos_esperados: number;
    tipo_clase: string;
  };
  
export type RecursoPorAula = {
    id_aula: number;
    id_recurso: number;
    cantidad: number;
  };
  
export type Recurso = {
    id_recurso: string;
    nombre: string;
    descripcion: string;
  };
  
export type Asignacion = {
    id: string;
    id_aula: number;
    id_materia: number;
    id_evento: number;
    dia: 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
    horario_comienzo: string; // Assuming times are in ISO string format
    horario_fin: string; // Assuming times are in ISO string format
  };
  
