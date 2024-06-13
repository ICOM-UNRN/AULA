import subprocess
from categorias.Edificio import Edificio


def main():
    try:
        # Ejecutar leerExcel.py usando subprocess
        subprocess.run(["python", "app/src/leerExcel.py"])

        # Crear el edificio
        edificio = Edificio("Anasagasti II")

        # Agregar pisos y aulas
        edificio.agregar_piso("Segundo Piso", 4, 30)
        edificio.agregar_piso("Tercer Piso", 4, 30)
        edificio.agregar_piso("PB", 2, 20)

        # Mostrar disponibilidad
        edificio.mostrar_disponibilidad()

        # Guardar la información en CSV y JSON
        edificio.guardar_aulas_csv("aulas.csv")
        edificio.guardar_aulas_json("aulas.json")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
