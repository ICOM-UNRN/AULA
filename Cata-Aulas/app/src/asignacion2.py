import csv
import ast


def leer_archivo(archivo, parser):
    datos = []
    try:
        with open(archivo, newline='', encoding='ISO-8859-1') as csvfile:
            reader = csv.reader(csvfile)
            for row in reader:
                datos.append(parser(row))
    except FileNotFoundError:
        print(f"Error: Archivo {archivo} no encontrado")
    except csv.Error:
        print(f"Error: Error al leer el archivo {archivo}")
    return datos


def leer_aulas(archivo):
    def parser(row):
        return {
            'nombre': row[0],
            'capacidad': int(row[1]),
            'edificio': row[2],
            'disponibilidad': ast.literal_eval(row[3])
        }
    return leer_archivo(archivo, parser)


def leer_materias(archivo):
    def parser(row):
        materia = {
            'codigo_guarani': row[0],
            'nombre': row[1],
            'carrera': row[2],
            'anio': row[3],
            'cuatrimestre': row[4],
            'profesores': None,  # Inicializar como None para manejar datos faltantes
            'alumnos_esperados': int(row[7])
        }

        try:
            profesores_value = row[11].strip()
            if profesores_value:  # Si no está vacío
                profesores_data = ast.literal_eval(
                    profesores_value)  # Convierte a diccionario
                if isinstance(profesores_data, dict) and all(key in profesores_data for key in ['dia', 'horas']):
                    materia['profesores'] = profesores_data
                else:
                    print(f"Error: 'profesores' en la materia {
                          materia['nombre']} no tiene la estructura correcta")
            else:
                print(f"Error: 'profesores' en la materia {
                      materia['nombre']} no es un diccionario válido")

        except (SyntaxError, ValueError):
            print(f"Error: 'profesores' en la materia {
                  materia['nombre']} no es un diccionario válido")

        return materia

    return leer_archivo(archivo, parser)


# Leer los archivos
aulas = leer_aulas('Aulas.csv')
materias = leer_materias('Materias.csv')


def asignar_aulas_y_horarios(aulas, materias):
    asignaciones = []

    for materia in materias:
        asignada = False

        # Intentar asignar aula
        for aula in aulas:
            if materia['alumnos_esperados'] <= aula['capacidad']:
                available = all(aula['disponibilidad'][dia][hora] for dia, horas in materia['profesores'].items()
                                for hora in horas.split(','))

                if available:
                    # Asignar aula y marcar horarios como ocupados
                    asignaciones.append({
                        'materia': materia['nombre'],
                        'aula': aula['nombre'],
                        'dia': dia,
                        'horas': horas
                    })
                    for hora in horas.split(','):
                        aula['disponibilidad'][dia][hora] = False
                    asignada = True
                    break

        if not asignada:
            print(f"No se pudo asignar aula para la materia {
                  materia['nombre']}")

    return asignaciones


def guardar_asignaciones(asignaciones, archivo):
    with open(archivo, mode='w', newline='', encoding='ISO-8859-1') as csvfile:
        fieldnames = ['materia', 'aula', 'dia', 'horas']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for asignacion in asignaciones:
            writer.writerow(asignacion)


# Asignar aulas y horarios
asignaciones = asignar_aulas_y_horarios(aulas, materias)
