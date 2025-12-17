import { X } from 'lucide-react';

export default function Dialog({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white/90 backdrop-blur-2xl text-card-foreground border border-white/20 rounded-[24px] w-full max-w-lg shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[85vh] flex flex-col">
        <div className="flex flex-col space-y-1.5 p-6 pb-4 shrink-0">
          <div className="flex items-center justify-between">
             <h3 className="font-bold leading-none tracking-tight text-xl">{title}</h3>
             <button onClick={onClose} className="rounded-full p-1 opacity-70 hover:bg-black/5 hover:opacity-100 transition-all focus:outline-none">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
             </button>
          </div>
        </div>
        <div className="p-6 pt-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
