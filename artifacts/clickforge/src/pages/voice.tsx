import React from 'react';
import { Mic, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function VoiceForgePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto">
      <div className="w-24 h-24 rounded-3xl bg-gradient-viral flex items-center justify-center text-white shadow-xl mb-8">
        <Mic className="w-12 h-12" />
      </div>
      
      <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase mb-6">
        Coming Soon
      </div>
      
      <h1 className="text-5xl font-bold tracking-tight mb-6">VoiceForge</h1>
      
      <p className="text-xl text-muted-foreground leading-relaxed mb-12">
        Studio-quality AI voice generation. Clone your own voice, generate multi-speaker podcasts from scripts, and create professional audiobooks in minutes.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full max-w-2xl mb-12">
        {[
          "Ultra-realistic TTS models",
          "1-click Voice Cloning",
          "Automated Podcast generation",
          "Multi-language dubbing"
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card border shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <span className="font-medium">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        size="lg" 
        className="h-14 px-8 text-lg rounded-xl bg-gradient-viral text-white hover:opacity-90 shadow-lg"
        onClick={() => toast.success("You'll be notified when VoiceForge launches!")}
      >
        <Bell className="w-5 h-5 mr-2" />
        Notify Me When Live
      </Button>
    </div>
  );
}