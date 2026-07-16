import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { useCreatePost, useUpdatePost, useGetPost } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toast } from 'sonner';
import { ArrowLeft, Clock, Send, Image as ImageIcon, Hash } from 'lucide-react';
import { format } from 'date-fns';

const PLATFORMS = ['twitter', 'instagram', 'linkedin', 'tiktok'];

export default function PostForm() {
  const [location, setLocation] = useLocation();
  const params = useParams();
  const isEditing = Boolean(params.id && params.id !== 'new');
  
  const { data: existingPost, isLoading } = useGetPost(Number(params.id), { 
    query: { enabled: isEditing } 
  });
  
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['twitter']);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [hashtags, setHashtags] = useState('');

  const initRef = useRef(false);

  useEffect(() => {
    if (existingPost && !initRef.current) {
      setContent(existingPost.content);
      setPlatforms(existingPost.platforms);
      const d = new Date(existingPost.scheduledAt);
      setScheduledDate(format(d, 'yyyy-MM-dd'));
      setScheduledTime(format(d, 'HH:mm'));
      if (existingPost.imageUrl) setImageUrl(existingPost.imageUrl);
      if (existingPost.hashtags) setHashtags(existingPost.hashtags.join(', '));
      initRef.current = true;
    } else if (!isEditing && !initRef.current) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledDate(format(tomorrow, 'yyyy-MM-dd'));
      setScheduledTime('09:00');
      initRef.current = true;
    }
  }, [existingPost, isEditing]);

  const handleSubmit = async (status: 'draft' | 'scheduled') => {
    if (!content.trim()) return toast.error('Content is required');
    if (platforms.length === 0) return toast.error('Select at least one platform');
    if (!scheduledDate || !scheduledTime) return toast.error('Schedule time is required');

    const dt = new Date(`${scheduledDate}T${scheduledTime}`);
    const tags = hashtags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean);

    const payload = {
      content,
      platforms,
      scheduledAt: dt.toISOString(),
      status,
      imageUrl: imageUrl || undefined,
      hashtags: tags.length > 0 ? tags : undefined
    };

    try {
      if (isEditing) {
        await updatePost.mutateAsync({ id: Number(params.id), data: payload });
        toast.success(`Post updated and ${status}`);
      } else {
        await createPost.mutateAsync({ data: payload });
        toast.success(`Post created and ${status}`);
      }
      setLocation('/posts');
    } catch (e) {
      toast.error('Failed to save post');
    }
  };

  if (isEditing && isLoading) return <div className="p-8 text-center">Loading...</div>;

  const characterCount = content.length;
  const isOverLimit = characterCount > 280 && platforms.includes('twitter');

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/posts')} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Edit Post' : 'Create Post'}</h1>
          <p className="text-sm text-muted-foreground">Draft your content and set when it goes live.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b flex items-center justify-between">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Content</Label>
              <div className={`text-xs font-mono ${isOverLimit ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {characterCount} chars
              </div>
            </div>
            <CardContent className="p-0">
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to share?"
                className="min-h-[200px] border-0 rounded-none focus-visible:ring-0 text-base resize-y p-6 leading-relaxed"
              />
            </CardContent>
            <div className="px-6 py-4 bg-muted/10 border-t flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Image URL (optional)" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="bg-transparent border-border/50"
                />
              </div>
              <div className="flex items-center gap-3">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Hashtags (comma separated)" 
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="bg-transparent border-border/50 font-mono text-sm"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <div className="px-6 py-4 border-b bg-muted/30">
              <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Distribution</Label>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-xs text-muted-foreground">Select Platforms</Label>
                <ToggleGroup type="multiple" value={platforms} onValueChange={(v) => { if(v.length) setPlatforms(v) }} className="flex flex-wrap gap-2 justify-start">
                  {PLATFORMS.map(p => (
                    <ToggleGroupItem 
                      key={p} 
                      value={p} 
                      className={`w-12 h-12 rounded-xl border-2 transition-all ${platforms.includes(p) ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                      aria-label={`Toggle ${p}`}
                    >
                      <PlatformIcon platform={p} className="w-5 h-5" />
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-xs text-muted-foreground">Schedule Time</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    type="date" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <Input 
                    type="time" 
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleSubmit('draft')}
              disabled={createPost.isPending || updatePost.isPending}
            >
              Save Draft
            </Button>
            <Button 
              className="flex-1 shadow-sm bg-gradient-viral text-white hover:opacity-90 border-0"
              onClick={() => handleSubmit('scheduled')}
              disabled={createPost.isPending || updatePost.isPending}
            >
              {createPost.isPending || updatePost.isPending ? 'Saving...' : 'Schedule'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
