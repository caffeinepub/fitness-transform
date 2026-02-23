import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import WalkTrackingPage from './pages/WalkTrackingPage';
import TransformationPage from './pages/TransformationPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import TasksPage from './pages/TasksPage';
import ExerciseCategoryPage from './pages/ExerciseCategoryPage';
import ProtectedRoute from './components/ProtectedRoute';

// Root route without protection (for login page)
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Login route (public)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Protected root with Layout
const protectedRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: () => (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  ),
});

// All protected routes
const indexRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/',
  component: LandingPage,
});

const walkRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/walk',
  component: WalkTrackingPage,
});

const transformRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/transform',
  component: TransformationPage,
});

const statsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/stats',
  component: StatsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/settings',
  component: SettingsPage,
});

const tasksRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/tasks',
  component: TasksPage,
});

const upperBodyRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/upper-body',
  component: () => <ExerciseCategoryPage category="Upper Body" />,
});

const lowerBodyRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/lower-body',
  component: () => <ExerciseCategoryPage category="Lower Body" />,
});

const coreRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/core',
  component: () => <ExerciseCategoryPage category="Core" />,
});

const cardioRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/cardio',
  component: () => <ExerciseCategoryPage category="Cardio" />,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRootRoute.addChildren([
    indexRoute,
    walkRoute,
    transformRoute,
    statsRoute,
    settingsRoute,
    tasksRoute,
    upperBodyRoute,
    lowerBodyRoute,
    coreRoute,
    cardioRoute,
  ]),
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
