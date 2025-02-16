import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

// @mui icons
import Icon from "@mui/material/Icon";
import { Feedback } from "@mui/icons-material";
import FeedBack from "layouts/feedback";
import AddUser from "layouts/add-user";
import AuthRequired from "./store/slices/RequireAuth";
import ListFeedback from "./layouts/listFeedback";
import FeedbackListManager from "./layouts/listFeedbackManager";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: (
      <AuthRequired>
        <Dashboard />
      </AuthRequired>
    ),
    prtected: true,
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: (
      <AuthRequired>
        <Tables />
      </AuthRequired>
    ),
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
    key: "feedback",
    icon: <Feedback fontSize="small" />,
    route: "/feedback",
    component: <FeedBack />,
    roles: ["ROLE_MANAGER"],
  },
  {
    type: "collapse",
    name: "listFeedbackManager",
    key: "listFeedback",
    icon: <Feedback fontSize="small" />,
    route: "/listFeedback",
    component: <FeedbackListManager />,
    roles: ["ROLE_MANAGER"],
  },
  {
    type: "collapse",
    name: "Add User",
    key: "addUser",
    icon: <Icon fontSize="small">add</Icon>,
    route: "/user",
    component: <AddUser />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
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
];

export default routes;
