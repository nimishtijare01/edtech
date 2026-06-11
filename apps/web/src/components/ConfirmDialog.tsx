"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border p-6 rounded-xl shadow-lg w-full max-w-sm relative">
        <div className="flex items-center gap-3 mb-4 text-destructive">
          <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
            <AlertTriangle size={20} />
          </div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          {description}
        </p>

        <div className="flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg font-medium text-muted-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm}
            disabled={loading}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
