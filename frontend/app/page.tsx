'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, ComposedChart, Line } from 'recharts';
import { StatusBadge } from '@/components/status-badge';
import { TablePagination } from '@/components/table-pagination';
import { PremiumKPICard } from '@/components/premium-kpi-card';
import { TrendingUp, Fuel, AlertTriangle, MapPin, Activity, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/components/auth-context';
import api from '@/lib/api';

const weeklyData = [
  { date: 'Mon', trips: 42, fuel: 156 },
  { date: 'Tue', trips: 55, fuel: 189 },
  { date: 'Wed', trips: 48, fuel: 172 },
  { date: 'Thu', trips: 67, fuel: 205 },
  { date: 'Fri', trips: 73, fuel: 218 },
  { date: 'Sat', trips: 38, fuel: 142 },
  { date: 'Sun', trips: 29, fuel: 98 },
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (token) {
        fetchData();
      } else {
        setLoading(false);
      }
    }
  }, [token, authLoading]);

  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [dashRes, vehRes] = await Promise.all([
        api.get('/reports/dashboard'),
        api.get('/vehicles/?limit=100')
      ]);
      setDashboardData(dashRes.data.data);
      setVehicles(vehRes.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = (v.registration?.toLowerCase() || '').includes(search.toLowerCase());
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

  const statusDistribution = useMemo(() => {
    if (!vehicles.length) return [];
    const counts = vehicles.reduce((acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const colors: Record<string, string> = {
      'Available': '#10b981',
      'On Trip': '#3b82f6',
      'In Shop': '#ef4444',
      'Out of Service': '#f59e0b'
    };
    
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#888888'
    }));
  }, [vehicles]);

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
            <h1 className="text-3xl font-bold text-foreground">Fleet Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Real-time fleet monitoring and analytics</p>
          </div>
        </div>

        {/* Premium KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <PremiumKPICard
            label="Total Vehicles"
            value={dashboardData?.vehicles?.total || 0}
            trend={{ value: 5.2, direction: 'up' }}
            icon={MapPin}
            color="blue"
            sparklineData={[12, 14, 18, 22, dashboardData?.vehicles?.total || 0]}
          />
          <PremiumKPICard
            label="Total Trips"
            value={dashboardData?.trips?.total || 0}
            trend={{ value: 12.3, direction: 'up' }}
            icon={Activity}
            color="green"
            sparklineData={[85, 95, 110, 130, dashboardData?.trips?.total || 0]}
          />
          <PremiumKPICard
            label="Total Drivers"
            value={dashboardData?.drivers?.total || 0}
            trend={{ value: 2.1, direction: 'up' }}
            icon={MapPin}
            color="orange"
            sparklineData={[15, 15, 16, 17, dashboardData?.drivers?.total || 0]}
          />
          <PremiumKPICard
            label="Maintenance Needs"
            value={dashboardData?.maintenance?.pending || 0}
            trend={{ value: 1, direction: 'down' }}
            icon={AlertTriangle}
            color="red"
            sparklineData={[4, 5, 4, 3, dashboardData?.maintenance?.pending || 0]}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/50">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Trips and fuel consumption by day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <ComposedChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="#888888" tickLine={false} />
                    <YAxis yAxisId="left" stroke="#888888" tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888888" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="trips" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Trips" />
                    <Line yAxisId="right" type="monotone" dataKey="fuel" stroke="#10b981" strokeWidth={3} name="Fuel (L)" dot={{ fill: '#10b981', r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Current vehicle distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                {statusDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No data available</div>
                )}
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
                placeholder="Search by registration..."
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
                    <TableHead>Region</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{vehicle.registration}</TableCell>
                      <TableCell>{vehicle.name}</TableCell>
                      <TableCell>
                        <StatusBadge status={vehicle.status || 'Unknown'} />
                      </TableCell>
                      <TableCell>{vehicle.region}</TableCell>
                    </TableRow>
                  ))}
                  {paginatedVehicles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
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
    </ProtectedRoute>
  );
}
