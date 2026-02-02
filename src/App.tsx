import { Refine, Authenticated } from "@refinedev/core";
import routerProvider, { NavigateToResource } from "@refinedev/react-router";
import { dataProvider } from "./providers/data-provider";
import PostShow from "./pages/posts/show";
import PostUpdate from "./pages/posts/update";
import PostList from "./pages/posts/list";
import PostCreate from "./pages/posts/create";
import { authProvider } from "./providers/auth-provider";

import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, GlobalStyles } from "@mui/material";
import {
  ThemedLayout,
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";

import { AuthPage } from "./pages/auth";
import { ThemedTitle } from "./components/layout/title";
import { theme } from "./themes";
//import { Provider } from "react-redux";
//import { store } from "../store";
import BookIcon from "@mui/icons-material/Book";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import SettingsPage from "./pages/settings";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
        <RefineSnackbarProvider>
          <Refine
            dataProvider={dataProvider}
            authProvider={authProvider}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              { name: "Blog", meta: { icon: <BookIcon /> } },
              {
                name: "posts",
                list: "/posts",
                create: "/posts/create",
                show: "/posts/show/:id",
                edit: "/posts/edit/:id",
                meta: {
                  label: "Posts",
                  parent: "Blog",
                  icon: <ArticleIcon />,
                },
              },
              {
                name: "categories",
                list: "/category",
                create: "/category/create",
                edit: "/category/edit/:id",
                show: "/category/show/:id",
                meta: {
                  label: "Categories",
                  icon: <CategoryIcon />,
                  parent: "Blog",
                },
              },
              {
                name: "settings",
                list: "/settings",
                meta: { label: "Settings", icon: <SettingsIcon /> },
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
                <Route index element={<Dashboard />} />
                <Route path="/posts">
                  <Route index element={<PostList />} />
                  <Route path="show/:id" element={<PostShow />} />
                  <Route path="edit/:id" element={<PostUpdate />} />
                  <Route path="create" element={<PostCreate />} />
                </Route>

                <Route path="/category">
                  <Route index element={<CategoryList />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="create" element={<CategoryCreate />} />
                </Route>
                <Route path="/settings" element={<SettingsPage />} />
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
