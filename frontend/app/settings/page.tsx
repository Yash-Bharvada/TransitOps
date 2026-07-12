'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Bell, Lock, Users, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('TransitOps Inc.');
  const [email, setEmail] = useState('admin@transitops.com');
  const [theme, setTheme] = useState('dark');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [tripsUpdateNotifications, setTripsUpdateNotifications] = useState(true);
  const [fuelLevelAlerts, setFuelLevelAlerts] = useState(true);

  const handleSave = () => {
    console.log('Settings saved');
  };

  return (
    <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background to-background/95">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and fleet preferences</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">
              <Settings className="size-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="size-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="size-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Zap className="size-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your account and company information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Info */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Company Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name</label>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Email</label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="company@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input placeholder="123 Business St, City, State 12345" />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Display Settings */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Display Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Theme</label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Language</label>
                      <Select defaultValue="en">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Zone</label>
                      <Select defaultValue="utc">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="gmt">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fleet Settings */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Fleet Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Default Fuel Type</label>
                      <Select defaultValue="diesel">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="petrol">Petrol</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fuel Price (per liter)</label>
                      <Input placeholder="10.50" type="number" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Maintenance Interval (km)</label>
                      <Input placeholder="10000" type="number" />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">All Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Maintenance Reminders</p>
                        <p className="text-sm text-muted-foreground">Get notified about scheduled maintenance</p>
                      </div>
                      <Switch checked={maintenanceReminders} onCheckedChange={setMaintenanceReminders} disabled={!emailNotifications} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Trip Updates</p>
                        <p className="text-sm text-muted-foreground">Get notified when trips are completed</p>
                      </div>
                      <Switch checked={tripsUpdateNotifications} onCheckedChange={setTripsUpdateNotifications} disabled={!emailNotifications} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* SMS Alerts */}
                <div>
                  <h3 className="text-base font-semibold mb-4">SMS Alerts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                      </div>
                      <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Fuel Level Alerts</p>
                        <p className="text-sm text-muted-foreground">Alert when fuel is running low</p>
                      </div>
                      <Switch checked={fuelLevelAlerts} onCheckedChange={setFuelLevelAlerts} disabled={!smsAlerts} />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notification Frequency */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Notification Frequency</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Daily Digest Time</label>
                      <Select defaultValue="08:00">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="06:00">6:00 AM</SelectItem>
                          <SelectItem value="08:00">8:00 AM</SelectItem>
                          <SelectItem value="12:00">12:00 PM</SelectItem>
                          <SelectItem value="18:00">6:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Password</h3>
                  <div className="space-y-4">
                    <Button variant="outline">Change Password</Button>
                    <p className="text-sm text-muted-foreground">Last changed 45 days ago</p>
                  </div>
                </div>

                <Separator />

                {/* Two Factor Auth */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Badge>Disabled</Badge>
                  </div>
                </div>

                <Separator />

                {/* Active Sessions */}
                <div>
                  <h3 className="text-base font-semibold mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">Chrome on Windows</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">Mobile App</p>
                        <p className="text-sm text-muted-foreground">Last active 2 hours ago</p>
                      </div>
                      <Button variant="ghost" size="sm">Sign Out</Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* API Access */}
                <div>
                  <h3 className="text-base font-semibold mb-4">API Access</h3>
                  <div className="space-y-4">
                    <Button variant="outline">Generate API Key</Button>
                    <p className="text-sm text-muted-foreground">Create an API key for integrations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Connect external services and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">GPS Tracking</p>
                    <p className="text-sm text-muted-foreground">Track vehicle locations in real-time</p>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">Fuel Monitoring System</p>
                    <p className="text-sm text-muted-foreground">Automatic fuel consumption tracking</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">Weather Service</p>
                    <p className="text-sm text-muted-foreground">Get route-based weather alerts</p>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">Email Service</p>
                    <p className="text-sm text-muted-foreground">Configure email notifications</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
