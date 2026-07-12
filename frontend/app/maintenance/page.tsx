'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TablePagination } from '@/components/table-pagination';
import { Plus, Wrench, AlertCircle, CheckCircle } from 'lucide-react';

const maintenanceRecords = [
  { id: 1, vehicle: 'ABC-1234', type: 'Oil Change', status: 'completed', date: '2024-01-15', cost: 450, nextDue: '2024-03-15' },
  { id: 2, vehicle: 'XYZ-5678', type: 'Tire Rotation', status: 'pending', date: '2024-01-18', cost: 300, nextDue: '2024-01-20' },
  { id: 3, vehicle: 'MNO-9012', type: 'Air Filter', status: 'completed', date: '2024-01-12', cost: 200, nextDue: '2024-06-12' },
  { id: 4, vehicle: 'DEF-3456', type: 'Brake Inspection', status: 'in-progress', date: '2024-01-16', cost: 600, nextDue: '2024-07-16' },
  { id: 5, vehicle: 'GHI-7890', type: 'Engine Check', status: 'pending', date: '2024-01-19', cost: 800, nextDue: '2024-01-22' },
  { id: 6, vehicle: 'JKL-2345', type: 'Battery Replacement', status: 'completed', date: '2024-01-10', cost: 550, nextDue: '2026-01-10' },
];

export default function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    type: '',
    description: '',
    cost: '',
  });
  const itemsPerPage = 10;

  const filteredRecords = useMemo(() => {
    return maintenanceRecords.filter(r => {
      const matchesSearch = r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
        r.type.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const handleSubmit = () => {
    setFormData({ vehicle: '', type: '', description: '', cost: '' });
    setOpenDialog(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="size-4 text-emerald-600" />;
      case 'pending':
        return <AlertCircle className="size-4 text-amber-600" />;
      case 'in-progress':
        return <Wrench className="size-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const pendingCount = maintenanceRecords.filter(r => r.status === 'pending').length;
  const completedCount = maintenanceRecords.filter(r => r.status === 'completed').length;
  const inProgressCount = maintenanceRecords.filter(r => r.status === 'in-progress').length;
  const totalCost = maintenanceRecords.reduce((sum, r) => sum + r.cost, 0);

  return (
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance</h1>
            <p className="text-sm text-muted-foreground mt-1">Schedule and track vehicle maintenance</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Maintenance</DialogTitle>
                <DialogDescription>Schedule new maintenance for a vehicle</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle</label>
                  <Select value={formData.vehicle} onValueChange={(v) => setFormData({ ...formData, vehicle: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABC-1234">ABC-1234</SelectItem>
                      <SelectItem value="XYZ-5678">XYZ-5678</SelectItem>
                      <SelectItem value="MNO-9012">MNO-9012</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maintenance Type</label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oil-change">Oil Change</SelectItem>
                      <SelectItem value="tire-rotation">Tire Rotation</SelectItem>
                      <SelectItem value="brake">Brake Service</SelectItem>
                      <SelectItem value="filter">Filter Replacement</SelectItem>
                      <SelectItem value="inspection">General Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Additional details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estimated Cost</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Schedule</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-2 text-amber-600">{pendingCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold mt-2 text-blue-600">{inProgressCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-2 text-emerald-600">{completedCount}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold mt-2">${(totalCost / 1000).toFixed(1)}k</p>
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
                placeholder="Search by vehicle or type..."
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
                    <TableHead>Maintenance Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Next Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{record.vehicle}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <Badge
                            variant={
                              record.status === 'completed'
                                ? 'default'
                                : record.status === 'pending'
                                  ? 'secondary'
                                  : 'outline'
                            }
                          >
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{record.date}</TableCell>
                      <TableCell className="font-semibold">${record.cost}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{record.nextDue}</TableCell>
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
                totalItems={filteredRecords.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
