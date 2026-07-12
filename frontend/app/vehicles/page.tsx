'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/status-badge';
import { TablePagination } from '@/components/table-pagination';
import { Plus, Wrench, Fuel, Calendar, Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useDashboard } from '@/components/dashboard-context';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    registration: '',
    name: '',
    type: 'Truck',
    max_capacity_kg: 1000,
    odometer_km: 0,
    acquisition_cost: 0,
    region: 'North',
    status: 'Available'
  });
  const [submitting, setSubmitting] = useState(false);
  
  const { refreshDashboard } = useDashboard();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const [listRes, statsRes] = await Promise.all([
        api.get('/vehicles/?limit=100'),
        api.get('/vehicles/stats')
      ]);
      setVehicles(listRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        id: crypto.randomUUID(),
        ...formData
      };
      await api.post('/vehicles/', payload);
      toast.success('Vehicle added successfully');
      setOpenDialog(false);
      fetchVehicles();
      refreshDashboard();
      setFormData({
        registration: '',
        name: '',
        type: 'Truck',
        max_capacity_kg: 1000,
        odometer_km: 0,
        acquisition_cost: 0,
        region: 'North',
        status: 'Available'
      });
    } catch (error: any) {
      let errorMsg = error.message;
      if (error.response?.data?.detail) {
        errorMsg = typeof error.response.data.detail === 'string' 
          ? error.response.data.detail 
          : JSON.stringify(error.response.data.detail);
      }
      toast.error('Failed to add vehicle: ' + errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = (v.registration?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (v.name?.toLowerCase() || '').includes(search.toLowerCase());
      
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        const backendStatus = v.status?.toLowerCase().replace(' ', '_');
        matchesStatus = backendStatus === statusFilter;
      }
      return matchesSearch && matchesStatus;
    });
  }, [vehicles, search, statusFilter]);

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vehicles</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage and monitor your fleet vehicles</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger render={<Button />}>
              <Plus className="size-4 mr-2" />
              Add Vehicle
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>Register a new vehicle to your fleet</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration</label>
                    <Input placeholder="MH-01-AB-1234" value={formData.registration} onChange={e => setFormData({...formData, registration: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model/Name</label>
                    <Input placeholder="Tata Signa" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Truck">Truck</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                        <SelectItem value="Pickup">Pickup</SelectItem>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Region</label>
                    <Select value={formData.region} onValueChange={v => setFormData({...formData, region: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North">North</SelectItem>
                        <SelectItem value="South">South</SelectItem>
                        <SelectItem value="East">East</SelectItem>
                        <SelectItem value="West">West</SelectItem>
                        <SelectItem value="Central">Central</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Capacity (kg)</label>
                    <Input type="number" min="1" value={formData.max_capacity_kg} onChange={e => setFormData({...formData, max_capacity_kg: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Odometer (km)</label>
                    <Input type="number" min="0" value={formData.odometer_km} onChange={e => setFormData({...formData, odometer_km: Number(e.target.value)})} required />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Acquisition Cost</label>
                    <Input type="number" min="1" value={formData.acquisition_cost} onChange={e => setFormData({...formData, acquisition_cost: Number(e.target.value)})} required />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Vehicle'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
              <p className="text-2xl font-bold mt-2">{stats?.total || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-2xl font-bold mt-2">{stats?.available || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">On Trip</p>
              <p className="text-2xl font-bold mt-2">{stats?.onTrip || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In Shop</p>
              <p className="text-2xl font-bold mt-2">{stats?.inShop || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>All Vehicles</CardTitle>
                <CardDescription>Complete vehicle inventory</CardDescription>
              </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Search by registration or name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="on_trip">On Trip</SelectItem>
                  <SelectItem value="in_shop">In Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Registration</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Odometer (km)</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{vehicle.registration}</TableCell>
                      <TableCell className="text-sm">{vehicle.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={vehicle.status?.toLowerCase().replace(' ', '_')} />
                      </TableCell>
                      <TableCell>{vehicle.odometer_km}</TableCell>
                      <TableCell>{vehicle.type}</TableCell>
                      <TableCell>{vehicle.region}</TableCell>
                      <TableCell>
                        <ConfirmDialog
                          trigger={
                            <Button variant="ghost" size="sm" onClick={() => setSelectedVehicle(vehicle)}>
                              <Wrench className="size-4" />
                            </Button>
                          }
                          title="Schedule Maintenance"
                          description={`Schedule maintenance for ${vehicle.registration}?`}
                          onConfirm={() => { }}
                          confirmText="Schedule"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedVehicles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No vehicles found.
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
                  totalItems={filteredVehicles.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
