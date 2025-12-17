import React from 'react';
import { PRESETS } from '../lib/presets';
import { cn } from '../lib/utils';
import { Card } from './ui/card';

export function ProviderPresetsGrid({ onSelect, className }) {
  return (
    <div className={cn("grid grid-cols-3 sm:grid-cols-6 gap-4 mb-6", className)}>
      {PRESETS.map((preset) => {
        const Icon = preset.icon;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset)}
            className="group relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <div 
                className="p-2 rounded-full transition-colors group-hover:bg-background"
                style={{ color: preset.color }}
            >
              <Icon className="w-8 h-8" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
              {preset.name}
            </span>
            
            {/* Active/Glow Effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        );
      })}
    </div>
  );
}
