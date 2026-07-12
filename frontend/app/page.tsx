'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, ComposedChart, Line } from 'recharts';
import { vehicles, trips } from '@/lib/data';
import { StatusBadge } from '@/components/status-badge';
import { TablePagination } from '@/components/table-pagination';
import { PremiumKPICard } from '@/components/premium-kpi-card';
import { TrendingUp, Fuel, AlertTriangle, MapPin, Activity } from 'lucide-react';

const fleetMetrics = [
  { label: 'Active Vehicles', value: 12, icon: MapPin, trend: '+2.5%' },
  { label: 'Total Trips', value: 148, icon: TrendingUp, trend: '+12.3%' },
  { label: 'Fuel Efficiency', value: '8.4 km/l', icon: Fuel, trend: '+1.2%' },
  { label: 'Maintenance Due', value: 3, icon: AlertTriangle, trend: '-3' },
];

const weeklyData = [
  { date: 'Mon', trips: 42, fuel: 156 },
  { date: 'Tue', trips: 55, fuel: 189 },
  { date: 'Wed', trips: 48, fuel: 172 },
  { date: 'Thu', trips: 67, fuel: 205 },
  { date: 'Fri', trips: 73, fuel: 218 },
  { date: 'Sat', trips: 38, fuel: 142 },
  { date: 'Sun', trips: 29, fuel: 98 },
];

const statusDistribution = [
  { name: 'Active', value: 12, color: '#10b981' },
  { name: 'Idle', value: 4, color: '#f59e0b' },
  { name: 'Maintenance', value: 3, color: '#ef4444' },
];

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = v.registration.toLowerCase().includes(search.toLowerCase()) ||
        v.driver.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

  return (
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fleet Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time fleet monitoring and analytics</p>
          </div>
        </div>

        {/* Premium KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumKPICard
            label="Active Vehicles"
            value={24}
            trend={{ value: 2.5, direction: 'up' }}
            icon={MapPin}
            color="blue"
            sparklineData={[12, 14, 18, 22, 24]}
          />
          <PremiumKPICard
            label="Total Trips"
            value={148}
            trend={{ value: 12.3, direction: 'up' }}
            icon={Activity}
            color="green"
            sparklineData={[85, 95, 110, 130, 148]}
          />
          <PremiumKPICard
            label="Fuel Efficiency"
            value="8.4"
            unit="km/l"
            trend={{ value: 1.2, direction: 'up' }}
            icon={Fuel}
            color="orange"
            sparklineData={[7.8, 8.0, 8.1, 8.3, 8.4]}
          />
          <PremiumKPICard
            label="Maintenance Due"
            value={3}
            trend={{ value: 3, direction: 'down' }}
            icon={AlertTriangle}
            color="red"
            sparklineData={[6, 5, 4, 4, 3]}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Trips Chart */}
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Trips and fuel consumption by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tickLine={false} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="trips" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Trips" />
                    <Line yAxisId="right" type="monotone" dataKey="fuel" stroke="#10b981" strokeWidth={3} name="Fuel (L)" dot={{ fill: '#10b981', r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Fleet Status Pie */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Vehicle distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles Table */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Fleet Vehicles</CardTitle>
                <CardDescription>Active vehicles in your fleet</CardDescription>
              </div>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Input
                placeholder="Search by registration or driver..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
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
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fuel Level</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Last Trip</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{vehicle.registration}</TableCell>
                      <TableCell>{vehicle.driver}</TableCell>
                      <TableCell>
                        <StatusBadge status={vehicle.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${vehicle.fuelLevel}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{vehicle.fuelLevel}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={vehicle.maintenanceStatus === 'due' ? 'destructive' : 'secondary'}>
                          {vehicle.maintenanceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{vehicle.lastTrip}</TableCell>
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
                totalItems={filteredVehicles.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
