import pandas as pd
import csv
import json
from categorias.Materia import Materia
from categorias.Profesor import Profesor


def leer_excel(nombre_archivo):
    try:
        # Leer el archivo Excel
        df = pd.read_excel(nombre_archivo)

        # Listas para almacenar datos procesados
        carreras_data = []
        profesores_data = []
        materias_data = []

        # Procesar cada fila del DataFrame
        for index, row in df.iterrows():
            codigo_guarani = row['Código Guaraní']
            nombre_materia = row['Materia']
            año = row['Año']
            cuatrimestre = row['Cuatrimestre']
            taxonomia = row['Taxonomía']
            horas_semanales = row['Horas Semanales']
            alumnos_esperados = row['Alumnos Esperados']
            comisiones = row['Comisiones']
            tipo_clase = row['Tipo de clase']
            horas_frente_curso = row['Horas frente al curso']
            carrera = row['Carrera']  # Nueva columna para la carrera

            dni_profesor = row['DNI Docente']
            apellido_profesor = row['Apellido Docente']
            nombre_profesor = row['Nombre Docente']
            condicion_profesor = row['Condición']
            categoria_profesor = row['Categoría']
            dedicacion_profesor = row['Dedicación']
            horarios_disponibles = row['Horarios Disponibles']

            # Procesar datos para carrera.csv
            carrera_data = {
                "carrera": carrera,
                # Lista para almacenar códigos guarani
                "codigo_guarani": [codigo_guarani]
            }

            # Si la carrera no existe en carreras_data, agregarla
            if carrera not in [carrera_item["carrera"] for carrera_item in carreras_data]:
                carreras_data.append(carrera_data)
            else:
                # Si la carrera existe, agregar el código guarani a la lista existente
                for carrera_item in carreras_data:
                    if carrera_item["carrera"] == carrera:
                        carrera_item["codigo_guarani"].append(codigo_guarani)

            # Crear un diccionario para almacenar datos del profesor
            profesor_data = next(
                (profesor for profesor in profesores_data if profesor["dni"] == dni_profesor), None)
            if not profesor_data:
                profesor_data = {
                    "dni": dni_profesor,
                    "apellido": apellido_profesor,
                    "nombre": nombre_profesor,
                    "condicion": condicion_profesor,
                    "categoria": categoria_profesor,
                    "dedicacion": dedicacion_profesor,
                    "horarios_disponibles": horarios_disponibles,
                    "materias": []
                }
                profesores_data.append(profesor_data)

            # Agregar materia a la lista de materias del profesor
            profesor_data["materias"].append(nombre_materia)

            # Procesar datos para materias.csv
            materia_data = {
                "codigo_guarani": codigo_guarani,
                "nombre": nombre_materia,
                "año": año,
                "cuatrimestre": cuatrimestre,
                "taxonomia": taxonomia,
                "horas_semanales": horas_semanales,
                "alumnos_esperados": alumnos_esperados,
                "comisiones": comisiones,
                "tipo_clase": tipo_clase,
                "horas_frente_curso": horas_frente_curso,
                "carrera": carrera
            }
            materias_data.append(materia_data)

        # Guardar datos en archivos CSV y JSON
        save_data_to_csv("carrera.csv", carreras_data)
        save_data_to_json("carrera.json", carreras_data)
        save_data_to_csv("profesores.csv", profesores_data)
        save_data_to_json("profesores.json", profesores_data)
        save_data_to_csv("materias.csv", materias_data)
        save_data_to_json("materias.json", materias_data)

    except Exception as e:
        print(f"Error processing the Excel file: {e}")


def save_data_to_csv(filename, data):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = list(data[0].keys())
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)


def save_data_to_json(filename, data):
    with open(filename, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4)


if __name__ == "__main__":
    leer_excel(r'etc\dist2cuadH.xlsx')
