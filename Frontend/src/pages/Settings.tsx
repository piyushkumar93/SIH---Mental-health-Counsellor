import { User, Bell, Shield, Globe, Moon, Heart, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="flex-1 p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-gradient-card shadow-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@university.edu" />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
              </div>
              
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" placeholder="STU123456" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Appointment Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get notified about upcoming sessions</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Forum Notifications</Label>
                  <p className="text-sm text-muted-foreground">Updates on your posts and replies</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Wellness Reminders</Label>
                  <p className="text-sm text-muted-foreground">Daily check-ins and self-care tips</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Crisis Alerts</Label>
                  <p className="text-sm text-muted-foreground">Important safety notifications</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy & Security
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">Show your profile in community forums</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Anonymous Mode</Label>
                  <p className="text-sm text-muted-foreground">Hide your identity in forum posts</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Data Sharing for Research</Label>
                  <p className="text-sm text-muted-foreground">Anonymous data for mental health research</p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div>
                <Label>Change Password</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Settings */}
        <div className="space-y-6">
          <Card className="p-6 bg-gradient-card shadow-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full mt-1">
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
              
              <div>
                <Label>Time Zone</Label>
                <Select defaultValue="est">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="cst">Central Time</SelectItem>
                    <SelectItem value="mst">Mountain Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Wellness Goals
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label>Daily Check-in Time</Label>
                <Select defaultValue="morning">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Weekly Session Goal</Label>
                <Select defaultValue="1">
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 session per week</SelectItem>
                    <SelectItem value="2">2 sessions per week</SelectItem>
                    <SelectItem value="3">3 sessions per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-success border-success/20">
            <h4 className="font-semibold text-success-foreground mb-2">Emergency Contacts</h4>
            <p className="text-sm text-success-foreground/90 mb-3">
              Quick access to crisis support resources.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full text-success-foreground border-success-foreground/30">
                Crisis Hotline: 988
              </Button>
              <Button variant="outline" size="sm" className="w-full text-success-foreground border-success-foreground/30">
                Campus Security
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button variant="calming" className="px-8">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}