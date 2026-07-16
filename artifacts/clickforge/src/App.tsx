import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { AppLayout } from '@/components/layout/app-layout';

import { Dashboard } from '@/components/Dashboard';
import AuthPage from '@/app/auth/page';
import AuthCallbackPage from '@/app/auth/callback/page';
import PrivacyPage from '@/app/legal/privacy/page';
import TermsPage from '@/app/legal/terms/page';

import PostsList from '@/pages/posts';
import PostForm from '@/pages/posts/form';
import DmsList from '@/pages/dms';
import DmForm from '@/pages/dms/form';
import CalendarView from '@/pages/calendar';
import Platforms from '@/pages/platforms';

import JarvisPage from '@/pages/jarvis';
import ContentForgePage from '@/pages/content';
import ResearchForgePage from '@/pages/research';
import VideoForgePage from '@/pages/video';
import VoiceForgePage from '@/pages/voice';
import StoreForgePage from '@/pages/store';
import AgentForgePage from '@/pages/agents';
import LearnForgePage from '@/pages/learn';
import WorkForgePage from '@/pages/work';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/auth/callback" component={AuthCallbackPage} />
      <Route path="/legal/privacy" component={PrivacyPage} />
      <Route path="/legal/terms" component={TermsPage} />
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/jarvis" component={JarvisPage} />
            <Route path="/content" component={ContentForgePage} />
            <Route path="/research" component={ResearchForgePage} />
            <Route path="/video" component={VideoForgePage} />
            <Route path="/voice" component={VoiceForgePage} />
            <Route path="/store" component={StoreForgePage} />
            <Route path="/agents" component={AgentForgePage} />
            <Route path="/learn" component={LearnForgePage} />
            <Route path="/work" component={WorkForgePage} />
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
      </Route>
    </Switch>
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
