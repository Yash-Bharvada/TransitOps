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
import { PremiumButton } from '@/components/premium-button';
import { premiumToast } from '@/components/premium-toast';
import { Plus, MapPin, Clock, Fuel, Loader2, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAuth } from '@/components/auth-context';
import { ProtectedRoute } from '@/components/protected-route';
import { useDashboard } from '@/components/dashboard-context';

export default function TripsPage() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'driver';

  const [trips, setTrips] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    source: '',
    destination: '',
    cargo_weight_kg: 0,
    distance_km: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'Draft'
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
        api.get('/trips/?limit=100'),
        api.get('/trips/stats')
      ]);
      setTrips(listRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch trips', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [vehRes, drvRes] = await Promise.all([
        api.get('/vehicles/?limit=100'),
        api.get('/drivers/?limit=100')
      ]);
      setAvailableVehicles(vehRes.data.data.filter((v: any) => v.status === 'Available'));
      setAvailableDrivers(drvRes.data.data.filter((d: any) => d.status === 'Available'));
    } catch (e) {
      console.error('Failed to fetch dropdown data', e);
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
      await api.post('/trips/', payload);
      toast.success('Trip added successfully');
      setOpenDialog(false);
      fetchData();
      refreshDashboard();
      setFormData({
        vehicle_id: '',
        driver_id: '',
        source: '',
        destination: '',
        cargo_weight_kg: 0,
        distance_km: 0,
        date: new Date().toISOString().split('T')[0],
        status: 'Draft'
      });
    } catch (error: any) {
      let errorMsg = error.message;
      if (error.response?.data?.detail) {
        errorMsg = typeof error.response.data.detail === 'string' 
          ? error.response.data.detail 
          : JSON.stringify(error.response.data.detail);
      }
      toast.error('Failed to add trip: ' + errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(t => {
      const matchesSearch = (t.vehicle_id?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (t.source?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (t.destination?.toLowerCase() || '').includes(search.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = t.status === statusFilter;
      }
      return matchesSearch && matchesStatus;
    });
  }, [trips, search, statusFilter]);

  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrips.slice(start, start + itemsPerPage);
  }, [filteredTrips, currentPage]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'dispatched':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
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
            <h1 className="text-3xl font-bold text-foreground">Trips</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage dispatch and track active trips</p>
          </div>
          {canEdit && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger className={buttonVariants({ variant: 'default' })}>
                <Plus className="size-4 mr-2" />
                Dispatch Trip
              </DialogTrigger>
              <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogDescription>Schedule a new trip for your fleet</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle</label>
                    <Select value={formData.vehicle_id} onValueChange={(v) => setFormData({...formData, vehicle_id: v as string})}>
                      <SelectTrigger><SelectValue placeholder="Select Vehicle" /></SelectTrigger>
                      <SelectContent>
                        {availableVehicles.map(v => (
                          <SelectItem key={v.id} value={v.id}>{v.registration} ({v.name})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Driver</label>
                    <Select value={formData.driver_id} onValueChange={(v) => setFormData({...formData, driver_id: v as string})}>
                      <SelectTrigger><SelectValue placeholder="Select Driver" /></SelectTrigger>
                      <SelectContent>
                        {availableDrivers.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.name} ({d.license_number})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source</label>
                    <Input placeholder="Mumbai" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination</label>
                    <Input placeholder="Delhi" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cargo Weight (kg)</label>
                    <Input type="number" min="1" value={formData.cargo_weight_kg} onChange={e => setFormData({...formData, cargo_weight_kg: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance (km)</label>
                    <Input type="number" min="1" value={formData.distance_km} onChange={e => setFormData({...formData, distance_km: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? 'Dispatching...' : 'Dispatch'}</Button>
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
              <p className="text-sm text-muted-foreground">Total Trips</p>
              <p className="text-2xl font-bold mt-2">{stats?.total || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-2">{stats?.completed || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Dispatched</p>
              <p className="text-2xl font-bold mt-2">{stats?.dispatched || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-2">{stats?.pending || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Trips Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>All Trips</CardTitle>
                <CardDescription>Complete trip history and tracking</CardDescription>
              </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Search by vehicle ID, origin, or destination..."
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
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Driver ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrips.map((trip) => (
                    <TableRow key={trip.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{trip.vehicle_id}</TableCell>
                      <TableCell>{trip.driver_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="size-3.5" />
                          <span>{trip.source}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{trip.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{trip.distance_km || 0} km</TableCell>
                      <TableCell className="text-sm">
                         {trip.date ? new Date(trip.date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(trip.status)} variant="outline">
                          {trip.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {canEdit && (
                          <ConfirmDialog
                            trigger={
                              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="size-4" />
                              </Button>
                            }
                            title="Delete Trip"
                            description="Are you sure you want to delete this trip?"
                            onConfirm={async () => {
                              try {
                                await api.delete(`/trips/${trip.id}`);
                                toast.success('Trip deleted');
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
                  {paginatedTrips.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No trips found.
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
                  totalItems={filteredTrips.length}
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
