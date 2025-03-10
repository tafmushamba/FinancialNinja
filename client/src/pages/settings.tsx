import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '@/components/layout/sidebar';
import MobileNav from '@/components/layout/mobile-nav';
import Header from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TerminalText from '@/components/ui/terminal-text';

const Settings: React.FC = () => {
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/user/profile'],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Header title="Settings" />
        
        <div className="p-4 md:p-6">
          <section className="mb-8 animate-fadeIn">
            <h1 className="text-2xl font-mono font-bold mb-6">
              <TerminalText>Account Settings</TerminalText>
            </h1>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="bg-dark-800 border border-dark-600">
                <TabsTrigger value="profile" className="data-[state=active]:bg-dark-700">Profile</TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-dark-700">Preferences</TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-dark-700">Notifications</TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-dark-700">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-4">
                <Card className="bg-dark-800 border-dark-600">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full bg-neon-purple bg-opacity-30 flex items-center justify-center">
                          <span className="text-neon-purple text-2xl font-bold">JS</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            {isLoading ? 'Loading...' : `${userData?.firstName} ${userData?.lastName}`}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {isLoading ? 'Loading...' : userData?.userLevel || 'Level 1 Investor'}
                          </p>
                          <Button variant="outline" className="mt-2 text-sm bg-dark-700 hover:bg-dark-600">
                            Change Avatar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="First Name" 
                            defaultValue={userData?.firstName}
                            className="bg-dark-700 border-dark-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Last Name" 
                            defaultValue={userData?.lastName}
                            className="bg-dark-700 border-dark-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Email" 
                            defaultValue={userData?.email}
                            className="bg-dark-700 border-dark-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input 
                            id="username" 
                            placeholder="Username" 
                            defaultValue={userData?.username}
                            className="bg-dark-700 border-dark-600"
                          />
                        </div>
                      </div>
                      
                      <Button className="bg-neon-green text-black hover:bg-opacity-80 mt-2">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-4">
                <Card className="bg-dark-800 border-dark-600">
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Dark Mode</h3>
                          <p className="text-gray-400 text-xs">Always use dark mode</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Animation Effects</h3>
                          <p className="text-gray-400 text-xs">Enable animation effects</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Sound Effects</h3>
                          <p className="text-gray-400 text-xs">Enable sound effects</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Learning Difficulty</Label>
                        <select 
                          id="difficulty"
                          className="w-full bg-dark-700 border border-dark-600 rounded-md py-2 px-3 text-sm"
                          defaultValue="intermediate"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      
                      <Button className="bg-neon-green text-black hover:bg-opacity-80">
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-4">
                <Card className="bg-dark-800 border-dark-600">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Email Notifications</h3>
                          <p className="text-gray-400 text-xs">Receive notifications via email</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Push Notifications</h3>
                          <p className="text-gray-400 text-xs">Receive push notifications</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Learning Reminders</h3>
                          <p className="text-gray-400 text-xs">Daily reminders to continue learning</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Budget Alerts</h3>
                          <p className="text-gray-400 text-xs">Get notified when approaching budget limits</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <Button className="bg-neon-green text-black hover:bg-opacity-80">
                        Save Notification Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-4">
                <Card className="bg-dark-800 border-dark-600">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-dark-700 border-dark-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-dark-700 border-dark-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          className="bg-dark-700 border-dark-600"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                          <p className="text-gray-400 text-xs">Add extra security to your account</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                      
                      <Button className="bg-neon-green text-black hover:bg-opacity-80">
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default Settings;
