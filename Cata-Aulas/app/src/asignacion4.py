import csv
import ast
import sys
from collections import defaultdict

# Configurar la salida estándar a UTF-8
sys.stdout.reconfigure(encoding='ISO-8859-1')


def leer_aulas(archivo):
    aulas = []
    try:
        with open(archivo, newline='', encoding='ISO-8859-1') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # Saltar encabezado
            for row in reader:
                if len(row) >= 4:
                    try:
                        capacidad = int(row[1]) if row[1].isdigit() else 0
                        disponibilidad = ast.literal_eval(
                            row[3]) if row[3] else []
                        aulas.append({
                            'nombre': row[0],
                            'capacidad': capacidad,
                            'edificio': row[2],
                            'disponibilidad': disponibilidad
                        })
                    except (ValueError, SyntaxError):
                        print(f"Error: Valor inválido en la fila {
                              row} del archivo {archivo}")
                else:
                    print(f"Error: Fila con menos de 4 columnas en {archivo}")
    except FileNotFoundError:
        print(f"Error: Archivo {archivo} no encontrado")
    except csv.Error as e:
        print(f"Error: Error al leer el archivo {archivo}: {e}")
    return aulas


def leer_materias(archivo):
    materias = []
    try:
        with open(archivo, newline='', encoding='ISO-8859-1') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # Saltar encabezado
            for row in reader:
                if len(row) >= 12:  # Ajustado para asegurar que todas las columnas requeridas estén presentes
                    materias.append({
                        'codigo_guarani': row[0],
                        'nombre': row[1],
                        'carrera': row[2],
                        'anio': row[3],
                        'cuatrimestre': row[4],
                        'profesores': row[11],
                        'alumnos_esperados': int(row[7]) if row[7].isdigit() else 0,
                        'horas_frente_curso': int(row[10]) if row[10].isdigit() else 0,
                        'comisiones': row[8]
                    })
                else:
                    print(f"Error: Fila con menos de 12 columnas en {archivo}")
    except FileNotFoundError:
        print(f"Error: Archivo {archivo} no encontrado")
    except csv.Error as e:
        print(f"Error: Error al leer el archivo {archivo}: {e}")
    return materias


def leer_profesores(archivo):
    profesores = []
    try:
        with open(archivo, newline='', encoding='ISO-8859-1') as csvfile:
            reader = csv.reader(csvfile)
            next(reader)  # Saltar encabezado
            for row in reader:
                if len(row) >= 8:  # Ajustado para asegurar que todas las columnas requeridas estén presentes
                    profesores.append({
                        'nombre': row[2],
                        'apellido': row[1],
                        'condicion': row[3],
                        'materias': row[7],
                        'horarios_disponibles': row[6],
                    })
                else:
                    print(f"Error: Fila con menos de 8 columnas en {archivo}")
    except FileNotFoundError:
        print(f"Error: Archivo {archivo} no encontrado")
    except csv.Error as e:
        print(f"Error: Error al leer el archivo {archivo}: {e}")
    return profesores


def organizar_horarios_profesores(profesores):
    horarios_disponibles = defaultdict(lambda: defaultdict(list))

    for profesor in profesores:
        profesor_horarios = defaultdict(list)
        str_copia_horarios_disponibles = profesor['horarios_disponibles']

        for bloque_dia_horas in str_copia_horarios_disponibles.split(';'):
            dia_horas = bloque_dia_horas.strip().split(',')  # Separar por comas
            dia = dia_horas[0].strip()  # Obtener el día

            for horas_rango in dia_horas[1:]:
                horas = horas_rango.strip().split('-')
                if len(horas) == 2:
                    hora_inicio = int(horas[0].strip())
                    hora_fin = int(horas[1].strip())
                    profesor_horarios[dia].append(f"{hora_inicio}-{hora_fin}")

        nombre_completo = f"{profesor['nombre']} {profesor['apellido']}"
        horarios_disponibles[nombre_completo] = profesor_horarios

    return horarios_disponibles


