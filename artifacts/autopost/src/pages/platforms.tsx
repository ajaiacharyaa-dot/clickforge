import { useListPlatforms } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { CheckCircle2, Link2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function Platforms() {
  const { data: platforms, isLoading } = useListPlatforms();

  const handleConnect = (platformName: string) => {
    toast.success(`Redirecting to ${platformName} authorization...`);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-muted w-48 rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-muted rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connected Accounts</h1>
        <p className="text-muted-foreground mt-1">Manage your social media integrations and permissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms?.map((platform) => (
          <Card key={platform.id} className={`border ${platform.connected ? 'border-primary/20 shadow-sm bg-primary/5' : 'border-border/50 bg-card'} transition-all`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${platform.connected ? 'bg-background shadow-sm' : 'bg-muted'}`}>
                  <PlatformIcon platform={platform.id} className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg capitalize">{platform.name}</CardTitle>
                  {platform.connected ? (
                    <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">Not connected</div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {platform.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Handle</div>
                      <div className="font-medium font-mono text-sm">{platform.handle || 'Unknown'}</div>
                    </div>
                    {platform.followerCount != null && (
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Followers</div>
                        <div className="font-medium font-mono text-sm">{platform.followerCount.toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => toast.success('Disconnected')}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Connect your {platform.name} account to enable automated publishing and DM capabilities.
                  </p>
                  <Button className="w-full shadow-sm" onClick={() => handleConnect(platform.name)}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Connect {platform.name}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}