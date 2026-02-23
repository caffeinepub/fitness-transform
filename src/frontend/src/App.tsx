import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import WalkTrackingPage from './pages/WalkTrackingPage';
import TransformationPage from './pages/TransformationPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const walkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/walk',
  component: WalkTrackingPage,
});

const transformRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transform',
  component: TransformationPage,
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stats',
  component: StatsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  walkRoute,
  transformRoute,
  statsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
