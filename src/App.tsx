import { Refine, Authenticated } from '@refinedev/core';
import routerProvider, { NavigateToResource } from '@refinedev/react-router';
import { dataProvider } from './providers/data-provider';
import PostShow from './pages/posts/show';
import PostUpdate from './pages/posts/update';
import PostList from './pages/posts/list';
import PostCreate from './pages/posts/create';
import { authProvider } from './providers/auth-provider';

import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, GlobalStyles } from '@mui/material';
import {
  ThemedLayout,
  RefineSnackbarProvider,
  useNotificationProvider,
} from '@refinedev/mui';

import { AuthPage } from './pages/auth';
import { ThemedTitle } from './components/layout/title';
import { theme } from './themes';

function App() {
  console.log(import.meta.env.VITE_BASE_API_URL)
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: 'posts',
                list: '/posts',
                show: '/posts/:id',
                edit: '/posts/:id/edit',
                create: '/posts/create',
                meta: { label: 'Posts' },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    redirectOnFail="/login"
                  >
                    <ThemedLayout
                      Title={(props) => (
                        <ThemedTitle
                          // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                          {...props}
                          //icon={collapsed ? <MySmallIcon /> : <MyLargeIcon />}
                          text="My Project"
                        />
                      )}
                    >
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="posts" />}
                />
                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path=":id" element={<PostShow />} />
                  <Route path=":id/edit" element={<PostUpdate />} />
                  <Route path="create" element={<PostCreate />} />
                </Route>
              </Route>
              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    <Navigate to="/" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<AuthPage />} />
                <Route
                  path="/register"
                  element={<AuthPage type="register" />}
                />
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
              </Route>
            </Routes>
          </Refine>
        </RefineSnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
