import { useState, useRef, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../context/AuthContext";
import { Modal } from "../ui/modal";
import { PencilIcon } from "../../icons";
// import { resizeImage } from "../../utils/imageUtils"; // Removido pois não é usado
import ImageCropper from "../ui/ImageCropper";

const DEFAULT_AVATAR = "/images/user/perfil.svg";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, updateUser } = useAuth();
  
  // Estados locais para edição
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setRole(user.role || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleCropComplete = (croppedImage: string) => {
    setPreviewImage(croppedImage);
    setIsCropping(false);
    setSelectedFile(null);
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setSelectedFile(null);
  };

  const handleSave = async () => {
    try {
      const updates: any = { name, role, email };
      if (previewImage) {
        updates.avatar = previewImage;
      }
      
      await updateUser(updates);
      setPreviewImage(null);
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCloseModal = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setIsCropping(false);
    closeModal();
  };

  if (!user) return null;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 group">
              <img 
                src={user.avatar || DEFAULT_AVATAR} 
                alt="user" 
                className="object-cover w-full h-full" 
              />
              <button 
                onClick={openModal}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.role}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <PencilIcon className="h-4 w-4" />
            Editar Perfil
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[500px] p-6">
        <div className="flex flex-col">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90 text-center">
            {isCropping ? "Ajustar Foto" : "Editar Perfil"}
          </h3>
          
          {isCropping && selectedFile ? (
            <ImageCropper 
              imageSrc={selectedFile} 
              onCropComplete={handleCropComplete} 
              onCancel={handleCancelCrop} 
            />
          ) : (
            <>
              {/* Foto Preview */}
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32 group cursor-pointer" onClick={triggerFileInput}>
                  <img 
                    src={previewImage || user.avatar || DEFAULT_AVATAR} 
                    alt="Preview" 
                    className="w-full h-full rounded-full object-cover border-4 border-gray-100 dark:border-gray-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Alterar</span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Campos */}
              <div className="space-y-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                <div>
                  <Label>Cargo / Papel</Label>
                  <Input 
                    type="text" 
                    value={role} 
                    disabled 
                    className="opacity-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex w-full gap-3 mt-6">
                <Button size="sm" variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave} className="flex-1">
                  Salvar Alterações
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
