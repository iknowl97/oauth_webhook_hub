import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Key, Plug, Shield, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

const SidebarItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to}>
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn("w-full justify-start gap-3", active && "font-semibold")}
      >
        <Icon size={18} />
        {label}
      </Button>
    </Link>
  );
};

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 h-16 flex items-center gap-2 border-b">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold shadow-sm">
                Hub
            </div>
            <h1 className="font-bold text-lg tracking-tight">OAuth Hub</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem to="/providers" icon={Shield} label="Providers" />
          <SidebarItem to="/tokens" icon={Key} label="Tokens" />
          <SidebarItem to="/webhooks" icon={Plug} label="Webhooks" />
        </nav>

        <div className="p-4 border-t text-xs text-muted-foreground text-center">
            OAuth & Webhook Hub v1.0
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card/50 px-6 flex items-center justify-between md:hidden">
            <div className="font-bold">OAuth Hub</div>
            <Button variant="ghost" size="icon"><Menu size={20}/></Button>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
