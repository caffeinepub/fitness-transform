import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import WalkTrackingPage from './pages/WalkTrackingPage';
import TransformationPage from './pages/TransformationPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import TasksPage from './pages/TasksPage';
import PartnerPage from './pages/PartnerPage';
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
  component: () => (
    <ErrorBoundary componentName="LoginPage">
      <LoginPage />
    </ErrorBoundary>
  ),
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

// All protected routes with error boundaries
const indexRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/',
  component: () => (
    <ErrorBoundary componentName="LandingPage">
      <LandingPage />
    </ErrorBoundary>
  ),
});

const walkRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/walk',
  component: () => (
    <ErrorBoundary componentName="WalkTrackingPage">
      <WalkTrackingPage />
    </ErrorBoundary>
  ),
});

const transformRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/transform',
  component: () => (
    <ErrorBoundary componentName="TransformationPage">
      <TransformationPage />
    </ErrorBoundary>
  ),
});

const statsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/stats',
  component: () => (
    <ErrorBoundary componentName="StatsPage">
      <StatsPage />
    </ErrorBoundary>
  ),
});

const partnerRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/partner',
  component: () => (
    <ErrorBoundary componentName="PartnerPage">
      <PartnerPage />
    </ErrorBoundary>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/settings',
  component: () => (
    <ErrorBoundary componentName="SettingsPage">
      <SettingsPage />
    </ErrorBoundary>
  ),
});

const tasksRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/tasks',
  component: () => (
    <ErrorBoundary componentName="TasksPage">
      <TasksPage />
    </ErrorBoundary>
  ),
});

const upperBodyRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/upper-body',
  component: () => (
    <ErrorBoundary componentName="ExerciseCategoryPage (Upper Body)">
      <ExerciseCategoryPage category="Upper Body" />
    </ErrorBoundary>
  ),
});

const lowerBodyRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/lower-body',
  component: () => (
    <ErrorBoundary componentName="ExerciseCategoryPage (Lower Body)">
      <ExerciseCategoryPage category="Lower Body" />
    </ErrorBoundary>
  ),
});

const coreRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/core',
  component: () => (
    <ErrorBoundary componentName="ExerciseCategoryPage (Core)">
      <ExerciseCategoryPage category="Core" />
    </ErrorBoundary>
  ),
});

const cardioRoute = createRoute({
  getParentRoute: () => protectedRootRoute,
  path: '/exercises/cardio',
  component: () => (
    <ErrorBoundary componentName="ExerciseCategoryPage (Cardio)">
      <ExerciseCategoryPage category="Cardio" />
    </ErrorBoundary>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  protectedRootRoute.addChildren([
    indexRoute,
    walkRoute,
    transformRoute,
    statsRoute,
    partnerRoute,
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
    <ErrorBoundary componentName="App Root">
      <ProfileProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ProfileProvider>
    </ErrorBoundary>
  );
}
