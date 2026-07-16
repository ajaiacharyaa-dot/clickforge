import { useState } from 'react';
import { useListPlatforms } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { CheckCircle2, Link2, Unlink, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';

const PLATFORM_PERMISSIONS: Record<string, string[]> = {
  youtube: ['Read channel info & analytics', 'Upload & manage videos', 'Manage channel metadata'],
  facebook: ['Read pages & groups', 'Publish posts to pages', 'Access page insights'],
  twitter: ['Read your profile & tweets', 'Post tweets & threads', 'Send direct messages'],
  instagram: ['Read profile & media', 'Publish photos & reels', 'Access story insights'],
  linkedin: ['Read your profile', 'Share posts & articles', 'Access engagement data'],
  tiktok: ['Read your profile & videos', 'Upload & publish videos', 'Access video analytics'],
};

const PLATFORM_COLORS: Record<string, string> = {
  youtube: 'bg-red-50 border-red-200',
  facebook: 'bg-blue-50 border-blue-200',
  twitter: 'bg-sky-50 border-sky-200',
  instagram: 'bg-pink-50 border-pink-200',
  linkedin: 'bg-blue-50 border-blue-200',
  tiktok: 'bg-slate-50 border-slate-200',
};

export default function Platforms() {
  const { data: platforms, isLoading } = useListPlatforms();
  const [selectedPlatform, setSelectedPlatform] = useState<{ id: string; name: string } | null>(null);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const openConnectDialog = (id: string, name: string) => {
    setSelectedPlatform({ id, name });
  };

  const handleConfirmConnect = () => {
    if (!selectedPlatform) return;
    setConnectingId(selectedPlatform.id);
    setSelectedPlatform(null);
    // Simulate OAuth redirect (real OAuth not yet implemented)
    setTimeout(() => {
      setConnectingId(null);
      toast.info(`${selectedPlatform.name} OAuth integration coming soon.`);
    }, 1200);
  };

  const handleDisconnect = (name: string) => {
    toast.success(`${name} disconnected.`);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 bg-muted w-48 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-52 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Connected Accounts</h1>
        <p className="text-muted-foreground mt-1">
          Link your social platforms to enable automated publishing and scheduling.
        </p>
      </div>

      {/* Status strip */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
        <Clock className="w-4 h-4 shrink-0" />
        OAuth integrations are in development. Connect buttons will redirect to platform authorization once live.
      </div>

      {/* Platform grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms?.map((platform) => {
          const isConnecting = connectingId === platform.id;
          return (
            <Card
              key={platform.id}
              className={`border transition-all ${
                platform.connected
                  ? 'border-primary/20 shadow-sm bg-primary/5'
                  : PLATFORM_COLORS[platform.id] ?? 'border-border/50 bg-card'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      platform.connected ? 'bg-background shadow-sm' : 'bg-white shadow-sm'
                    }`}
                  >
                    <PlatformIcon
                      platform={platform.id}
                      className={`w-6 h-6 ${platform.connected ? 'text-primary' : 'text-foreground/70'}`}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    {platform.connected ? (
                      <div className="flex items-center gap-1 text-sm text-emerald-600 mt-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Connected
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-1">Not connected</div>
                    )}
                  </div>
                </div>
                {platform.connected && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {platform.connected ? (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Handle</div>
                        <div className="font-medium font-mono text-sm">{platform.handle ?? 'Unknown'}</div>
                      </div>
                      {platform.followerCount != null && (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Followers</div>
                          <div className="font-medium font-mono text-sm">{platform.followerCount.toLocaleString()}</div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDisconnect(platform.name)}
                    >
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Permissions preview */}
                    <ul className="space-y-1">
                      {(PLATFORM_PERMISSIONS[platform.id] ?? []).map((perm) => (
                        <li key={perm} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <ShieldCheck className="w-3 h-3 text-primary/60 shrink-0" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full bg-gradient-viral text-white hover:opacity-90 border-0 shadow-sm"
                      disabled={isConnecting}
                      onClick={() => openConnectDialog(platform.id, platform.name)}
                    >
                      {isConnecting ? (
                        <>
                          <span className="animate-spin mr-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Link2 className="w-4 h-4 mr-2" />
                          Connect {platform.name}
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connect confirmation dialog */}
      <Dialog open={!!selectedPlatform} onOpenChange={() => setSelectedPlatform(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlatform && (
                <PlatformIcon platform={selectedPlatform.id} className="w-5 h-5" />
              )}
              Connect {selectedPlatform?.name}
            </DialogTitle>
            <DialogDescription>
              You'll be redirected to {selectedPlatform?.name} to authorize ClickForge.
              The following permissions will be requested:
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-2 py-2">
            {(PLATFORM_PERMISSIONS[selectedPlatform?.id ?? ''] ?? []).map((perm) => (
              <li key={perm} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                {perm}
              </li>
            ))}
          </ul>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedPlatform(null)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-viral text-white hover:opacity-90 border-0"
              onClick={handleConfirmConnect}
            >
              <Link2 className="w-4 h-4 mr-2" />
              Authorize with {selectedPlatform?.name}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
