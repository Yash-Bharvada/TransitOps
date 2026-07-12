'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend,
  ResponsiveContainer, ScatterChart, Scatter, Tooltip
} from 'recharts';
import { Download, TrendingUp, AlertTriangle } from 'lucide-react';

const performanceData = [
  { date: 'Jan 1', efficiency: 8.2, safety: 98, utilization: 85 },
  { date: 'Jan 8', efficiency: 8.5, safety: 97, utilization: 88 },
  { date: 'Jan 15', efficiency: 8.1, safety: 99, utilization: 84 },
  { date: 'Jan 22', efficiency: 8.8, safety: 98, utilization: 91 },
  { date: 'Jan 29', efficiency: 8.4, safety: 99, utilization: 87 },
];

const driverPerformance = [
  { name: 'John Smith', trips: 48, rating: 4.8, safety: 100 },
  { name: 'Jane Doe', trips: 42, rating: 4.6, safety: 98 },
  { name: 'Mike Johnson', trips: 35, rating: 4.3, safety: 95 },
  { name: 'Sarah Williams', trips: 38, rating: 4.5, safety: 97 },
  { name: 'Tom Davis', trips: 31, rating: 4.2, safety: 94 },
];

const vehicleMetrics = [
  { vehicle: 'ABC-1234', efficiency: 8.5, cost: 1200, status: 'Excellent' },
  { vehicle: 'XYZ-5678', efficiency: 7.8, cost: 1450, status: 'Good' },
  { vehicle: 'MNO-9012', efficiency: 8.2, cost: 1100, status: 'Excellent' },
  { vehicle: 'DEF-3456', efficiency: 7.5, cost: 1600, status: 'Fair' },
  { vehicle: 'GHI-7890', efficiency: 8.1, cost: 1150, status: 'Excellent' },
];

const routeAnalysis = [
  { route: 'Route A', trips: 45, distance: 1200, avgTime: '2.5h' },
  { route: 'Route B', trips: 38, distance: 950, avgTime: '2.1h' },
  { route: 'Route C', trips: 52, distance: 1450, avgTime: '3h' },
  { route: 'Route D', trips: 28, distance: 680, avgTime: '1.5h' },
];

const costBreakdown = [
  { name: 'Fuel', value: 45000, color: '#3b82f6' },
  { name: 'Maintenance', value: 18000, color: '#f59e0b' },
  { name: 'Tolls', value: 8000, color: '#10b981' },
  { name: 'Insurance', value: 12000, color: '#ef4444' },
  { name: 'Other', value: 7000, color: '#8b5cf6' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('performance');

  return (
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">Comprehensive fleet performance insights</p>
          </div>
          <Button>
            <Download className="size-4" />
            Export Report
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="drivers">Drivers</SelectItem>
              <SelectItem value="vehicles">Vehicles</SelectItem>
              <SelectItem value="cost">Cost Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Avg. Fuel Efficiency</p>
              <p className="text-2xl font-bold mt-2">8.4 km/l</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">+2.1% vs last period</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Fleet Utilization</p>
              <p className="text-2xl font-bold mt-2">87%</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">+5.3% vs last period</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Safety Rating</p>
              <p className="text-2xl font-bold mt-2">98.2%</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">-0.5% vs last period</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold mt-2">$90k</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">+12% vs last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Fleet Performance Trends</CardTitle>
              <CardDescription>Efficiency, safety, and utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Legend />
                    <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={2} name="Efficiency (km/l)" />
                    <Line type="monotone" dataKey="safety" stroke="#10b981" strokeWidth={2} name="Safety (%)" />
                    <Line type="monotone" dataKey="utilization" stroke="#f59e0b" strokeWidth={2} name="Utilization (%)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Operational Cost Breakdown</CardTitle>
              <CardDescription>Distribution of fleet expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Pie
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${(value / 1000).toFixed(0)}k`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vehicle Efficiency */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Vehicle Efficiency Comparison</CardTitle>
              <CardDescription>Fuel efficiency vs operational cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vehicleMetrics} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="vehicle" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="efficiency" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Route Analysis */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Route Performance Analysis</CardTitle>
              <CardDescription>Trips and distance by route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={routeAnalysis} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="route" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="trips" fill="#10b981" radius={[8, 8, 0, 0]} name="Trips" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Drivers Performance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Driver Performance Leaderboard</CardTitle>
            <CardDescription>Top performing drivers based on trips, rating, and safety</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driverPerformance.map((driver, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-semibold">
                      #{idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{driver.name}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{driver.trips} trips</span>
                        <span>Rating: {driver.rating}/5</span>
                        <span>Safety: {driver.safety}%</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={driver.rating >= 4.5 ? 'default' : 'secondary'}>
                    {driver.rating >= 4.5 ? 'Excellent' : driver.rating >= 4 ? 'Good' : 'Fair'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
