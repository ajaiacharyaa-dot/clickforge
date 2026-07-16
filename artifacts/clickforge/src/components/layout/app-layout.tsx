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
} from '@/components/ui/sidebar';
import { 
  Send, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  Settings2,
  PenSquare,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: 'Thumbnail Generator', href: '/', icon: ImageIcon },
    { name: 'Posts', href: '/posts', icon: Send },
    { name: 'Direct Messages', href: '/dms', icon: MessageSquare },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Platforms', href: '/platforms', icon: Settings2 },
  ];

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
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.href || (location.startsWith(item.href) && item.href !== '/')}
                    tooltip={item.name}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
