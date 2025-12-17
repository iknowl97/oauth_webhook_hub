import { useRef, useEffect, useState } from 'react';
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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's an overview of your authentication hub.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.providers}</div>
            <p className="text-xs text-muted-foreground">
              Configured OAuth services
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stored Tokens</CardTitle>
            <Key className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tokens}</div>
            <p className="text-xs text-muted-foreground">
               Active sessions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
            <Plug className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.webhooks}</div>
            <p className="text-xs text-muted-foreground">
              Endpoints ready
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
                Real-time status of backend services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center gap-4 border rounded-lg p-4">
                <div className="p-2 bg-green-500/20 rounded-full">
                    <Activity className="h-5 w-5 text-green-500" />
                </div>
                <div>
                    <div className="font-semibold">Backend API</div>
                    <div className="text-sm text-green-500 flex items-center gap-1">
                        Operational 
                        <span className="relative flex h-2 w-2 ml-1">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
             <a href="/providers" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors group">
                 <span className="text-sm font-medium">Configure new Provider</span>
                 <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
             </a>
             <a href="/webhooks" className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors group">
                 <span className="text-sm font-medium">Create Test Webhook</span>
                 <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100" />
             </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
