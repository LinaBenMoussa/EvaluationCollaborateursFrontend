import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import { Feedback } from "@mui/icons-material";
import AddUser from "layouts/add-user";
import ListFeedback from "./layouts/feedback/listFeedback";
import FeedbackListManager from "./layouts/feedback/listFeedbackManager";
import CollaborateursList from "./layouts/listeCollaborateur";
import IssuesList from "./layouts/issues";
import Pointage from "layouts/pointage";

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
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
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
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
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
    name: "Add User",
    key: "addUser",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/user",
    component: <AddUser />,
    roles: ["ROLE_ADMIN"],
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
    icon: <Icon fontSize="small">time</Icon>,
    route: "/pointage",
    component: <Pointage />,
    roles: ["ROLE_MANAGER"],
  },
];

export default routes;
