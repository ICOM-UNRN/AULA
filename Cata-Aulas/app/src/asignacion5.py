import csv
import ast
import sys
from collections import defaultdict

# Configurar la salida estándar a UTF-8
sys.stdout.reconfigure(encoding='UTF-8')


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
                    # Convertir lista de diccionarios a un string con nombres de profesores
                    profesores = row[11]
                    try:
                        profesores_lista = ast.literal_eval(profesores)
                        if isinstance(profesores_lista, list):
                            profesores = ', '.join(
                                f"{prof['nombre']} {prof['apellido']}" for prof in profesores_lista)
                    except (ValueError, SyntaxError):
                        pass
                    materias.append({
                        'codigo_guarani': row[0],
                        'nombre': row[1],
                        'carrera': row[2],
                        'anio': row[3],
                        'cuatrimestre': row[4],
                        'profesores': profesores,
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
                    profes_dict = {
                        'nombre': row[2],
                        'apellido': row[1],
                        'condicion': row[3],
                        'materias': row[7],
                        'horarios_disponibles': row[6],
                    }
                    profesores.append(profes_dict)
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


def organizar_horarios_aulas(aulas):
    horarios_disponibles_aulas = defaultdict(lambda: defaultdict(list))

    for aula in aulas:
        disponibilidad_aula = aula['disponibilidad']

        for dia, disponibilidad_horaria in disponibilidad_aula.items():
            for hora, disponible in enumerate(disponibilidad_horaria, start=8):
                if disponible:
                    horarios_disponibles_aulas[aula['nombre']][dia].append(
                        # f"{hora}-{hora + 1}")
                        f"{hora}")

    return horarios_disponibles_aulas


def asignar_materias_a_aulas(materias, horarios_profesores, horarios_aulas):
    asignaciones = []

    for materia in materias:
        nombre_profesor = materia['profesores']
        horarios_profesor = horarios_profesores.get(nombre_profesor, {})

        print(f"Nombre: {nombre_profesor}", end=" | Horarios: ")
        for dia, horas_dia in horarios_profesor.items():
            print(f"  - {dia}: {horas_dia}")  # Iterate over values

        if not horarios_profesor:
            print(f"No se encontraron horarios disponibles para el profesor {
                  nombre_profesor}")
            continue

        asignado = False
        for dia, horas_profesor in horarios_profesor.items():
            if asignado:
                break

            for aula_nombre, horas_aula in horarios_aulas.items():
                horas_disponibles_aula = horas_aula.get(dia, [])

                for hora in horas_disponibles_aula:
                    if hora in horas_profesor:
                        asignaciones.append({
                            'materia': materia['nombre'],
                            'aula': aula_nombre,
                            'dia': dia,
                            'hora': hora,
                            'profesor': nombre_profesor
                        })
                        horarios_aulas[aula_nombre][dia].remove(hora)
                        asignado = True
                        break

    return asignaciones


# Leer los archivos
aulas = leer_aulas('Aulas.csv')
materias = leer_materias('Materias.csv')
profesores = leer_profesores('Profesores.csv')

# Procesar horarios disponibles por día para cada profesor
horarios_profesores = organizar_horarios_profesores(profesores)

# Imprimir o devolver los horarios organizados almacenados en horarios_disponibles_aulas
horarios_aulas = organizar_horarios_aulas(aulas)

# Asignar materias a aulas
asignaciones = asignar_materias_a_aulas(
    materias, horarios_profesores, horarios_aulas)

# Imprime todo lo obtenido en el codigo

# Aulas
# for aula in horarios_aulas:
#     print(f"\nAula: {aula}")
#     for dia, horas in horarios_aulas[aula].items():
#         print(f"  {dia}: {', '.join(horas)}")

# Profesores
# for profesor in horarios_profesores:
#     print(f"\nProfesor: {profesor}")
#     for dia, horas in horarios_profesores[profesor].items():
#         print(f"  {dia}: {', '.join(horas)}")

# Materias
# for materia in materias:
#     print(f"\nMateria: {materia['nombre']}, Profesor: {materia['profesores']}")

# Asignaciones
print("Asignaciones realizadas:")
for asignacion in asignaciones:
    print(f"Materia: {asignacion['materia']}, Aula: {asignacion['aula']}, Día: {
          asignacion['dia']}, Hora: {asignacion['hora']}, Profesor: {asignacion['profesor']}")

# Imprimir horario del profesor escrito
# print("Horario de profesores:")
# for dia, horas_disponibles in horarios_profesores["CATERINA LAMPERTI"].items():
#     print(f"Día: {dia}")
#     for hora_rango in horas_disponibles:
#         print(f"\t- {hora_rango}")

# print("\nHorario de aulas:")
# for aula, aulas_disponibles in horarios_aulas.items():
#     print(f"Aula: {aula}")
#     for hora_rango in aulas_disponibles:
#         print(f"\t- {hora_rango, aulas_disponibles[hora_rango]}")
