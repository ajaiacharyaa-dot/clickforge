import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { useCreateDm, useUpdateDm, useGetDm } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { toast } from 'sonner';
import { ArrowLeft, Users, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PLATFORMS = ['twitter', 'instagram', 'linkedin'];

export default function DmForm() {
  const [location, setLocation] = useLocation();
  const params = useParams();
  const isEditing = Boolean(params.id && params.id !== 'new');
  
  const { data: existingDm, isLoading } = useGetDm(Number(params.id), { 
    query: { enabled: isEditing } 
  });
  
  const createDm = useCreateDm();
  const updateDm = useUpdateDm();

  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState<string>('twitter');
  const [recipientsInput, setRecipientsInput] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const initRef = useRef(false);

  useEffect(() => {
    if (existingDm && !initRef.current) {
      setMessage(existingDm.message);
      setPlatform(existingDm.platform);
      setRecipientsInput(existingDm.recipients.join(', '));
      const d = new Date(existingDm.scheduledAt);
      setScheduledDate(format(d, 'yyyy-MM-dd'));
      setScheduledTime(format(d, 'HH:mm'));
      initRef.current = true;
    } else if (!isEditing && !initRef.current) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(format(tomorrow, 'yyyy-MM-dd'));
      setScheduledTime('10:00');
      initRef.current = true;
    }
  }, [existingDm, isEditing]);

  const handleSubmit = async (status: 'draft' | 'scheduled') => {
    if (!message.trim()) return toast.error('Message content is required');
    const recipients = recipientsInput.split(',').map(r => r.trim().replace(/^@/, '')).filter(Boolean);
    if (recipients.length === 0) return toast.error('Add at least one recipient');
    if (!scheduledDate || !scheduledTime) return toast.error('Schedule time is required');

    const dt = new Date(`${scheduledDate}T${scheduledTime}`);

    const payload = {
      message,
      platform,
      recipients,
      scheduledAt: dt.toISOString(),
      status
    };

    try {
      if (isEditing) {
        await updateDm.mutateAsync({ id: Number(params.id), data: payload });
        toast.success(`DM updated and ${status}`);
      } else {
        await createDm.mutateAsync({ data: payload });
        toast.success(`DM created and ${status}`);
      }
      setLocation('/dms');
    } catch (e) {
      toast.error('Failed to save DM');
    }
  };

  if (isEditing && isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/dms')} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Direct Message' : 'New Direct Message'}</h1>
          <p className="text-sm text-muted-foreground">Draft your outreach and set recipients.</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="bg-muted/30 px-6 py-4 border-b flex items-center justify-between gap-4">
          <div className="flex-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => (
                  <SelectItem key={p} value={p}>
                    <div className="flex items-center gap-2">
                      <PlatformIcon platform={p} className="w-4 h-4" />
                      <span className="capitalize">{p}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Schedule Time</Label>
            <div className="flex gap-2">
              <Input 
                type="date" 
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="font-mono text-sm bg-background border-border/50"
              />
              <Input 
                type="time" 
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="font-mono text-sm bg-background border-border/50"
              />
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-muted/10 border-b flex items-center gap-3">
          <Label className="w-24 text-sm font-medium text-muted-foreground text-right shrink-0">To:</Label>
          <div className="flex-1 relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={recipientsInput}
              onChange={(e) => setRecipientsInput(e.target.value)}
              placeholder="usernames (comma separated)"
              className="pl-9 bg-background border-border/50 font-mono text-sm"
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-[250px] border-0 rounded-none focus-visible:ring-0 text-base resize-y p-6 leading-relaxed bg-background"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button 
          variant="outline" 
          onClick={() => handleSubmit('draft')}
          disabled={createDm.isPending || updateDm.isPending}
        >
          Save Draft
        </Button>
        <Button 
          className="shadow-sm bg-gradient-viral text-white hover:opacity-90 border-0"
          onClick={() => handleSubmit('scheduled')}
          disabled={createDm.isPending || updateDm.isPending}
        >
          <Send className="w-4 h-4 mr-2" />
          {createDm.isPending || updateDm.isPending ? 'Saving...' : 'Schedule DM'}
        </Button>
      </div>
    </div>
  );
}
