import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Sliders } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState({
    darkMode: true,
    animations: true,
    soundEffects: false,
    learningDifficulty: 'intermediate'
  });
  
  // Notification state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    learningReminders: true,
    budgetAlerts: true
  });
  
  // Security state
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false
  });
  
  // Form validation state
  const [errors, setErrors] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Fetch user profile data
  const { data: userData, isLoading, isError } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      try {
        // In a real-world scenario, this would fetch from the server
        // For now, we'll use the user context data as a fallback
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Use user context data as fallback
        return {
          firstName: user?.firstName || 'taf',
          lastName: user?.lastName || 'Mushamba',
          email: user?.email || 'taf@example.com',
          username: user?.username || 'taf_m',
          preferences: {
            darkMode: true,
            animations: true,
            soundEffects: false,
            learningDifficulty: 'intermediate'
          },
          notifications: {
            email: true,
            push: true,
            learningReminders: true,
            budgetAlerts: true
          },
          security: {
            twoFactorAuth: false
          }
        };
      }
    },
    enabled: !!user // Only run query when user is available
  });
  
  // Initialize form data immediately with user context data
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || 'taf',
        lastName: user.lastName || 'Mushamba',
        email: user.email || 'taf@example.com',
        username: user.username || 'taf_m'
      });
    }
  }, [user]);
  
  // Update form data from fetched user data when available
  useEffect(() => {
    if (userData) {
      setProfile({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        username: userData.username || ''
      });
      
      if (userData.preferences) {
        setPreferences(userData.preferences);
      }
      
      if (userData.notifications) {
        setNotifications(userData.notifications);
      }
      
      if (userData.security) {
        setSecurity(prev => ({
          ...prev,
          twoFactorAuth: userData.security.twoFactorAuth || false
        }));
      }
    }
  }, [userData]);
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update preferences mutation
  const updatePreferencesMutation = useMutation({
    mutationFn: async (preferencesData) => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Preferences Updated",
        description: "Your preferences have been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update notifications mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (notificationsData) => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Notification Settings Updated",
        description: "Your notification settings have been updated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update security mutation
  const updateSecurityMutation = useMutation({
    mutationFn: async (securityData) => {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Security Settings Updated",
        description: "Your security settings have been updated successfully.",
        variant: "default",
      });
      
      // Clear password fields after successful update
      setSecurity(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle profile form submit
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    
    // Validate email
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }
    
    updateProfileMutation.mutate(profile);
  };
  
  // Handle preferences form submit
  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    updatePreferencesMutation.mutate(preferences);
  };
  
  // Handle notifications form submit
  const handleNotificationsSubmit = (e) => {
    e.preventDefault();
    updateNotificationsMutation.mutate(notifications);
  };
  
  // Handle security form submit
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    
    // Validate current password
    if (security.currentPassword.length === 0) {
      setErrors(prev => ({ ...prev, currentPassword: 'Current password is required' }));
      return;
    }
    
    // Check if we're trying to update password
    if (security.newPassword || security.confirmPassword) {
      // Validate new password
      if (security.newPassword.length < 8) {
        setErrors(prev => ({ ...prev, newPassword: 'Password must be at least 8 characters' }));
        return;
      }
      
      // Validate password confirmation
      if (security.newPassword !== security.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
        return;
      }
    }
    
    updateSecurityMutation.mutate(security);
  };
  
  // Handle switch toggles
  const handlePreferenceToggle = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const handleNotificationToggle = (key, value) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSecurityToggle = (key, value) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background grid effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 grid grid-cols-[repeat(30,1fr)] grid-rows-[repeat(30,1fr)]">
          {Array.from({ length: 900 }).map((_, i) => (
            <div 
              key={i} 
              className="border-r border-b border-[#9FEF00]/10" 
              style={{ 
                animation: `pulse ${Math.random() * 4 + 3}s infinite ${Math.random() * 5}s ease-in-out`,
                opacity: Math.random() * 0.3
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-black/80"></div>
      </div>
      
      {/* Floating points */}
      <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float1" style={{ top: '15%', left: '25%' }}></div>
      <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float2" style={{ top: '35%', left: '65%' }}></div>
      <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float3" style={{ top: '65%', left: '45%' }}></div>
      <div className="absolute h-1 w-1 rounded-full bg-[#9FEF00] shadow-[0_0_5px_#9FEF00] animate-float4" style={{ top: '85%', left: '15%' }}></div>
      
      <div className="container mx-auto px-4 relative z-10 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="flex space-x-1 rounded-md bg-black/40 backdrop-blur-sm p-1 border border-[#9FEF00]/20 mb-6">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#9FEF00]/10 data-[state=active]:text-[#9FEF00] data-[state=active]:shadow-sm"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              
              <TabsTrigger 
                value="preferences" 
                className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#9FEF00]/10 data-[state=active]:text-[#9FEF00] data-[state=active]:shadow-sm"
              >
                <Sliders className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              
              <TabsTrigger 
                value="notifications"
                className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#9FEF00]/10 data-[state=active]:text-[#9FEF00] data-[state=active]:shadow-sm" 
              >
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              
              <TabsTrigger 
                value="security"
                className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-[#9FEF00]/10 data-[state=active]:text-[#9FEF00] data-[state=active]:shadow-sm"
              >
                <Lock className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>
            
            <div className="p-1">
              <TabsContent value="profile" className="mt-0">
                <Card className="bg-black/40 backdrop-blur-sm border border-[#9FEF00]/20 shadow-[0_0_20px_rgba(159,239,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Profile Information</CardTitle>
                    <CardDescription className="text-white/60">Manage your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-lg bg-[#9FEF00]/10 border border-[#9FEF00]/20 flex items-center justify-center">
                          <span className="text-[#9FEF00] text-2xl font-bold">
                            {profile.firstName && profile.lastName 
                              ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase() 
                              : 'TM'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-white">
                            {isLoading ? 'Loading...' : `${profile.firstName} ${profile.lastName}`}
                          </h3>
                          <p className="text-white/60 text-sm font-mono">
                            Level 1 Investor
                          </p>
                          <Button 
                            type="button"
                            variant="outline" 
                            className="mt-2 text-sm bg-black/50 border-[#9FEF00]/30 text-white hover:bg-[#9FEF00]/10 hover:text-[#9FEF00]"
                          >
                            Change Avatar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-white/70">First Name</Label>
                          <Input 
                            id="firstName" 
                            placeholder="First Name" 
                            value={profile.firstName}
                            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                            className="bg-black/50 border-[#9FEF00]/20 focus:border-[#9FEF00]/50 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-white/70">Last Name</Label>
                          <Input 
                            id="lastName" 
                            placeholder="Last Name" 
                            value={profile.lastName}
                            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                            className="bg-black/50 border-[#9FEF00]/20 focus:border-[#9FEF00]/50 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-white/70">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Email" 
                            value={profile.email}
                            onChange={(e) => {
                              setProfile(prev => ({ ...prev, email: e.target.value }));
                              setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            className={`bg-black/50 border-[#9FEF00]/20 focus:border-[#9FEF00]/50 text-white ${
                              errors.email ? 'border-red-500' : ''
                            }`}
                          />
                          {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-white/70">Username</Label>
                          <Input 
                            id="username" 
                            placeholder="Username" 
                            value={profile.username}
                            onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                            className="bg-black/50 border-[#9FEF00]/20 focus:border-[#9FEF00]/50 text-white"
                          />
                        </div>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="bg-[#9FEF00] text-black hover:bg-[#9FEF00]/80 mt-4"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-0">
                <Card className="bg-black/40 backdrop-blur-sm border border-[#9FEF00]/20 shadow-[0_0_20px_rgba(159,239,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">App Preferences</CardTitle>
                    <CardDescription className="text-white/60">Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Dark Mode</h3>
                          <p className="text-white/60 text-xs">Always use dark mode</p>
                        </div>
                        <Switch 
                          checked={preferences.darkMode} 
                          onCheckedChange={(checked) => handlePreferenceToggle('darkMode', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Animation Effects</h3>
                          <p className="text-white/60 text-xs">Enable animation effects</p>
                        </div>
                        <Switch 
                          checked={preferences.animations} 
                          onCheckedChange={(checked) => handlePreferenceToggle('animations', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Sound Effects</h3>
                          <p className="text-white/60 text-xs">Enable sound effects</p>
                        </div>
                        <Switch 
                          checked={preferences.soundEffects} 
                          onCheckedChange={(checked) => handlePreferenceToggle('soundEffects', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="difficulty" className="text-white/70">Learning Difficulty</Label>
                        <select 
                          id="difficulty"
                          className="w-full bg-black/50 border border-[#9FEF00]/20 rounded-md py-2 px-3 text-sm text-white focus:border-[#9FEF00]/50"
                          value={preferences.learningDifficulty}
                          onChange={(e) => setPreferences(prev => ({ ...prev, learningDifficulty: e.target.value }))}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="bg-[#9FEF00] text-black hover:bg-[#9FEF00]/80"
                        disabled={updatePreferencesMutation.isPending}
                      >
                        {updatePreferencesMutation.isPending ? 'Saving...' : 'Save Preferences'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card className="bg-black/40 backdrop-blur-sm border border-[#9FEF00]/20 shadow-[0_0_20px_rgba(159,239,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Notification Settings</CardTitle>
                    <CardDescription className="text-white/60">Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Email Notifications</h3>
                          <p className="text-white/60 text-xs">Receive notifications via email</p>
                        </div>
                        <Switch 
                          checked={notifications.email} 
                          onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Push Notifications</h3>
                          <p className="text-white/60 text-xs">Receive push notifications</p>
                        </div>
                        <Switch 
                          checked={notifications.push} 
                          onCheckedChange={(checked) => handleNotificationToggle('push', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Learning Reminders</h3>
                          <p className="text-white/60 text-xs">Daily reminders to continue learning</p>
                        </div>
                        <Switch 
                          checked={notifications.learningReminders} 
                          onCheckedChange={(checked) => handleNotificationToggle('learningReminders', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Budget Alerts</h3>
                          <p className="text-white/60 text-xs">Get notified when approaching budget limits</p>
                        </div>
                        <Switch 
                          checked={notifications.budgetAlerts} 
                          onCheckedChange={(checked) => handleNotificationToggle('budgetAlerts', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="bg-[#9FEF00] text-black hover:bg-[#9FEF00]/80"
                        disabled={updateNotificationsMutation.isPending}
                      >
                        {updateNotificationsMutation.isPending ? 'Saving...' : 'Save Notification Settings'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card className="bg-black/40 backdrop-blur-sm border border-[#9FEF00]/20 shadow-[0_0_20px_rgba(159,239,0,0.1)]">
                  <CardHeader>
                    <CardTitle className="text-white font-mono">Security Settings</CardTitle>
                    <CardDescription className="text-white/60">Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSecuritySubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-white/70">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          value={security.currentPassword}
                          onChange={(e) => {
                            setSecurity(prev => ({ ...prev, currentPassword: e.target.value }));
                            setErrors(prev => ({ ...prev, currentPassword: '' }));
                          }}
                          className={`bg-black/50 border-[#9FEF00]/20 focus:border-[#9FEF00]/50 text-white ${
                            errors.currentPassword ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.currentPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-white/70">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          value={security.newPassword}
                          onChange={(e) => {
                            setSecurity(prev => ({ ...prev, newPassword: e.target.value }));
                            setErrors(prev => ({ ...prev, newPassword: '' }));
                          }}
                          className={`bg-black/50 border-[#9FEF00]/20 focus:border-[#9FEF00]/50 text-white ${
                            errors.newPassword ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.newPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white/70">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password" 
                          placeholder="••••••••" 
                          value={security.confirmPassword}
                          onChange={(e) => {
                            setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }));
                            setErrors(prev => ({ ...prev, confirmPassword: '' }));
                          }}
                          className={`bg-black/50 border-[#9FEF00]/20 focus:border-[#9FEF00]/50 text-white ${
                            errors.confirmPassword ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-white">Two-Factor Authentication</h3>
                          <p className="text-white/60 text-xs">Add extra security to your account</p>
                        </div>
                        <Switch 
                          checked={security.twoFactorAuth} 
                          onCheckedChange={(checked) => handleSecurityToggle('twoFactorAuth', checked)}
                          className="data-[state=checked]:bg-[#9FEF00]" 
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="bg-[#9FEF00] text-black hover:bg-[#9FEF00]/80"
                        disabled={updateSecurityMutation.isPending}
                      >
                        {updateSecurityMutation.isPending ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
