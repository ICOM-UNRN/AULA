import csv
import json


def asignar_materias_a_aulas(materias_profesores, aulas_horarios):
    asignaciones = {}
    for materia in materias_profesores:
        try:
            dni, apellido, nombre, _, _, _, _, horarios_disponibles = materia
            for dia_horario in horarios_disponibles.split('; '):
                dia, horario = dia_horario.split(', ')
                # Aquí iría la lógica para asignar la materia a un aula en el horario correspondiente
                if (dia, horario) in aulas_horarios:
                    # Asignar aula correspondiente
                    asignacion = aulas_horarios[(dia, horario)]
                    asignaciones[(dni, apellido, nombre)] = asignacion
                else:
                    print(f"No hay aulas disponibles para {
                          dia} a las {horario}")
        except ValueError:
            print("Error: formato incorrecto en la línea:", materia)

    return asignaciones


# Ejemplo de uso
with open('materias.csv', newline='', encoding='utf-8') as csvfile:
    materias_profesores = list(csv.reader(csvfile))

aulas_horarios = {
    # Aquí irían los datos de las aulas y sus horarios disponibles
    ('LUN', '8-12'): 'Aula 101',
    ('MAR', '8-12'): 'Aula 102',
    # Agregar más datos de aulas y horarios según sea necesario
}

asignaciones = asignar_materias_a_aulas(materias_profesores, aulas_horarios)

# Guardar en CSV
with open('asignaciones.csv', 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    for key, value in asignaciones.items():
        writer.writerow([key[0], key[1], key[2], value])

# Guardar en JSON
with open('asignaciones.json', 'w', encoding='utf-8') as jsonfile:
    json.dump(asignaciones, jsonfile, indent=4)
