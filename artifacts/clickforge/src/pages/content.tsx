import React, { useState, useEffect } from 'react';
import { PenLine, Copy, Check, Loader2, RotateCw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ContentType {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, '') ?? '';

export default function ContentForgePage() {
  const [types, setTypes] = useState<ContentType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [platform, setPlatform] = useState('YouTube');
  const [length, setLength] = useState('medium');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${BASE}/api/content/types`)
      .then(res => res.json())
      .then(data => {
        if (data.types && data.types.length > 0) {
          setTypes(data.types);
          setSelectedType(data.types[0].id);
        }
      })
      .catch(err => {
        console.error('Failed to fetch content types:', err);
        toast.error('Failed to load content types');
      });
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedContent('');
    
    try {
      const res = await fetch(`${BASE}/api/content/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, topic, tone, platform, length }),
      });
      
      if (!res.ok) throw new Error('Generation failed');
      
      const data = await res.json();
      setGeneratedContent(data.content);
      toast.success('Content generated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const needsPlatform = ['title', 'hook', 'social', 'caption'].includes(selectedType);
  const needsLength = ['script', 'blog', 'email', 'newsletter'].includes(selectedType);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-viral flex items-center justify-center text-white shadow-sm">
          <PenLine className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ContentForge</h1>
          <p className="text-muted-foreground">AI Content Generation Studio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Setup your content generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {types.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col gap-1 text-sm ${
                        selectedType === t.id 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="font-medium">{t.label}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Prompt</Label>
                <Textarea 
                  id="topic"
                  placeholder="e.g., How to start a YouTube channel in 2024"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="resize-none h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Tone of Voice</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual & Conversational</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="inspiring">Inspiring & Motivational</SelectItem>
                    <SelectItem value="educational">Educational & Authoritative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {needsPlatform && (
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="X">X (Twitter)</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="General">General / Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {needsLength && (
                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select value={length} onValueChange={setLength}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long & Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !topic.trim()}
                className="w-full bg-gradient-viral text-white hover:opacity-90 font-bold h-12 mt-4"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Forging Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Output */}
        <div className="lg:col-span-7">
          <Card className="h-full min-h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
              <div>
                <CardTitle>Generated Output</CardTitle>
                <CardDescription>Your AI-crafted content</CardDescription>
              </div>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                    <RotateCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {isGenerating ? (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-muted-foreground p-8">
                  <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
                  <p className="animate-pulse">Crafting your content...</p>
                </div>
              ) : generatedContent ? (
                <div className="h-full p-6">
                  <Textarea 
                    value={generatedContent}
                    readOnly
                    className="w-full h-full min-h-[500px] resize-none font-mono text-sm leading-relaxed bg-muted/10 border-0 focus-visible:ring-0"
                  />
                </div>
              ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <PenLine className="w-8 h-8 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Content Yet</h3>
                  <p className="max-w-xs text-sm">Configure your settings on the left and hit generate to create AI-powered content.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}