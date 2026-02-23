import React from "react";
import { Modal } from "./Modal";
import Button from "../button/Button";
import { AlertIcon } from "../../../icons";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-6">
      <div className="flex flex-col items-center text-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
          variant === "danger" ? "bg-red-100 text-red-500 dark:bg-red-500/20" :
          variant === "warning" ? "bg-orange-100 text-orange-500 dark:bg-orange-500/20" :
          "bg-blue-100 text-blue-500 dark:bg-blue-500/20"
        }`}>
          <AlertIcon className="w-6 h-6" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        <div className="flex gap-3 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button 
            variant={variant === "danger" ? "primary" : "primary"} // Ajuste conforme seu Button suportar variants
            className={`flex-1 ${variant === "danger" ? "bg-red-500 hover:bg-red-600" : ""}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
