import { Modal } from "./index";
import Button from "../button/Button";
import { AlertIcon } from "../../../icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Excluir",
  cancelText = "Cancelar",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-6 bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-50 dark:bg-red-900/20">
          <AlertIcon className="w-6 h-6 text-red-500" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>

        <div className="flex gap-3 w-full">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 justify-center"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant="primary" 
            onClick={onConfirm} 
            className="flex-1 justify-center bg-red-500 hover:bg-red-600 border-red-500"
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
