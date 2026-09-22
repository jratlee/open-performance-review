import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Compare from '@/pages/compare';
import About from '@/pages/about';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';
import ShowDetailPage from '@/pages/show-detail';
import Shows from '@/pages/shows';
import ImportReview from '@/pages/import-review';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Shows} />
        <Route path="/projects/:projectSlug" component={Shows} />
        <Route path="/projects/:projectSlug/records/:recordSlug" component={ShowDetailPage} />
        <Route path="/projects/:projectSlug/moments/:momentSlug/comparison" component={Compare} />
        <Route path="/import" component={ImportReview} />
        <Route path="/about" component={About} />
        <Route path="/not-found" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
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
