import Home from "../page/Home";
import User from "../page/User";
import Users from "../page/Users";
import Error404 from "../page/Error404";

export default [
  {
    path: "/users",
    exact: true,
    page: Users,
  },
  {
    path: "/:id",
    exact: true,
    page: User,
  },
  {
    path: "/",
    exact: true,
    page: Home,
  },
  {
    path: "*",
    page: Error404,
  },
];
