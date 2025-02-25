import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import { Feedback } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TodayIcon from "@mui/icons-material/Today";
import EventIcon from "@mui/icons-material/Event";
import HistoryIcon from "@mui/icons-material/History";
import ListFeedback from "./layouts/feedback/listFeedback";
import FeedbackListManager from "./layouts/feedback/listFeedbackManager";
import CollaborateursList from "./layouts/listeCollaborateur";
import IssuesList from "./layouts/issues";
import CongesList from "./layouts/conges";
import Pointage from "layouts/pointage/journalier";
import Historique from "layouts/pointage/historique";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Utilisateurs",
    key: "Utilisateurs",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/utilisateurs",
    component: <Tables />,
    roles: ["ROLE_ADMIN"],
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    roles: ["ROLE_COLLABORATEUR"],
  },
  {
    type: "collapse",
    name: "Feedback",
    key: "listFeedback",
    icon: <Feedback fontSize="small" />,
    route: "/feedback",
    component: <FeedbackListManager />,
    roles: ["ROLE_MANAGER"],
  },
  {
    type: "collapse",
    name: "Issues",
    key: "issues",
    icon: <Icon fontSize="small">task</Icon>,
    route: "/issues",
    component: <IssuesList />,
    roles: ["ROLE_MANAGER"],
  },
  {
    type: "collapse",
    name: "Feedback",
    key: "listfeedback",
    icon: <Feedback fontSize="small" />,
    route: "/feedback",
    component: <ListFeedback />,
    roles: ["ROLE_COLLABORATEUR"],
  },
  {
    type: "collapse",
    name: "Collaborateurs",
    key: "collaborateursList",
    icon: <Icon fontSize="small">group</Icon>,
    route: "/collaborateurs",
    component: <CollaborateursList />,
    roles: ["ROLE_MANAGER"],
  },
  {
    type: "collapse",
    name: "Pointages",
    key: "pointage",
    icon: <AccessTimeIcon fontSize="small" />,
    route: "/pointage",
    roles: ["ROLE_MANAGER"],
    subRoutes: [
      {
        type: "collapse",
        key: "Journalier",
        icon: <EventIcon fontSize="small" />,
        roles: ["ROLE_MANAGER"],
        name: "Journalier",
        route: "/journalier",
        component: <Pointage />,
      },
      {
        icon: <HistoryIcon fontSize="small" />,
        name: "Historique",
        route: "/historique",
        component: <Historique />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Congés",
    key: "conge",
    icon: <TodayIcon fontSize="small" />,
    route: "/congé",
    component: <CongesList />,
    roles: ["ROLE_MANAGER"],
  },
];

export default routes;
