import { useState } from 'react';
import { useGetCalendar } from '@workspace/api-client-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlatformIcon } from '@/components/ui/platform-icon';
import { ChevronLeft, ChevronRight, PenSquare, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  const { data: items, isLoading } = useGetCalendar({
    from: startDate.toISOString(),
    to: endDate.toISOString()
  });

  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Your upcoming schedule at a glance.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={today}>Today</Button>
          <div className="flex items-center bg-card rounded-lg border shadow-sm p-1">
            <Button variant="ghost" size="icon" onClick={prevWeek} className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="px-4 font-medium min-w-[140px] text-center text-sm">
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </div>
            <Button variant="ghost" size="icon" onClick={nextWeek} className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map((day, i) => (
          <div key={i} className="text-center pb-2 border-b-2 border-border/50">
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {format(day, 'EEE')}
            </div>
            <div className={`text-xl font-bold ${isSameDay(day, new Date()) ? 'text-primary' : 'text-foreground'}`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center text-muted-foreground">Loading calendar...</div>
      ) : (
        <div className="grid grid-cols-7 gap-4 min-h-[500px]">
          {days.map((day, i) => {
            const dayItems = items?.filter(item => isSameDay(new Date(item.scheduledAt), day)) || [];
            
            return (
              <div key={i} className={`rounded-xl border border-border/50 p-2 flex flex-col gap-2 ${isSameDay(day, new Date()) ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
                {dayItems.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground/50">Empty</span>
                  </div>
                ) : (
                  dayItems.map(item => (
                    <Link 
                      key={item.id} 
                      href={`/${item.type}s/${item.id}`}
                      className="block group"
                    >
                      <Card className={`p-3 text-left transition-all hover-elevate border-none shadow-sm ${item.type === 'post' ? 'bg-background' : 'bg-background'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-muted-foreground">
                            {format(new Date(item.scheduledAt), 'HH:mm')}
                          </div>
                          <div className="flex gap-0.5">
                            {item.platforms.map(p => (
                              <PlatformIcon key={p} platform={p} className="w-3 h-3 text-muted-foreground" />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs line-clamp-3 leading-relaxed mb-2 font-medium">
                          {item.title}
                        </div>
                        <div className="flex justify-between items-center mt-auto">
                          <div className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            item.status === 'scheduled' ? 'bg-primary/10 text-primary' : 
                            item.status === 'sent' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                            item.status === 'draft' ? 'bg-muted text-muted-foreground' : 'bg-destructive/10 text-destructive'
                          }`}>
                            {item.status}
                          </div>
                          {item.type === 'post' ? 
                            <PenSquare className="w-3 h-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity group-hover:text-primary" /> : 
                            <MessageSquare className="w-3 h-3 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity group-hover:text-primary" />
                          }
                        </div>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
