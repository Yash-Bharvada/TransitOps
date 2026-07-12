'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { trips, vehicles, drivers } from '@/lib/data';
import { StatusBadge } from '@/components/status-badge';
import { TablePagination } from '@/components/table-pagination';
import { PremiumButton } from '@/components/premium-button';
import { premiumToast } from '@/components/premium-toast';
import { Plus, MapPin, Clock, Fuel } from 'lucide-react';

export default function TripsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    driver: '',
    origin: '',
    destination: '',
    expectedDistance: '',
  });
  const itemsPerPage = 10;

  const filteredTrips = useMemo(() => {
    return trips.filter(t => {
      const matchesSearch = t.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        t.origin.toLowerCase().includes(search.toLowerCase()) ||
        t.destination.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrips.slice(start, start + itemsPerPage);
  }, [filteredTrips, currentPage]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);

  const handleSubmit = () => {
    if (formData.vehicle && formData.driver && formData.origin && formData.destination) {
      premiumToast.success('Trip Created', `Trip from ${formData.origin} to ${formData.destination} scheduled`);
      setFormData({ vehicle: '', driver: '', origin: '', destination: '', expectedDistance: '' });
      setOpenDialog(false);
    } else {
      premiumToast.warning('Missing Fields', 'Please fill in all required fields');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'scheduled':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Trips</h1>
            <p className="text-sm text-muted-foreground mt-1">Track and manage vehicle trips</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <PremiumButton variant="success" icon={<Plus className="size-4" />}>
                New Trip
              </PremiumButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogDescription>Schedule a new trip for your fleet</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle</label>
                  <Select value={formData.vehicle} onValueChange={(v) => setFormData({ ...formData, vehicle: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v.id} value={v.registration}>
                          {v.registration} - {v.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Driver</label>
                  <Select value={formData.driver} onValueChange={(v) => setFormData({ ...formData, driver: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map(d => (
                        <SelectItem key={d.id} value={d.name}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Origin</label>
                  <Input
                    placeholder="Start location"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Input
                    placeholder="End location"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Distance (km)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.expectedDistance}
                    onChange={(e) => setFormData({ ...formData, expectedDistance: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <PremiumButton variant="outline" onClick={() => setOpenDialog(false)}>Cancel</PremiumButton>
                  <PremiumButton variant="success" onClick={handleSubmit}>Create Trip</PremiumButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Trips</p>
              <p className="text-2xl font-bold mt-2">{trips.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-2">{trips.filter(t => t.status === 'completed').length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold mt-2">{trips.filter(t => t.status === 'in-progress').length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold mt-2">{trips.filter(t => t.status === 'scheduled').length}</p>
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
                placeholder="Search by vehicle, origin, or destination..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
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
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Fuel Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrips.map((trip) => (
                    <TableRow key={trip.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{trip.vehicle}</TableCell>
                      <TableCell>{trip.driver}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="size-3.5" />
                          <span>{trip.origin}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{trip.destination}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{trip.distance} km</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(trip.status)} variant="outline">
                          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{trip.startTime}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{trip.endTime || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Fuel className="size-3.5 text-amber-600" />
                          <span>{trip.fuelUsed} L</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredTrips.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
