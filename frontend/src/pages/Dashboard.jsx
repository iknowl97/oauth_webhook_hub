import { useEffect, useState } from 'react';
import { getProviders, getWebhooks, getTokens } from '../lib/api';
import { Shield, Key, Plug, Activity, ArrowUpRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function Dashboard() {
  const [stats, setStats] = useState({ providers: 0, tokens: 0, webhooks: 0 });
  
  useEffect(() => {
    async function load() {
        try {
            const [p, t, w] = await Promise.all([getProviders(), getTokens(), getWebhooks()]);
            setStats({ providers: p.length, tokens: t.length, webhooks: w.length });
        } catch (e) {
            console.error(e);
        }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-transparent border border-violet-500/10 p-8">
        <div className="flex flex-col gap-4 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Overview of your authentication infrastructure. Monitor providers, tokens, and webhooks in real-time.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-violet-500/10 blur-[80px] rounded-full pointer-events-none" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-all duration-300 border-white/20 bg-white/50 backdrop-blur-sm group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Shield className="h-4 w-4 text-violet-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.providers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Configured OAuth services
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 border-white/20 bg-white/50 backdrop-blur-sm group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stored Tokens</CardTitle>
            <Key className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.tokens}</div>
            <p className="text-xs text-muted-foreground mt-1">
               Active sessions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-white/20 bg-white/50 backdrop-blur-sm group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
            <Plug className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.webhooks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Endpoints ready
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-white/20 bg-white/40">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
                Real-time status of backend services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border border-white/20">
                <div className="p-3 bg-green-500/10 rounded-full ring-1 ring-green-500/20">
                    <Activity className="h-5 w-5 text-green-600" />
                </div>
                <div>
                    <div className="font-semibold text-foreground">Backend API</div>
                    <div className="text-sm text-green-600 flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Operational 
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-white/20 bg-white/40">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
             <a href="/providers" className="flex items-center justify-between p-4 rounded-xl border border-white/20 bg-white/60 hover:bg-white/80 hover:scale-[1.02] transition-all group shadow-sm">
                 <span className="text-sm font-medium">Configure new Provider</span>
                 <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
             </a>
             <a href="/webhooks" className="flex items-center justify-between p-4 rounded-xl border border-white/20 bg-white/60 hover:bg-white/80 hover:scale-[1.02] transition-all group shadow-sm">
                 <span className="text-sm font-medium">Create Test Webhook</span>
                 <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
             </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
