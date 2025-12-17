import { useEffect, useState } from 'react';
import { getSubdomains, createSubdomain, deleteSubdomain, getWebhooks } from '../lib/api';
import { Plus, Trash2, Globe, ArrowRight, Copy } from 'lucide-react';
import Modal from '../components/Modal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export default function Subdomains() {
  const [items, setItems] = useState([]);
  const [hooks, setHooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ subdomain: '', webhook_id: '' });

  const load = async () => {
    setItems(await getSubdomains());
    setHooks(await getWebhooks());
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
        await createSubdomain(formData);
        setIsModalOpen(false);
        load();
        setFormData({ subdomain: '', webhook_id: '' });
    } catch (err) {
        alert('Error creating subdomain: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
      if (confirm('Release this subdomain?')) {
          await deleteSubdomain(id);
          load();
      }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };
  
  const baseDomain = import.meta.env.VITE_BASE_URL ? new URL(import.meta.env.VITE_BASE_URL).hostname : 'oauthhub.work.gd';

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Custom Domains</h2>
                <p className="text-muted-foreground">Map subdomains to specific webhooks for dedicated endpoints.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
                <Plus size={16} className="mr-2" />
                New Binding
            </Button>
        </div>

        <div className="grid gap-4">
            {items.length === 0 && (
                <div className="text-center p-12 border rounded-lg bg-muted/10 text-muted-foreground">
                    No custom domains configured.
                </div>
            )}
            
            {items.map(item => (
                <div key={item.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg bg-card shadow-sm">
                    <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <Globe size={20} />
                        </div>
                        <div className="font-mono font-medium text-lg">
                            {item.subdomain}<span className="text-muted-foreground">.{baseDomain}</span>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex text-muted-foreground">
                        <ArrowRight size={20} />
                    </div>
                    
                    <div className="flex-1 w-full md:w-auto">
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded border text-sm">
                            <span className="text-muted-foreground">Target:</span>
                            <span className="font-medium truncate">{hooks.find(h => h.id === item.webhook_id)?.description || item.webhook_id}</span>
                         </div>
                    </div>

                    <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon" onClick={() => copyToClipboard(`http://${item.subdomain}.${baseDomain}`)}>
                            <Copy size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(item.id)}>
                            <Trash2 size={16} />
                        </Button>
                    </div>
                </div>
            ))}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Bind Subdomain">
            <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Subdomain Prefix</label>
                    <div className="flex items-center gap-2">
                        <Input 
                            value={formData.subdomain} 
                            onChange={e => setFormData({...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                            placeholder="my-hook" 
                            className="flex-1"
                            required
                        />
                        <span className="text-muted-foreground text-sm font-mono">.{baseDomain}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Only lowercase letters, numbers, and dashes.</p>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Target Webhook</label>
                    <select 
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={formData.webhook_id}
                        onChange={e => setFormData({...formData, webhook_id: e.target.value})}
                        required
                    >
                        <option value="">Select a webhook...</option>
                        {hooks.map(h => (
                            <option key={h.id} value={h.id}>
                                {h.description || h.id} ({h.method || 'ALL'})
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="submit" className="w-full">Create Binding</Button>
            </form>
        </Modal>
    </div>
  );
}
