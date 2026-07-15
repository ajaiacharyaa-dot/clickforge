import { useGetStats } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Send, Clock, AlertTriangle, FileEdit, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading || !stats) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = stats.platformBreakdown.map(p => ({
    name: p.platform,
    count: p.count
  }));

  const metrics = [
    {
      title: "Scheduled Posts",
      value: stats.totalScheduled,
      icon: Clock,
      description: "Posts waiting to go out",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Sent Today",
      value: stats.sentToday,
      icon: Send,
      description: "Successfully published",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Failed",
      value: stats.failedTotal,
      icon: AlertTriangle,
      description: "Requires attention",
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      title: "Drafts",
      value: stats.draftCount,
      icon: FileEdit,
      description: "Works in progress",
      color: "text-muted-foreground",
      bg: "bg-muted"
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-lg">Overview of your automated social activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-none shadow-sm bg-card hover-elevate transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${metric.bg}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Platform Breakdown</CardTitle>
            <CardDescription>Posts distributed across networks</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <YAxis tickLine={false} axisLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted)/0.4)'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-sm)'}}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>DM Activity</CardTitle>
            <CardDescription>Direct messages overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Scheduled</p>
                  <p className="text-xs text-muted-foreground">Waiting to send</p>
                </div>
              </div>
              <div className="text-xl font-bold">{stats.dmScheduled}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Sent Today</p>
                  <p className="text-xs text-muted-foreground">Successfully delivered</p>
                </div>
              </div>
              <div className="text-xl font-bold">{stats.dmSentToday}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}