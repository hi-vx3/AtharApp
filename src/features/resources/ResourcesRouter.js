import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy loaded page components for the resources feature
const DeveloperResourcesPage = lazy(() => import('./DeveloperResourcesPage'));
const VscodeExtensionsPage = lazy(() => import('./VscodeExtensionsPage'));
const TechImmersion = lazy(() => import('../techImmersion/TechImmersion'));
const DocViewerPage = lazy(() => import('./DocViewerPage'));

// Resources feature path constants
export const RESOURCE_ROUTES = {
  DEVELOPER_RESOURCES: '/getstarted',
  VSCODE_EXTENSIONS: '/installtools',
  TECH_IMMERSION: '/joinus',
  DOCS_VIEWER: '/docs',
};

// Function returning resources-related Route elements
export const getResourceRoutes = () => [
  <Route key="getstarted" path={RESOURCE_ROUTES.DEVELOPER_RESOURCES} element={<DeveloperResourcesPage />} />,
  <Route key="installtools" path={RESOURCE_ROUTES.VSCODE_EXTENSIONS} element={<VscodeExtensionsPage />} />,
  <Route key="joinus" path={RESOURCE_ROUTES.TECH_IMMERSION} element={<TechImmersion />} />,
  <Route key="docs" path={RESOURCE_ROUTES.DOCS_VIEWER} element={<DocViewerPage />} />,
];
