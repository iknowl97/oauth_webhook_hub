import Link from 'react-router-dom';
import { clsx } from 'clsx';
import { cn } from '../lib/utils';
import { X } from 'lucide-react';

export default function Dialog({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card text-card-foreground border rounded-lg w-full max-w-lg shadow-lg animate-in zoom-in-95 duration-200">
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
          <div className="flex items-center justify-between">
             <h3 className="font-semibold leading-none tracking-tight text-lg">{title}</h3>
             <button onClick={onClose} className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
             </button>
          </div>
        </div>
        <div className="p-6 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
