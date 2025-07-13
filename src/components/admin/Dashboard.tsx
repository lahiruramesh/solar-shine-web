import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, FileText, Users, MessageSquare, TrendingUp, Globe } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Appointments',
      value: '23',
      description: 'This month',
      icon: CalendarDays,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Blog Posts',
      value: '12',
      description: 'Published',
      icon: FileText,
      color: 'bg-green-500',
      trend: '+3'
    },
    {
      title: 'Projects',
      value: '8',
      description: 'Completed',
      icon: Users,
      color: 'bg-purple-500',
      trend: '+2'
    },
    {
      title: 'Testimonials',
      value: '15',
      description: 'Total reviews',
      icon: MessageSquare,
      color: 'bg-orange-500',
      trend: '+5'
    }
  ];

  const recentActivity = [
    { action: 'New appointment scheduled', time: '2 hours ago', type: 'appointment' },
    { action: 'Blog post "Solar Panel Maintenance" published', time: '5 hours ago', type: 'blog' },
    { action: 'Project "Green Office Complex" completed', time: '1 day ago', type: 'project' },
    { action: 'New testimonial received', time: '2 days ago', type: 'testimonial' },
    { action: 'SEO settings updated', time: '3 days ago', type: 'seo' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Solar Shine Admin</h2>
        <p className="text-blue-100">Manage your website content, appointments, and settings from here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-full`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{stat.description}</span>
                  <Badge variant="secondary" className="text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Add Blog Post</div>
                <div className="text-xs text-gray-500">Create new content</div>
              </button>
              <button className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">View Appointments</div>
                <div className="text-xs text-gray-500">Manage bookings</div>
              </button>
              <button className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Update SEO</div>
                <div className="text-xs text-gray-500">Optimize content</div>
              </button>
              <button className="p-4 text-left rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="font-medium text-sm">Add Project</div>
                <div className="text-xs text-gray-500">Showcase work</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current system health and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-sm">Database</div>
                <div className="text-xs text-gray-500">Operational</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-sm">Storage</div>
                <div className="text-xs text-gray-500">85% Available</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium text-sm">Website</div>
                <div className="text-xs text-gray-500">Online</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
