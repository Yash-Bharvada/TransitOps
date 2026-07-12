'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TablePagination } from '@/components/table-pagination';
import { Plus, TrendingUp, DollarSign, Fuel } from 'lucide-react';

const expenses = [
  { id: 1, vehicle: 'ABC-1234', type: 'Fuel', amount: 450, date: '2024-01-18', liters: 45, costPerLiter: 10 },
  { id: 2, vehicle: 'XYZ-5678', type: 'Fuel', amount: 380, date: '2024-01-17', liters: 38, costPerLiter: 10 },
  { id: 3, vehicle: 'MNO-9012', type: 'Maintenance', amount: 600, date: '2024-01-16', liters: 0, costPerLiter: 0 },
  { id: 4, vehicle: 'DEF-3456', type: 'Fuel', amount: 520, date: '2024-01-15', liters: 52, costPerLiter: 10 },
  { id: 5, vehicle: 'GHI-7890', type: 'Toll', amount: 250, date: '2024-01-14', liters: 0, costPerLiter: 0 },
  { id: 6, vehicle: 'JKL-2345', type: 'Fuel', amount: 420, date: '2024-01-13', liters: 42, costPerLiter: 10 },
];

const monthlyData = [
  { month: 'Jan', fuel: 4200, maintenance: 1200, tolls: 450 },
  { month: 'Feb', fuel: 4500, maintenance: 800, tolls: 520 },
  { month: 'Mar', fuel: 3800, maintenance: 1500, tolls: 380 },
  { month: 'Apr', fuel: 4100, maintenance: 900, tolls: 410 },
  { month: 'May', fuel: 4600, maintenance: 1100, tolls: 520 },
  { month: 'Jun', fuel: 4300, maintenance: 1400, tolls: 490 },
];

export default function ExpensesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    vehicle: '',
    type: '',
    amount: '',
    liters: '',
  });
  const itemsPerPage = 10;

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.vehicle.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || e.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(start, start + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const handleSubmit = () => {
    setFormData({ vehicle: '', type: '', amount: '', liters: '' });
    setOpenDialog(false);
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const fuelExpenses = expenses.filter(e => e.type === 'Fuel').reduce((sum, e) => sum + e.amount, 0);
  const maintenanceExpenses = expenses.filter(e => e.type === 'Maintenance').reduce((sum, e) => sum + e.amount, 0);
  const totalLiters = expenses.filter(e => e.type === 'Fuel').reduce((sum, e) => sum + e.liters, 0);

  return (
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fuel & Expenses</h1>
            <p className="text-sm text-muted-foreground mt-1">Track fuel consumption and operational costs</p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Log Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Expense</DialogTitle>
                <DialogDescription>Record a new fuel or expense entry</DialogDescription>
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
                  <label className="text-sm font-medium">Type</label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fuel">Fuel</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Toll">Toll</SelectItem>
                      <SelectItem value="Parking">Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Liters (if Fuel)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.liters}
                    onChange={(e) => setFormData({ ...formData, liters: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Log</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold mt-2">${(totalExpenses / 1000).toFixed(1)}k</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Fuel Cost</p>
              <p className="text-2xl font-bold mt-2">${(fuelExpenses / 1000).toFixed(1)}k</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Maintenance</p>
              <p className="text-2xl font-bold mt-2">${(maintenanceExpenses / 1000).toFixed(1)}k</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Fuel</p>
              <p className="text-2xl font-bold mt-2">{totalLiters} L</p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Expenses Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Monthly Expenses Trend</CardTitle>
            <CardDescription>Fuel, maintenance, and toll expenses by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="fuel" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="maintenance" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="tolls" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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
                placeholder="Search by vehicle..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1"
              />
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Fuel">Fuel</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Toll">Toll</SelectItem>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Liters</TableHead>
                    <TableHead>Cost/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{expense.vehicle}</TableCell>
                      <TableCell>
                        <Badge variant={expense.type === 'Fuel' ? 'default' : 'secondary'}>
                          {expense.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">${expense.amount}</TableCell>
                      <TableCell className="text-sm">{expense.date}</TableCell>
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
                      <TableCell className="text-sm text-muted-foreground">
                        {expense.costPerLiter > 0 ? `$${expense.costPerLiter}` : '-'}
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
                totalItems={filteredExpenses.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
