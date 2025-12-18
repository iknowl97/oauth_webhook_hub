import { useEffect, useState } from 'react';
import { getTokens, deleteToken, refreshToken, revealToken, revokeToken } from '../lib/api';
import { Trash2, Copy, AlertCircle, RefreshCw, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function Tokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState({}); // { id: 'accesstoken...' }
  const [refreshing, setRefreshing] = useState(null);

  const load = async () => {
      setLoading(true);
      try {
        setTokens(await getTokens());
      } catch (e) { console.error(e); }
      setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleRefresh = async (id) => {
      setRefreshing(id);
      try {
          await refreshToken(id);
          await load();
          alert('Token refreshed successfully!');
      } catch (e) {
          alert('Refresh failed: ' + (e.response?.data?.error || e.message));
      }
      setRefreshing(null);
  };

  const handleReveal = async (id) => {
      if (revealed[id]) {
          const newR = { ...revealed };
          delete newR[id];
          setRevealed(newR);
          return;
      }
      try {
          const data = await revealToken(id);
          setRevealed({ ...revealed, [id]: data.access_token });
      } catch (e) {
          alert('Failed to reveal token');
      }
  };

  const handleRevoke = async (id) => {
      if (confirm('Are you sure you want to REVOKE this token? This will delete it locally and prevent further access.')) {
          try {
            await revokeToken(id); // Same as delete for MVP
            load();
          } catch (e) { alert('Revoke failed'); }
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Token Vault</h2>
           <p className="text-muted-foreground mt-1">Secure storage for OAuth access and refresh tokens.</p>
        </div>
        <Button variant="outline" size="icon" onClick={load}><RefreshCw className={loading ? "animate-spin" : ""} size={16}/></Button>
      </div>

      <Card>
        <CardContent className="p-0">
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires In</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tokens.map(t => (
                    <TableRow key={t.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                {t.provider_name}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{t.label || 'Default'}</span>
                                {revealed[t.id] && (
                                    <code className="text-xs bg-muted p-1 rounded mt-1 break-all max-w-[200px]">
                                        {revealed[t.id].substring(0, 20)}...
                                    </code>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>{format(new Date(t.created_at), 'MMM d, HH:mm')}</TableCell>
                        <TableCell>
                            {t.expires_at ? (
                                <Badge variant="outline" className={new Date(t.expires_at) < new Date() ? "text-red-500 border-red-500/20 bg-red-500/10" : "text-green-500 border-green-500/20 bg-green-500/10"}>
                                    {new Date(t.expires_at) < new Date() ? 'Expired' : formatDistanceToNow(new Date(t.expires_at))}
                                </Badge>
                            ) : <Badge variant="secondary">Never</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="icon" onClick={() => handleReveal(t.id)} title="Reveal Token">
                                    {revealed[t.id] ? <EyeOff size={16}/> : <Eye size={16}/>}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleRefresh(t.id)} disabled={refreshing === t.id} title="Refresh Token">
                                    <RefreshCw size={16} className={refreshing === t.id ? "animate-spin" : ""}/>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleRevoke(t.id)} title="Revoke Token">
                                    <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
                {tokens.length === 0 && !loading && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No tokens found. Authenticate with a provider to get started.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
