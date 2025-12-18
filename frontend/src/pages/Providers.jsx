import { useEffect, useState } from 'react';
import api, { getProviders, createProvider, deleteProvider } from '../lib/api';
import { Plus, Trash2, Key, Link2, Shield, Eye } from "lucide-react";
import { ProviderPresetsGrid } from "../components/ProviderPresetsGrid";
import Modal from '../components/Modal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';


export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', authorization_url: '', token_url: '', client_id: '', client_secret: '',
    scope: ''
  });

  const load = async () => setProviders(await getProviders());
  useEffect(() => { load(); }, []);

  const handlePresetSelect = (preset) => {
    setFormData({
      ...formData,
      name: preset.name,
      authorization_url: preset.authUrl,
      token_url: preset.tokenUrl,
      scope: preset.scope
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProvider({
        ...formData,
        scopes: formData.scope.split(',').map(s => s.trim()).filter(Boolean),
        auth_url: formData.authorization_url,
        token_url: formData.token_url,
        type: 'oauth2'
      });
      setIsModalOpen(false);
      setFormData({ name: '', authorization_url: '', token_url: '', client_id: '', client_secret: '', scope: '' });
      load();
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this provider?')) {
      await deleteProvider(id);
      load();
    }
  };

  const startAuth = (providerId) => {
    const base = import.meta.env.VITE_API_BASE || '';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const url = `${cleanBase}/api/oauth/start/${providerId}?redirect_back=${encodeURIComponent(window.location.origin + '/tokens')}`;
    window.open(url, 'oauth_window', 'width=600,height=700');
  };

  const previewAuth = async (providerId) => {
      try {
        const res = await api.get(`/api/oauth/start/${providerId}?preview=true`);
        prompt("Dry Run URL (Copy to inspect):", res.data.url);
      } catch (e) {
          alert("Failed to generate preview");
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Providers</h2>
           <p className="text-muted-foreground mt-1">Manage external OAuth 2.0 / OIDC configurations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Provider
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {providers.map(p => (
          <Card key={p.id} className="group relative overflow-hidden transition-all hover:border-primary/50">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg ring-1 ring-primary/20">
                        {p.type === 'oidc' ? <Link2 size={20} /> : <Shield size={20} />}
                    </div>
                    <div>
                        <CardTitle className="text-lg">{p.name}</CardTitle>
                        <CardDescription className="uppercase text-[10px] font-bold tracking-widest">{p.type}</CardDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                </Button>
             </CardHeader>
             
             <CardContent className="space-y-4 pt-4">
                 <div className="space-y-1">
                     <div className="text-xs font-medium text-muted-foreground uppercase">Client ID</div>
                     <code className="text-xs bg-muted px-2 py-1 rounded block truncate font-mono select-all">
                        {p.client_id}
                     </code>
                 </div>
                 <div className="space-y-1">
                     <div className="text-xs font-medium text-muted-foreground uppercase">Scopes</div>
                     <div className="flex flex-wrap gap-1">
                        {p.scopes && p.scopes.length > 0 ? p.scopes.map(s => (
                            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        )) : <span className="text-xs text-muted-foreground italic">None</span>}
                     </div>
                 </div>
             </CardContent>

             <CardFooter>
                  <div className="flex gap-2">
                     <Button onClick={() => previewAuth(p.id)} className="flex-1" variant="outline" title="Preview Auth URL">
                          <Eye className="w-4 h-4 mr-2"/> Dry Run
                      </Button>
                      <Button onClick={() => startAuth(p.id)} className="flex-[2]" variant="secondary">
                          <Key className="mr-2 h-3 w-3" />
                          Start Auth Flow
                      </Button>
                  </div>
             </CardFooter>
          </Card>
        ))}
        {providers.length === 0 && (
            <div className="col-span-full py-12 text-center rounded-xl border border-dashed text-muted-foreground bg-muted/20">
                No providers configured. Click "Add Provider" to get started.
            </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Configure Provider">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="text-lg font-semibold leading-none tracking-tight">Add New Provider</h3>
              <p className="text-sm text-muted-foreground">
                Configure a new OAuth provider or choose a preset.
              </p>
            </div>
            
            <ProviderPresetsGrid onSelect={handlePresetSelect} />

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Provider Name</label>
                <Input 
                  id="name" 
                  placeholder="e.g. Google" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="authorization_url" className="text-sm font-medium leading-none">Authorization URL</label>
                <Input 
                    id="authorization_url" 
                    type="url"
                    placeholder="https://accounts.google.com/o/oauth2/v2/auth" 
                    value={formData.authorization_url}
                    onChange={(e) => setFormData({...formData, authorization_url: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="token_url" className="text-sm font-medium leading-none">Token URL</label>
                <Input 
                    id="token_url" 
                    type="url"
                    placeholder="https://oauth2.googleapis.com/token" 
                    value={formData.token_url}
                    onChange={(e) => setFormData({...formData, token_url: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="client_id" className="text-sm font-medium leading-none">Client ID</label>
                <Input 
                    id="client_id" 
                    value={formData.client_id}
                    onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="client_secret" className="text-sm font-medium leading-none">Client Secret</label>
                <Input 
                    id="client_secret" 
                    type="password"
                    value={formData.client_secret}
                    onChange={(e) => setFormData({...formData, client_secret: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="scope" className="text-sm font-medium leading-none">Default Scopes (Comma separated)</label>
                <Input 
                    id="scope" 
                    placeholder="profile,email" 
                    value={formData.scope}
                    onChange={(e) => setFormData({...formData, scope: e.target.value})}
                />
              </div>
            </div>
            
            <div className="bg-muted/50 p-3 rounded-lg border border-dashed border-primary/20 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase text-primary/80">Redirect URI (One-Click Copy)</label>
                    <Badge variant="outline" className="text-[10px] h-5">Required</Badge>
                </div>
                <div 
                    className="text-xs font-mono bg-background p-2 rounded border truncate cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors select-all"
                    onClick={(e) => {
                        navigator.clipboard.writeText(e.target.innerText);
                        // Optional: Add toast triggers here if available
                        e.target.classList.add('ring-2', 'ring-primary');
                        setTimeout(() => e.target.classList.remove('ring-2', 'ring-primary'), 200);
                    }}
                    title="Click to copy"
                >
                    {window.location.origin}/api/oauth/callback
                </div>
                <p className="text-[10px] text-muted-foreground">
                    Paste this <strong>exact URL</strong> into your {formData.name || 'Provider'} OAuth settings.
                </p>
            </div>

            <div className="pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Provider'}
                </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
}
