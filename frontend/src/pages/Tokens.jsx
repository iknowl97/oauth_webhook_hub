import { useEffect, useState } from 'react';
import { getTokens, deleteToken } from '../lib/api';
import { Trash2, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

export default function Tokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
      setLoading(true);
      setTokens(await getTokens());
      setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
      if (confirm('Revoke this token?')) {
          await deleteToken(id);
          load();
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
                    <TableHead>Expires</TableHead>
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
                        <TableCell className="text-muted-foreground">{t.label || '-'}</TableCell>
                        <TableCell>{format(new Date(t.created_at), 'MMM d, HH:mm')}</TableCell>
                        <TableCell>
                            {t.expires_at ? (
                                <Badge variant="outline" className={new Date(t.expires_at) < new Date() ? "text-red-500 border-red-500/20 bg-red-500/10" : "text-green-500 border-green-500/20 bg-green-500/10"}>
                                    {format(new Date(t.expires_at), 'MMM d, HH:mm')}
                                </Badge>
                            ) : <Badge variant="secondary">Never</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                                <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                            </Button>
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
