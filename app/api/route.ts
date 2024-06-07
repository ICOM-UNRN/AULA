import { NextResponse } from 'next/server';

export async function GET() {
  const endpoints = [
    {
      path: '/api/profesor',
      description: 'Endpoint para manejar profesores',
      methods: ['GET'],
    },
    {
      path: '/api/edificio',
      description: 'Endpoint para manejar edificios',
      methods: ['GET'],
    },
    {
      path: '/api/aula',
      description: 'Endpoint para manejar aulas',
      methods: ['GET'],
    },
    {
      path: '/api/evento',
      description: 'Endpoint para manejar eventos',
      methods: ['GET'],
    },
    {
      path: '/api/recurso',
      description: 'Endpoint para manejar recursos',
      methods: ['GET'],
    },
    {
      path: '/api/recurso_por_aula',
      description: 'Endpoint para manejar recursos por aula',
      methods: ['GET'],
    },
    {
      path: '/api/asignacion',
      description: 'Endpoint para manejar asignaciones de aulas a materias',
      methods: ['GET'],
    },
    {
      path: '/api/profesor_por_materia',
      description: 'Endpoint para manejar asignaciones de profesores a materias',
      methods: ['GET'],
    },
    {
      path: '/api/materia',
      description: 'Endpoint para manejar materias',
      methods: ['GET'],
    },
  ];

  return NextResponse.json(endpoints, { status: 200 });
}
