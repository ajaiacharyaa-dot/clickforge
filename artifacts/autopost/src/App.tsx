import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppLayout } from '@/components/layout/app-layout';

import Dashboard from '@/pages/dashboard';
import PostsList from '@/pages/posts';
import PostForm from '@/pages/posts/form';
import DmsList from '@/pages/dms';
import DmForm from '@/pages/dms/form';
import CalendarView from '@/pages/calendar';
import Platforms from '@/pages/platforms';

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        
        <Route path="/posts" component={PostsList} />
        <Route path="/posts/new" component={PostForm} />
        <Route path="/posts/:id" component={PostForm} />
        
        <Route path="/dms" component={DmsList} />
        <Route path="/dms/new" component={DmForm} />
        <Route path="/dms/:id" component={DmForm} />
        
        <Route path="/calendar" component={CalendarView} />
        <Route path="/platforms" component={Platforms} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
