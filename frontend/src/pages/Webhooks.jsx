import { useEffect, useState, useRef } from 'react';
import { getWebhooks, createWebhook, deleteWebhook, getWebhookRequests } from '../lib/api';
import { Plus, Trash2, Copy, ExternalLink, Box, Activity, ChevronRight } from 'lucide-react';
import Modal from '../components/Modal';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function Webhooks() {
  const [hooks, setHooks] = useState([]);
  const [selectedHook, setSelectedHook] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ description: '', forward_url: '', response_status: '200', response_body: '{"status":"ok"}' });

  const loadHooks = async () => {
    const data = await getWebhooks();
    setHooks(data);
    if (!selectedHook && data.length > 0) setSelectedHook(data[0]);
  };
  
  const loadRequests = async (id) => {
      setRequests(await getWebhookRequests(id));
  };

  useEffect(() => { loadHooks(); }, []);
  
  useEffect(() => {
      if (selectedHook) {
          loadRequests(selectedHook.id);
          const interval = setInterval(() => loadRequests(selectedHook.id), 3000); 
          return () => clearInterval(interval);
      }
  }, [selectedHook]);

  const handleCreate = async (e) => {
      e.preventDefault();
      try {
          await createWebhook({ ...formData, response_status: parseInt(formData.response_status) });
          setIsModalOpen(false);
          loadHooks();
          setFormData({ description: '', forward_url: '', response_status: '200', response_body: '{"status":"ok"}' });
      } catch (err) { alert('Error creating webhook'); }
  };

  const handleDelete = async (e, id) => {
      e.stopPropagation();
      if (confirm('Delete webhook?')) {
          await deleteWebhook(id);
          if (selectedHook?.id === id) setSelectedHook(null);
          loadHooks();
      }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar List */}
      <div className="w-80 flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Webhooks</h2>
            <Button size="icon" variants="outline" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} />
            </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {hooks.map(h => (
                <div 
                    key={h.id} 
                    onClick={() => setSelectedHook(h)}
                    className={clsx(
                        "p-4 rounded-lg cursor-pointer border transition-all hover:bg-muted group relative",
                        selectedHook?.id === h.id 
                            ? "bg-card border-primary shadow-sm ring-1 ring-primary" 
                            : "bg-card border-border"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-[10px] font-mono">{h.method || 'ALL'}</Badge>
                        <button onClick={(e) => handleDelete(e, h.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                             <Trash2 size={14} />
                        </button>
                    </div>
                    <div className="font-medium text-sm truncate">{h.description || 'Untitled Webhook'}</div>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">{h.path}</span>
                         {selectedHook?.id === h.id && <ChevronRight size={14} className="text-primary" />}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col">
         {!selectedHook ? (
             <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                 <Box size={48} className="mb-4 opacity-20" />
                 <p>Select a webhook to view live requests</p>
             </div>
         ) : (
             <div className="flex flex-col h-full">
                 {/* Detail Header */}
                 <div className="p-6 border-b bg-muted/20">
                     <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                 <Activity size={20} />
                             </div>
                             <div>
                                <h2 className="text-lg font-bold">{selectedHook.description}</h2>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Listening for requests
                                </div>
                             </div>
                         </div>
                     </div>

                     <div className="flex items-center gap-2">
                         <div className="flex-1 relative bg-background border px-3 py-2 rounded-md font-mono text-sm text-muted-foreground truncate">
                             {baseUrl}{selectedHook.path}
                         </div>
                         <Button variant="outline" size="icon" onClick={() => copyToClipboard(baseUrl + selectedHook.path)}>
                            <Copy size={16} />
                         </Button>
                         <Button variant="outline" size="icon" asChild>
                             <a href={baseUrl + selectedHook.path} target="_blank" rel="noreferrer">
                                <ExternalLink size={16} />
                             </a>
                         </Button>
                     </div>
                 </div>

                 {/* Requests Log */}
                 <div className="flex-1 overflow-y-auto bg-muted/10 p-4 space-y-3">
                    {requests.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm">
                            Waiting for incoming requests...
                        </div>
                    )}
                    {requests.map(r => (
                        <Card key={r.id} className="overflow-hidden border-l-4 border-l-primary/50">
                            <div className="p-3 flex items-center justify-between border-b bg-muted/20 text-xs">
                                <div className="flex items-center gap-2">
                                    <Badge variant={(r.method === 'POST') ? 'default' : 'secondary'}>{r.method}</Badge>
                                    <span className="font-mono text-muted-foreground">{format(new Date(r.created_at), 'HH:mm:ss')}</span>
                                </div>
                                <div className="font-mono text-muted-foreground">{r.remote_ip}</div>
                            </div>
                            <div className="p-3 font-mono text-xs overflow-x-auto">
                                <pre className="text-foreground">{r.body_text || <span className="text-muted-foreground italic">empty body</span>}</pre>
                            </div>
                        </Card>
                    ))}
                 </div>
             </div>
         )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Webhook">
          <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Stripe Payment Hook" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Status</label>
                    <Input type="number" value={formData.response_status} onChange={e => setFormData({...formData, response_status: e.target.value})} />
                  </div>
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Forward URL</label>
                    <Input type="url" value={formData.forward_url} onChange={e => setFormData({...formData, forward_url: e.target.value})} placeholder="https://..." />
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Response Body (JSON)</label>
                  <textarea className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm min-h-[100px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={formData.response_body} onChange={e => setFormData({...formData, response_body: e.target.value})} />
              </div>
              <Button type="submit" className="w-full">
                  Generate Endpoint
              </Button>
          </form>
      </Modal>
    </div>
  );
}
