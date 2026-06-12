import type { ReactNode } from "react";
import type { ModalMode } from "../types/modal";

interface ModalProps {
    isOpen: boolean;
    title: string;
    mode: ModalMode;
    saving?: boolean;
    onClose: () => void;
    onSave: () => void;
    children: ReactNode;
}

export function Modal({ isOpen, title, mode, saving, onClose, onSave, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-xl font-bold">{title}</h2>

                <div className="mb-6">{children}</div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded bg-gray-400 px-4 py-1 text-white hover:bg-gray-500"
                    >
                        Fechar
                    </button>
                    {mode !== "view" && (
                        <button
                            type="button"
                            onClick={onSave}
                            disabled={saving}
                            className="rounded bg-blue-600 px-4 py-1 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? "Salvando..." : "Salvar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
