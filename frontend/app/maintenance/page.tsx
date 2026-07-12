'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TablePagination } from '@/components/table-pagination';
import { Plus, Wrench, AlertCircle, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/components/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { useDashboard } from '@/components/dashboard-context';

export default function MaintenancePage() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'driver';

  const [records, setRecords] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    description: '',
    cost: 0,
    start_date: new Date().toISOString().split('T')[0],
    status: 'Pending'
  });
  const [submitting, setSubmitting] = useState(false);
  const { refreshDashboard } = useDashboard();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, statsRes] = await Promise.all([
        api.get('/maintenance/?limit=100'),
        api.get('/maintenance/stats')
      ]);
      setRecords(listRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch maintenance', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const res = await api.get('/vehicles/?limit=100');
      setAvailableVehicles(res.data.data);
    } catch (e) {
      console.error('Failed to fetch vehicles', e);
    }
  };

  useEffect(() => {
    if (openDialog) fetchDropdownData();
  }, [openDialog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        id: crypto.randomUUID(),
        ...formData
      };
      await api.post('/maintenance/', payload);
      toast.success('Maintenance scheduled successfully');
      setOpenDialog(false);
      fetchData();
      refreshDashboard();
      setFormData({
        vehicle_id: '',
        description: '',
        cost: 0,
        start_date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });
    } catch (error: any) {
      let errorMsg = error.message;
      if (error.response?.data?.detail) {
        errorMsg = typeof error.response.data.detail === 'string' 
          ? error.response.data.detail 
          : JSON.stringify(error.response.data.detail);
      }
      toast.error('Failed to add maintenance: ' + errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = (r.vehicle_id?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (r.description?.toLowerCase() || '').includes(search.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        const backendStatus = r.status?.toLowerCase().replace(' ', '_');
        matchesStatus = backendStatus === statusFilter;
      }
      return matchesSearch && matchesStatus;
    });
  }, [records, search, statusFilter]);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const totalCost = records.reduce((sum, r) => sum + Number(r.cost || 0), 0);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="size-4 text-emerald-600" />;
      case 'pending':
        return <AlertCircle className="size-4 text-amber-600" />;
      case 'in progress':
        return <Wrench className="size-4 text-blue-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <ProtectedRoute requiredRoles={['admin', 'manager', 'driver', 'viewer']}>
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
            <p className="text-sm text-muted-foreground mt-1">Schedule and track vehicle maintenance</p>
          </div>
          {canEdit && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger className={buttonVariants({ variant: 'default' })}>
                <Plus className="size-4 mr-2" />
                Schedule Maintenance
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Maintenance</DialogTitle>
                <DialogDescription>Schedule new maintenance for a vehicle</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle</label>
                    <Select value={formData.vehicle_id} onValueChange={(v) => setFormData({...formData, vehicle_id: v as string})} required>
                      <SelectTrigger><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.registration} ({v.name})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="Oil change and tire rotation" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Cost</label>
                    <Input type="number" min="0" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scheduled Date</label>
                    <Input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? 'Scheduling...' : 'Schedule Maintenance'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-2 text-amber-600">{stats?.pending || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold mt-2 text-blue-600">{stats?.inProgress || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-2 text-emerald-600">{stats?.completed || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold mt-2">₹{totalCost.toFixed(1)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Records Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Maintenance Records</CardTitle>
                <CardDescription>All vehicle maintenance history</CardDescription>
              </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Search by vehicle ID or description..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as string); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Cost (₹)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{record.vehicle_id}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge
                            variant={
                              record.status === 'Completed'
                                ? 'default'
                                : record.status === 'Pending'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.start_date ? new Date(record.start_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.end_date ? new Date(record.end_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="font-semibold">₹{record.cost || 0}</TableCell>
                      <TableCell>
                        {canEdit && (
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="size-4" />
                              </Button>
                            }
                            title="Delete Record"
                            description="Are you sure you want to delete this maintenance record?"
                            onConfirm={async () => {
                              try {
                                await api.delete(`/maintenance/${record.id}`);
                                toast.success('Record deleted');
                                fetchData();
                                refreshDashboard();
                              } catch (e: any) {
                                toast.error('Failed to delete: ' + (e.response?.data?.detail || e.message));
                              }
                            }}
                            confirmText="Delete"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No maintenance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredRecords.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
    </ProtectedRoute>
  );
}
