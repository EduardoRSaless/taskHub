import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import Button from "./button/Button";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return "";
    }

    // Definir tamanho fixo e pequeno para o canvas final (Avatar não precisa ser gigante)
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Desenhar a imagem cortada e redimensionada diretamente no canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      size,
      size
    );

    // Retornar Base64 com qualidade média (0.7)
    // Isso deve gerar uma string de ~30-50KB
    return canvas.toDataURL("image/jpeg", 0.7);
  };

  const handleSave = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImage);
      } catch (e) {
        console.error(e);
        alert("Erro ao cortar imagem.");
      }
    }
  };

  return (
    <div className="flex flex-col h-[400px] w-full">
      <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden mb-4">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1} // Quadrado
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={onZoomChange}
        />
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-gray-500">Zoom</span>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSave}>
          Cortar e Salvar
        </Button>
      </div>
    </div>
  );
}
