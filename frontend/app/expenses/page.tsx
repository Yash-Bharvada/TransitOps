'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TablePagination } from '@/components/table-pagination';
import { Plus, TrendingUp, DollarSign, Fuel, Loader2, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/components/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { useDashboard } from '@/components/dashboard-context';

export default function ExpensesPage() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'driver';

  const [combinedExpenses, setCombinedExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  
  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    type: 'Fuel',
    amount: 0,
    liters: 0,
    odometer_km: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
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
      const [expRes, fuelRes] = await Promise.all([
        api.get('/expenses/?limit=100'),
        api.get('/fuel-logs/?limit=100')
      ]);
      
      const normalizedExpenses = expRes.data.data.map((e: any) => ({
        id: `exp-${e.id}`,
        dbId: e.id,
        vehicle_id: e.associated_with,
        type: e.type,
        amount: e.amount,
        date: e.date,
        liters: 0
      }));

      const normalizedFuel = fuelRes.data.data.map((f: any) => ({
        id: `fuel-${f.id}`,
        dbId: f.id,
        vehicle_id: f.vehicle_id,
        type: 'Fuel',
        amount: f.cost,
        date: f.date,
        liters: f.liters
      }));

      const all = [...normalizedExpenses, ...normalizedFuel];
      all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setCombinedExpenses(all);
    } catch (error) {
      console.error('Failed to fetch expenses/fuel data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExpenses = useMemo(() => {
    return combinedExpenses.filter(e => {
      const matchesSearch = (e.vehicle_id?.toLowerCase() || '').includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || e.type?.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [combinedExpenses, search, typeFilter]);

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

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
      const uuid = crypto.randomUUID();
      
      if (formData.type === 'Fuel') {
        const payload = {
          id: uuid,
          vehicle_id: formData.vehicle_id,
          date: formData.date,
          liters: formData.liters,
          cost: formData.amount,
          odometer_km: formData.odometer_km
        };
        await api.post('/fuel-logs/', payload);
      } else {
        const payload = {
          id: uuid,
          description: formData.description || 'Expense',
          type: formData.type,
          amount: formData.amount,
          date: formData.date,
          associated_with: formData.vehicle_id
        };
        await api.post('/expenses/', payload);
      }
      
      toast.success('Record logged successfully');
      setOpenDialog(false);
      fetchData();
      refreshDashboard();
      setFormData({
        vehicle_id: '',
        type: 'Fuel',
        amount: 0,
        liters: 0,
        odometer_km: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error: any) {
      let errorMsg = error.message;
      if (error.response?.data?.detail) {
        errorMsg = typeof error.response.data.detail === 'string' 
          ? error.response.data.detail 
          : JSON.stringify(error.response.data.detail);
      }
      toast.error('Failed to log record: ' + errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const totalExpenses = combinedExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const fuelExpenses = combinedExpenses.filter(e => e.type === 'Fuel').reduce((sum, e) => sum + Number(e.amount), 0);
  const tollExpenses = combinedExpenses.filter(e => e.type === 'Toll').reduce((sum, e) => sum + Number(e.amount), 0);
  const totalLiters = combinedExpenses.filter(e => e.type === 'Fuel').reduce((sum, e) => sum + Number(e.liters), 0);

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
            <h1 className="text-3xl font-bold text-foreground">Fuel & Expenses</h1>
            <p className="text-sm text-muted-foreground mt-1">Track fuel consumption and operational costs</p>
          </div>
          {canEdit && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger className={buttonVariants({ variant: 'default' })}>
                <Plus className="size-4 mr-2" />
                Log Expense
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Expense</DialogTitle>
                <DialogDescription>Record a new fuel or expense entry</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Record Type</label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as string })} required>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fuel">Fuel</SelectItem>
                        <SelectItem value="Toll">Toll</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Salary">Salary</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Vehicle ID</label>
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
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <Input type="number" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  {formData.type === 'Fuel' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Liters</label>
                        <Input type="number" min="0" value={formData.liters} onChange={(e) => setFormData({ ...formData, liters: Number(e.target.value) })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Odometer (km)</label>
                        <Input type="number" min="0" value={formData.odometer_km} onChange={(e) => setFormData({ ...formData, odometer_km: Number(e.target.value) })} required />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Input placeholder="Enter brief description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                  )}
                </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={submitting}>{submitting ? 'Logging...' : 'Log Record'}</Button>
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
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold mt-2">₹{(totalExpenses / 1000).toFixed(1)}k</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Fuel Cost</p>
              <p className="text-2xl font-bold mt-2">₹{(fuelExpenses / 1000).toFixed(1)}k</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Tolls</p>
              <p className="text-2xl font-bold mt-2">₹{(tollExpenses / 1000).toFixed(1)}k</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Fuel</p>
              <p className="text-2xl font-bold mt-2">{totalLiters.toFixed(1)} L</p>
            </CardContent>
          </Card>
        </div>

        {/* Expenses Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Expense Records</CardTitle>
                <CardDescription>All fuel and operational expenses</CardDescription>
              </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Search by vehicle ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as string); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Toll">Toll</SelectItem>
                  <SelectItem value="Parking">Parking</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Vehicle/Trip</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount (₹)</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Liters</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{expense.vehicle_id || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={expense.type === 'Fuel' ? 'default' : 'secondary'}>
                          {expense.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">₹{expense.amount || 0}</TableCell>
                      <TableCell className="text-sm">
                         {expense.date ? new Date(expense.date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {expense.liters > 0 ? (
                          <div className="flex items-center gap-1">
                            <Fuel className="size-3.5 text-amber-600" />
                            <span>{expense.liters} L</span>
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {canEdit && (
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="size-4" />
                              </Button>
                            }
                            title="Delete Expense"
                            description="Are you sure you want to delete this expense record?"
                            onConfirm={async () => {
                              try {
                                const endpoint = expense.id.startsWith('fuel-') ? `/fuel-logs/${expense.dbId}` : `/expenses/${expense.dbId}`;
                                await api.delete(endpoint);
                                toast.success('Expense deleted');
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
                  {paginatedExpenses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No expenses found.
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
                  totalItems={filteredExpenses.length}
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
