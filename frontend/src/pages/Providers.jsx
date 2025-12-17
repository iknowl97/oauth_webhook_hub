import { useEffect, useState } from 'react';
import { getProviders, createProvider, deleteProvider } from '../lib/api';
import { Plus, Trash2, Key, Globe, Shield, Lock } from 'lucide-react';
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
    name: '', type: 'oauth2', client_id: '', client_secret: '',
    auth_url: '', token_url: '', scopes: ''
  });

  const load = async () => setProviders(await getProviders());
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProvider({
        ...formData,
        scopes: formData.scopes.split(',').map(s => s.trim()).filter(Boolean)
      });
      setIsModalOpen(false);
      setFormData({ name: '', type: 'oauth2', client_id: '', client_secret: '', auth_url: '', token_url: '', scopes: '' });
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
    const url = `${import.meta.env.VITE_API_BASE}/oauth/start/${providerId}?redirect_back=${window.location.origin}/tokens`;
    window.open(url, 'oauth_window', 'width=600,height=700');
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
                        {p.type === 'oidc' ? <Globe size={20} /> : <Shield size={20} />}
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
                 <Button onClick={() => startAuth(p.id)} className="w-full" variant="secondary">
                     <Key className="mr-2 h-3 w-3" />
                     Start Auth Flow
                 </Button>
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
            <div className="space-y-2">
                <label className="text-sm font-medium">Provider Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. GitHub" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium">Type</label>
                   <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                       <option value="oauth2">OAuth 2.0</option>
                       <option value="oidc">OIDC</option>
                   </select>
                </div>
                <div className="space-y-2">
                     <label className="text-sm font-medium">Scopes</label>
                     <Input value={formData.scopes} onChange={e => setFormData({...formData, scopes: e.target.value})} placeholder="profile, email" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Client ID</label>
                <Input required value={formData.client_id} onChange={e => setFormData({...formData, client_id: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Client Secret</label>
                <Input type="password" value={formData.client_secret} onChange={e => setFormData({...formData, client_secret: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Auth URL</label>
                <Input required type="url" value={formData.auth_url} onChange={e => setFormData({...formData, auth_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Token URL</label>
                <Input required type="url" value={formData.token_url} onChange={e => setFormData({...formData, token_url: e.target.value})} placeholder="https://..." />
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
