import { FileText, Home, Octagon, Shield, CheckSquare, Clock, Users, UserCheck, } from "react-feather";
import { FaUmbrellaBeach , FaGlobe , FaRegCalendarCheck} from "react-icons/fa";  
import { PERMISSION_ACTION } from "../../helper/constants";
import { ClipboardList } from 'lucide-react';


export default [{
        id: "dashboard",
        title: "Dashboard",
        icon: <Home size={20} />,
        navLink: "/dashboard",
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
        id: "client",
        title: "Clients",
        icon: <UserCheck size={20} />,
        navLink: "/clients",
        action: PERMISSION_ACTION.CLIENTS,
    },
    {
        id: "roles",
        title: "Roles",
        icon: <Shield size={20} />,
        navLink: "/roles",
        action: PERMISSION_ACTION.ROLES,
    },{
        id: "permissions",
        title: "Permissions",
        icon: <Octagon size={20} />,
        navLink: "/permissions",
        action: PERMISSION_ACTION.PERMISSIONS,
    },{
        id: "projects",
        title: "Projects",
        icon: <FileText size={20} />,
        navLink: "/projects",
        action: PERMISSION_ACTION.PROJECTS,
    },{
        id: "tasks",
        title: "Tasks",
        icon: <CheckSquare size={20} />,
        navLink: "/tasks",
        action: PERMISSION_ACTION.TASKS,
    },{
        id: "time_entry",
        title: "Time Entry",
        icon: <Clock size={20} />,
        navLink: "/time_entry",
        action: PERMISSION_ACTION.TIME_ENTRY,
    },
    {
        id: "holidays",
        title: "Holidays",
        icon: <FaUmbrellaBeach size={20} />,
        navLink: "/holidays",
        action: PERMISSION_ACTION.HOLIDAYS,
    },
    {
        id: "countries",
        title: "Geolocation",
        icon: <FaGlobe size={20} />,
        navLink: "/countries",
        action: PERMISSION_ACTION.COUNTRIES,
    },
    {
        id: "report",
        title: "Report",
        icon: <ClipboardList size={20} />,
        navLink: "/reports",
        action: PERMISSION_ACTION.REPORT,
    },  
    {
        id: "leave",
        title: "Leave",
        icon: <FaRegCalendarCheck size={20} />,
        navLink: "/leave",
        action: PERMISSION_ACTION.LEAVE,
    }
];
