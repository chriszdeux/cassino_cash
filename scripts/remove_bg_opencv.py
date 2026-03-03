import cv2
import numpy as np
import os
import glob
import argparse

def process_image(img_path, output_path):
    print(f"Procesando: {os.path.basename(img_path)}...")
    # Leer la imagen con canal alpha si existe
    img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"❌ Error al cargar {img_path}")
        return

    # Si no tiene canal alpha, lo agregamos
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
    elif img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    # Convertir a HSV para aislar mejor los tonos oscuros y grises
    hsv = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2HSV)
    
    # Rango para color Negro y Gris Oscuro
    # El canal V (Value) controla el brillo. Valores bajos (< 75) son sombras y negros
    lower_black = np.array([0, 0, 0])
    upper_black = np.array([180, 255, 75])
    
    # Rango para color Gris (Baja saturación, brillo medio)
    lower_gray = np.array([0, 0, 0])
    upper_gray = np.array([180, 45, 160]) # Saturación < 45 se percibe muy gris/monocromo

    # Crear máscaras detectando esos rangos
    mask_black = cv2.inRange(hsv, lower_black, upper_black)
    mask_gray = cv2.inRange(hsv, lower_gray, upper_gray)
    
    # Combinar las máscaras que representan el fondo "sucio" a remover
    mask_to_remove = cv2.bitwise_or(mask_black, mask_gray)
    
    # Invertir la máscara: Lo que era el fondo ahora es 0 (negro), lo que queremos es 255 (blanco)
    mask_to_keep = cv2.bitwise_not(mask_to_remove)
    
    # Limpieza morfológica: Remover pequeños puntos aislados (ruido)
    kernel = np.ones((5, 5), np.uint8)
    # Erode seguido de Dilate remueve puntitos en el fondo
    mask_to_keep = cv2.morphologyEx(mask_to_keep, cv2.MORPH_OPEN, kernel)
    
    # Suavizar levemente los bordes de la máscara (Feathering)
    mask_to_keep = cv2.GaussianBlur(mask_to_keep, (5, 5), 0)
    
    # Aplicar la máscara al canal Alpha (Transparencia)
    img[:, :, 3] = mask_to_keep

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    # Guardar como PNG para preservar la transparencia
    cv2.imwrite(output_path, img)
    print(f"✅ Guardado correctamente: {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Script para extraer sprites e ignorar fondos grises/negros.")
    parser.add_argument("--dir", type=str, default="public/sprites", help="Directorio con imágenes de origen")
    parser.add_argument("--out", type=str, default="public/sprites/transparent_extracted", help="Directorio de destino")
    args = parser.parse_args()

    input_dir = os.path.abspath(args.dir)
    output_dir = os.path.abspath(args.out)
    
    if not os.path.exists(input_dir):
        print(f"Directorio no encontrado: {input_dir}")
        return
        
    os.makedirs(output_dir, exist_ok=True)
    
    # Buscar imágenes
    files = []
    for ext in ("*.png", "*.jpg", "*.jpeg"):
        files.extend(glob.glob(os.path.join(input_dir, ext)))
        
    if not files:
        print("No se encontraron imágenes en el directorio provisto.")
        return

    print(f"Iniciando extracción por Inteligencia Artificial de Color para {len(files)} imágenes...")
    for file in files:
        output_path = os.path.join(output_dir, f"{os.path.splitext(os.path.basename(file))[0]}.png")
        process_image(file, output_path)

if __name__ == "__main__":
    main()
