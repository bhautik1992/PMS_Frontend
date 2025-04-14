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
import CanAccess from '../../helper/CanAccess';
import { PERMISSION_ACTION } from '../../helper/constants'
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

const Dashboard = lazy(() => import("../../views/Dashboard"));
const Login = lazy(() => import("../../views/Login"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const ResetPassword = lazy(() => import("../../views/ResetPassword"));
const Profile = lazy(() => import("../../views/Profile"));
const Settings = lazy(() => import("../../views/Settings"));
const Employee = lazy(() => import("../../views/Employee"));
const EmployeeCreate = lazy(() => import("../../views/Employee/Create"));
const Role = lazy(() => import("../../views/Role"));
const Permissions = lazy(() => import("../../views/Permissions"));
const Project = lazy(() => import("../../views/Project"));
const ProjectCreate = lazy(() => import("../../views/Project/Create"));
const Task = lazy(() => import("../../views/Task"));
const TaskCreate = lazy(() => import("../../views/Task/Create"));
const Error = lazy(() => import("../../views/Error"));
const NoRecord = lazy(() => import("../../views/NoRecord"));
const NotAuthorized = lazy(() => import("../../views/NotAuthorized"));
const TimeEntry = lazy(() => import("../../views/TimeEntry"));
const Holiday = lazy(() => import("../../views/Holidays/index.js"));
const Countries = lazy(() => import("../../views/Country"));
// const CountryUpdate = lazy(() => import("../../views/Country/UpdateCountry.js"));
const Clients = lazy(() => import("../../views/Clients"));
const ClientCreate = lazy(() => import("../../views/Clients/Create"));

const Routes = [
    {
        path: "/",
        index: true,
        element: <Navigate replace to={DefaultRoute} />,
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.DASHBOARD} type="route">
                    <Dashboard />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/employee",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.EMPLOYEE} type="route">
                    <Employee />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/employee/create",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.EMPLOYEE_CREATE} type="route">
                    <EmployeeCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/employee/edit/:id",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.EMPLOYEE_EDIT} type="route">
                    <EmployeeCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/clients",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.CLIENTS} type="route">
                    <Clients />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/client/create",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.CLIENT_CREATE} type="route">
                    <ClientCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/client/edit/:id",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.CLIENT_EDIT} type="route">
                    <ClientCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/roles",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.ROLES} type="route">
                    <Role />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/permissions",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.PERMISSIONS} type="route">
                    <Permissions />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/projects",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.PROJECTS} type="route">
                    <Project />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/project/create",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.PROJECT_CREATE} type="route">
                    <ProjectCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/project/edit/:id",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.PROJECT_EDIT} type="route">
                    <ProjectCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/tasks",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.TASKS} type="route">
                    <Task />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/tasks/create",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.TASK_CREATE} type="route">
                    <TaskCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/task/edit/:id",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.TASK_EDIT} type="route">
                    <TaskCreate />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/time_entry",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.TIME_ENTRY} type="route">
                    <TimeEntry />
                </CanAccess>
            </PrivateRoute>
        ),
    },

    {
        path: "/holidays",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.HOLIDAYS} type="route">
                    <Holiday />
                </CanAccess>
          </PrivateRoute>
        ),
      },
      {
        path: "/countries",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.COUNTRIES} type="route">
                    <Countries />
                </CanAccess>
            </PrivateRoute>
        ),
      },
    //   {
    //     path: "/countries/update/:id",
    //     element: (
    //       <PrivateRoute>
    //         <CountryUpdate />
    //       </PrivateRoute>
    //     ),
    // },

    {
        path: "/profile",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.PROFILE} type="route">
                    <Profile />
                </CanAccess>
            </PrivateRoute>
        ),
    },
    {
        path: "/settings",
        element: (
            <PrivateRoute>
                <CanAccess permission={PERMISSION_ACTION.SETTINGS} type="route">
                    <Settings />
                </CanAccess>
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
        path: "/forgot_password",
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
        path: "/reset_password",
        element: (
            <AccessibleRoute>
                <ResetPassword />
            </AccessibleRoute>
        ),
        meta: {
        layout: "blank",
        },
    },
    {
        path: "/not-found",
        element: <NoRecord />,
        meta: {
        layout: "blank",
        },
    },
    {
        path: "/not-authorized",
        element: <NotAuthorized />,
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
    }
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
