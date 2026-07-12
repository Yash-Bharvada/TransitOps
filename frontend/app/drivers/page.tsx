'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { drivers } from '@/lib/data';
import { TablePagination } from '@/components/table-pagination';
import { Plus, Star, Award, TrendingUp } from 'lucide-react';

export default function DriversPage() {
  const [search, setSearch] = useState('');
  const [licenseFilter, setLicenseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const itemsPerPage = 10;

  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.licenseNumber.toLowerCase().includes(search.toLowerCase());
      const matchesLicense = licenseFilter === 'all' || d.licenseCategory === licenseFilter;
      return matchesSearch && matchesLicense;
    });
  }, [search, licenseFilter]);

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
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Register a new driver to your fleet</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="John Smith" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">License Number</label>
                  <Input placeholder="DL123456" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button onClick={() => setOpenDialog(false)}>Add Driver</Button>
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
              <p className="text-2xl font-bold mt-2">{drivers.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold mt-2">{drivers.filter(d => d.status === 'active').length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg. Safety Score</p>
              <p className="text-2xl font-bold mt-2">{(drivers.reduce((sum, d) => sum + d.safetyScore, 0) / drivers.length).toFixed(0)}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">On Duty</p>
              <p className="text-2xl font-bold mt-2">{drivers.filter(d => d.status === 'Available' || d.status === 'On Trip').length}</p>
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
                  <SelectItem value="Class A">Class A</SelectItem>
                  <SelectItem value="Class B">Class B</SelectItem>
                  <SelectItem value="Class C">Class C</SelectItem>
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
                      <TableCell className="text-sm">{driver.licenseNumber}</TableCell>
                      <TableCell className="text-sm">{driver.licenseCategory}</TableCell>
                      <TableCell className="text-sm">{driver.contact}</TableCell>
                      <TableCell>
                        <Badge variant={driver.status === 'Available' || driver.status === 'On Trip' ? 'default' : 'secondary'}>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="size-4 fill-amber-400 text-amber-400" />
                          <span className={`font-semibold ${getRatingColor(driver.safetyScore / 20)}`}>
                            {(driver.safetyScore / 20).toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{driver.licenseExpiry}</TableCell>
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
                totalItems={filteredDrivers.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
