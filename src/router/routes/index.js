// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";

import PrivateRoute from '../../views/PrivateRoute';
import AccessibleRoute from '../../views/AccessibleRoute';

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route
const DefaultRoute = "/login";

const Home = lazy(() => import("../../views/Home"));
const Login = lazy(() => import("../../views/Login"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const Profile = lazy(() => import("../../views/Profile"));
const Settings = lazy(() => import("../../views/Settings"));
const Employee = lazy(() => import("../../views/Employee"));
const EmployeeCreate = lazy(() => import("../../views/Employee/Create"));
const Role = lazy(() => import("../../views/Role"));
const Permission = lazy(() => import("../../views/Permission"));
const Project = lazy(() => import("../../views/Project"));
const ProjectCreate = lazy(() => import("../../views/Project/Create"));
const Task = lazy(() => import("../../views/Task"));
const TaskCreate = lazy(() => import("../../views/Task/Create"));
const Error = lazy(() => import("../../views/Error"));
const TimeEntry = lazy(() => import("../../views/TimeEntry"));

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    element: <Navigate replace to={DefaultRoute} />,
  },
  {
    path: "/home",
    element: (
        <PrivateRoute>
            <Home />
        </PrivateRoute>
    ),
  },
  {
    path: "/employee",
    element: (
        <PrivateRoute>
            <Employee />
        </PrivateRoute>
    ),
  },
  {
    path: "/employee/create",
    element: (
        <PrivateRoute>
            <EmployeeCreate />
        </PrivateRoute>
    ),
  },
  {
    path: "/employee/edit/:id",
    element: (
        <PrivateRoute>
            <EmployeeCreate />
        </PrivateRoute>
    ),
  },
  {
    path: "/roles",
    element: (
        <PrivateRoute>
            <Role />
        </PrivateRoute>
    ),
  },
  {
    path: "/permission",
    element: (
        <PrivateRoute>
            <Permission />
        </PrivateRoute>
    ),
  },
  {
    path: "/projects",
    element: (
        <PrivateRoute>
            <Project />
        </PrivateRoute>
    ),
  },
  {
    path: "/projects/create",
    element: (
        <PrivateRoute>
            <ProjectCreate />
        </PrivateRoute>
    ),
  },
  {
    path: "/tasks",
    element: (
        <PrivateRoute>
            <Task />
        </PrivateRoute>
    ),
  },
  {
    path: "/tasks/create",
    element: (
        <PrivateRoute>
            <TaskCreate />
        </PrivateRoute>
    ),
  },
  {
    path: "/tasks/edit/:id",
    element: (
        <PrivateRoute>
            <TaskCreate />
        </PrivateRoute>
    ),
  },
  {
    path: "/time_entry",
    element: (
        <PrivateRoute>
            <TimeEntry />
        </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
        <PrivateRoute>
            <Profile />
        </PrivateRoute>
    ),
  },
  {
    path: "/settings",
    element: (
        <PrivateRoute>
            <Settings />
        </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: (
        <AccessibleRoute>
            <Login />
        </AccessibleRoute>
    ),
    meta: {
        layout: "blank",
    },
  },
  {
    path: "/forgot-password",
    element: (
        <AccessibleRoute>
            <ForgotPassword />
        </AccessibleRoute>
    ),
    meta: {
      layout: "blank",
    },
  },
  {
    path: "*",
    element: <Error />,
    meta: {
      layout: "blank",
    },
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
