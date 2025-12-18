import React from 'react';
import { PROVIDER_PRESETS } from '../lib/providerPresets';
import { cn } from '../lib/utils';

export function ProviderPresetsGrid({ onSelect, className }) {
  return (
    <div className={cn("grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6", className)}>
      {PROVIDER_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset)}
          className="group relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-border/40 bg-card hover:bg-accent/50 transition-all hover:scale-105 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="w-8 h-8 flex items-center justify-center p-1 bg-white rounded-full shadow-sm ring-1 ring-black/5">
              <img src={preset.logo} alt={preset.name} className="w-full h-full object-contain" />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground">
            {preset.name}
          </span>
        </button>
      ))}
    </div>
  );
}
