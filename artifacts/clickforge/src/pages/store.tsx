import React from 'react';
import { ShoppingBag, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function StoreForgePage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto">
      <div className="w-24 h-24 rounded-3xl bg-gradient-viral flex items-center justify-center text-white shadow-xl mb-8">
        <ShoppingBag className="w-12 h-12" />
      </div>
      
      <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-widest uppercase mb-6">
        Coming Soon
      </div>
      
      <h1 className="text-5xl font-bold tracking-tight mb-6">StoreForge</h1>
      
      <p className="text-xl text-muted-foreground leading-relaxed mb-12">
        All-in-one commerce infrastructure for creators. Sell digital products, host courses, manage memberships, and build high-converting AI sales funnels.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full max-w-2xl mb-12">
        {[
          "Digital product hosting",
          "Course & Membership builder",
          "AI-optimized checkout flows",
          "Built-in CRM & Email Marketing"
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
        onClick={() => toast.success("You'll be notified when StoreForge launches!")}
      >
        <Bell className="w-5 h-5 mr-2" />
        Notify Me When Live
      </Button>
    </div>
  );
}