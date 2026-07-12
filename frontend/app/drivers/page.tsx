'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TablePagination } from '@/components/table-pagination';
import { Plus, Star, Award, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useDashboard } from '@/components/dashboard-context';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [licenseFilter, setLicenseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    license_category: 'Class A',
    license_expiry: '',
    contact: '',
    safety_score: 100,
    status: 'Available'
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
        api.get('/drivers/?limit=100'),
        api.get('/drivers/stats')
      ]);
      setDrivers(listRes.data.data);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
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
      await api.post('/drivers/', payload);
      toast.success('Driver added successfully');
      setOpenDialog(false);
      fetchData();
      refreshDashboard();
      setFormData({
        name: '',
        license_number: '',
        license_category: 'Class A',
        license_expiry: '',
        contact: '',
        safety_score: 100,
        status: 'Available'
      });
    } catch (error: any) {
      let errorMsg = error.message;
      if (error.response?.data?.detail) {
        errorMsg = typeof error.response.data.detail === 'string' 
          ? error.response.data.detail 
          : JSON.stringify(error.response.data.detail);
      }
      toast.error('Failed to add driver: ' + errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const matchesSearch = (d.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (d.license_number?.toLowerCase() || '').includes(search.toLowerCase());
      
      let matchesLicense = true;
      if (licenseFilter !== 'all') {
        const backendLicense = d.license_category?.toLowerCase().replace(' ', '_');
        matchesLicense = backendLicense === licenseFilter;
      }
      return matchesSearch && matchesLicense;
    });
  }, [drivers, search, licenseFilter]);

  const paginatedDrivers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDrivers.slice(start, start + itemsPerPage);
  }, [filteredDrivers, currentPage]);

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-emerald-600 dark:text-emerald-400';
    if (rating >= 4) return 'text-blue-600 dark:text-blue-400';
    if (rating >= 3.5) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

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
            <h1 className="text-3xl font-bold text-foreground">Drivers</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage driver information and performance</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger render={<Button />}>
              <Plus className="size-4 mr-2" />
              Add Driver
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Register a new driver to your fleet</DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">License Number</label>
                    <Input placeholder="MH01-2023-1234567" value={formData.license_number} onChange={e => setFormData({...formData, license_number: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">License Category</label>
                    <Select value={formData.license_category} onValueChange={v => setFormData({...formData, license_category: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Class A">Class A</SelectItem>
                        <SelectItem value="Class B">Class B</SelectItem>
                        <SelectItem value="Class C">Class C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">License Expiry</label>
                    <Input type="date" value={formData.license_expiry} onChange={e => setFormData({...formData, license_expiry: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Number</label>
                    <Input type="tel" placeholder="+91 9876543210" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} required />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Driver'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Drivers</p>
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
              <p className="text-sm text-muted-foreground">Avg. Safety Score</p>
              <p className="text-2xl font-bold mt-2">
                {drivers.length > 0 ? (drivers.reduce((sum, d) => sum + (d.safety_score || 0), 0) / drivers.length / 20).toFixed(1) : '-'}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">On Trip</p>
              <p className="text-2xl font-bold mt-2">{stats?.onTrip || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>All Drivers</CardTitle>
                <CardDescription>Fleet driver roster and performance</CardDescription>
              </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Search by name or license..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
              <Select value={licenseFilter} onValueChange={(v) => { setLicenseFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="class_a">Class A</SelectItem>
                  <SelectItem value="class_b">Class B</SelectItem>
                  <SelectItem value="class_c">Class C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Safety Score</TableHead>
                    <TableHead>Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDrivers.map((driver) => (
                    <TableRow key={driver.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{driver.name}</TableCell>
                      <TableCell className="text-sm">{driver.license_number}</TableCell>
                      <TableCell className="text-sm">{driver.license_category}</TableCell>
                      <TableCell className="text-sm">{driver.contact}</TableCell>
                      <TableCell>
                        <Badge variant={driver.status === 'Available' || driver.status === 'On Trip' ? 'default' : 'secondary'}>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span className={`font-semibold ${getRatingColor((driver.safety_score || 0) / 20)}`}>
                            {((driver.safety_score || 0) / 20).toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {driver.license_expiry ? new Date(driver.license_expiry).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedDrivers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No drivers found.
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
                  totalItems={filteredDrivers.length}
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
