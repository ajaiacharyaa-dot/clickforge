import { Link, useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { 
  Send, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Settings2,
  PenSquare,
  Sparkles,
  Image as ImageIcon,
  Bot,
  PenLine,
  Search,
  Video,
  Mic,
  ShoppingBag,
  Cpu,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AppSidebar() {
  const [location] = useLocation();

  const aiTools = [
    { name: 'Jarvis OS', href: '/jarvis', icon: Bot },
    { name: 'ContentForge', href: '/content', icon: PenLine },
    { name: 'ThumbnailForge', href: '/', icon: ImageIcon },
    { name: 'ResearchForge', href: '/research', icon: Search },
    { name: 'VideoForge', href: '/video', icon: Video, soon: true },
    { name: 'VoiceForge', href: '/voice', icon: Mic, soon: true },
  ];

  const social = [
    { name: 'Posts', href: '/posts', icon: Send },
    { name: 'Direct Messages', href: '/dms', icon: MessageSquare },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Platforms', href: '/platforms', icon: Settings2 },
  ];

  const business = [
    { name: 'StoreForge', href: '/store', icon: ShoppingBag, soon: true },
    { name: 'AgentForge', href: '/agents', icon: Cpu, soon: true },
    { name: 'LearnForge', href: '/learn', icon: GraduationCap, soon: true },
    { name: 'WorkForge', href: '/work', icon: Briefcase, soon: true },
  ];

  const renderGroup = (label: string, items: any[]) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 px-2">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={location === item.href || (location.startsWith(item.href) && item.href !== '/' && item.href !== '/jarvis' && item.href !== '/content' && item.href !== '/research')}
                tooltip={item.name}
              >
                <Link href={item.href} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.soon && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-muted/50 text-muted-foreground border-0 font-medium">SOON</Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-sidebar-foreground w-full">
          <div className="w-8 h-8 bg-gradient-viral rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span>ClickForge</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-4 space-y-4">
        {renderGroup("AI Tools", aiTools)}
        {renderGroup("Social", social)}
        {renderGroup("Business", business)}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <Button asChild className="w-full justify-start shadow-sm bg-gradient-viral text-white hover:opacity-90 border-0" variant="default">
          <Link href="/posts/new">
            <PenSquare className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-[100dvh] w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 flex items-center px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 shrink-0">
            <SidebarTrigger className="mr-2" />
          </header>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