def asignar_materias_aulas(materias, aulas, horarios_profesores):
    materias_asignadas = []
    materias_sin_asignar = []
    dias_semana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

    while materias:
        materia = materias.pop()
        asignada = False

        for aula in aulas:
            if aula['capacidad'] >= int(materia['alumnos_esperados']):
                for dia in dias_semana:
                    horarios_materia = horarios_profesores.get(
                        materia['profesores'], {}).get(dia, [])

                    for horario in horarios_materia:
                        inicio, fin = map(int, horario.split('-'))

                        if (fin - inicio) * 2 <= aula['capacidad'] and not asignada:
                            # Verificar disponibilidad del aula para el horario
                            disponible = True
                            for hora in range(inicio, fin):
                                if not aula['disponibilidad'][dia][hora - 8]:
                                    disponible = False
                                    break

                            if disponible:
                                # Asignar materia al aula
                                for hora in range(inicio, fin):
                                    aula['disponibilidad'][dia][hora -
                                                                8] = materia['nombre']
                                materias_asignadas.append({
                                    'materia': materia['nombre'],
                                    'aula': aula['nombre'],
                                    'dia': dia,
                                    'horario': f"{inicio}-{fin}"
                                })
                                asignada = True
                                break

        if not asignada:
            materias_sin_asignar.append(materia)

    return materias_asignadas, materias_sin_asignar, aulas


def guardar_materias_asignadas(materias_asignadas, archivo):
    with open(archivo, mode='w', newline='', encoding='ISO-8859-1') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Materia', 'Aula', 'Día', 'Horario'])
        for asignacion in materias_asignadas:
            writer.writerow([asignacion['materia'], asignacion['aula'],
                            asignacion['dia'], asignacion['horario']])


def guardar_materias_sin_asignar(materias_sin_asignar, archivo):
    with open(archivo, mode='w', newline='', encoding='ISO-8859-1') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Codigo', 'Nombre', 'Carrera', 'Año', 'Cuatrimestre',
                        'Profesores', 'Alumnos Esperados', 'Horas Frente a Curso', 'Comisiones'])
        for materia in materias_sin_asignar:
            writer.writerow([
                materia['codigo_guarani'], materia['nombre'], materia['carrera'],
                materia['anio'], materia['cuatrimestre'], materia['profesores'],
                materia['alumnos_esperados'], materia['horas_frente_curso'], materia['comisiones']
            ])


def guardar_estado_aulas(aulas, archivo):
    with open(archivo, mode='w', newline='', encoding='ISO-8859-1') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['Nombre', 'Capacidad', 'Edificio', 'Disponibilidad'])
        for aula in aulas:
            writer.writerow([aula['nombre'], aula['capacidad'],
                            aula['edificio'], str(aula['disponibilidad'])])


# Leer los archivos
aulas = leer_aulas('Aulas.csv')
materias = leer_materias('Materias.csv')
profesores = leer_profesores('Profesores.csv')

# Procesar horarios disponibles por día para cada profesor
horarios_profesores = organizar_horarios_profesores(profesores)
# Imprime los profesores y sus horarios
print("Profesores y sus horarios disponibles por día:")
for profesor_nombre, horarios_dia in horarios_profesores.items():
    print(f"{profesor_nombre}:")
    for dia, horas in horarios_dia.items():
        print(f"  {dia}: {', '.join(horas)}")

# Asignar materias a aulas
materias_asignadas, materias_sin_asignar, aulas_actualizadas = asignar_materias_aulas(
    materias, aulas, horarios_profesores)

# Guardar resultados
guardar_materias_asignadas(materias_asignadas, 'Materias_Asignadas.csv')
guardar_materias_sin_asignar(materias_sin_asignar, 'Materias_Sin_Asignar.csv')
guardar_estado_aulas(aulas_actualizadas, 'Aulas_Actualizadas.csv')
