import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Key, Plug, Shield, Menu, Globe, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 rounded-lg transition-all duration-200",
          active 
            ? "bg-black/10 text-foreground font-semibold shadow-sm" 
            : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
        )}
      >
        <Icon size={18} />
        {label}
      </Button>
    </Link>
  );
};

export default function Layout({ children }) {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 md:p-8">
      {/* Floating App Container */}
      <div className="w-full max-w-[1600px] h-full md:h-[90vh] glass-panel rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10">
        
        {/* Glass Sidebar (Desktop) */}
        <aside className="w-64 glass-sidebar hidden md:flex flex-col">
          {/* Mac Traffic Lights Aesthetic */}
          <div className="p-6 h-20 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400/80 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-green-400/80 shadow-sm" />
            </div>
          </div>
          
          <div className="px-6 pb-2">
            <h1 className="font-bold text-xl tracking-tight opacity-80">OAuth Hub</h1>
            <p className="text-xs text-muted-foreground">Localhost Edition</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem to="/providers" icon={Shield} label="Providers" />
            <SidebarItem to="/tokens" icon={Key} label="Tokens" />
            <SidebarItem to="/webhooks" icon={Plug} label="Webhooks" />
            <SidebarItem to="/subdomains" icon={Globe} label="Custom Domains" />
          </nav>

          <div className="p-4 border-t border-black/5 space-y-2">
            <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={logout}
            >
                <LogOut size={18} />
                Logout
            </Button>
          </div>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
           <div className="absolute inset-0 z-50 md:hidden bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setMobileMenuOpen(false)}>
              <div className="glass-sidebar w-3/4 h-full p-4 flex flex-col animate-in slide-in-from-left duration-200" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-8 p-2">
                      <span className="font-bold text-xl">Menu</span>
                      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}><Menu size={20}/></Button>
                  </div>
                  <nav className="space-y-2">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                    <SidebarItem to="/providers" icon={Shield} label="Providers" onClick={() => setMobileMenuOpen(false)} />
                    <SidebarItem to="/tokens" icon={Key} label="Tokens" onClick={() => setMobileMenuOpen(false)} />
                    <SidebarItem to="/webhooks" icon={Plug} label="Webhooks" onClick={() => setMobileMenuOpen(false)} />
                    <SidebarItem to="/subdomains" icon={Globe} label="Custom Domains" onClick={() => setMobileMenuOpen(false)} />
                  </nav>
                  <div className="mt-auto pt-4 border-t border-black/5">
                    <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                        onClick={logout}
                    >
                        <LogOut size={18} />
                        Logout
                    </Button>
                  </div>
              </div>
           </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white/40 backdrop-blur-sm">
          {/* Mobile Header */}
          <header className="h-16 border-b border-black/5 px-6 flex items-center justify-between md:hidden glass-sidebar shrink-0">
            <div className="font-bold">OAuth Hub</div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}><Menu size={20}/></Button>
          </header>

          <main className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth relative">
            <div className="mx-auto max-w-6xl animate-in fade-in zoom-in-95 duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Background Ambience (Optional Orb) */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />
    </div>
  );
}
