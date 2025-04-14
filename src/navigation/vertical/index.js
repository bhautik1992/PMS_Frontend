import {
  FileText,
  Home,
  Octagon,
  Shield,
  CheckSquare,
  Clock,
  Users,
} from "react-feather";

import { PERMISSION_ACTION } from "../../helper/constants";

export default [
  {
    id: "home",
    title: "Dashboard",
    icon: <Home size={20} />,
    navLink: "/home",
    action: PERMISSION_ACTION.DASHBOARD,
  },
  {
    id: "employee",
    title: "Collaborator",
    icon: <Users size={20} />,
    navLink: "/employee",
    action: PERMISSION_ACTION.EMPLOYEE,
  },
  {
    id: "roles",
    title: "Roles",
    icon: <Shield size={20} />,
    navLink: "/roles",
    action: PERMISSION_ACTION.ROLES,
  },
  {
    id: "permission",
    title: "Permission",
    icon: <Octagon size={20} />,
    navLink: "/permission",
    action: PERMISSION_ACTION.PERMISSIONS,
  },
  {
    id: "projects",
    title: "Projects",
    icon: <FileText size={20} />,
    navLink: "/projects",
    action: PERMISSION_ACTION.PROJECTS,
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: <CheckSquare size={20} />,
    navLink: "/tasks",
    action: PERMISSION_ACTION.TASKS,
  },
  {
    id: "time_entry",
    title: "Time Entry",
    icon: <Clock size={20} />,
    navLink: "/time_entry",
    action: PERMISSION_ACTION.TIME_ENTRY,
  },
  {
    id: "holiday",
    title: "Holiday",
    icon: <Clock size={20} />,
    navLink: "/holiday",
    action: PERMISSION_ACTION.TIME_ENTRY,
  },
  {
    id: "countryies",
    title: "Countries",
    icon: <Clock size={20} />,
    navLink: "/countries",
    action: PERMISSION_ACTION.TIME_ENTRY,
  },
];
