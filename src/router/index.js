import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/Index.vue";
import Retro from "../pages/Retro.vue";
import NotFound from "../pages/404Page.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/r/:user",
    name: "retro",
    component: Retro,
  },
  {
    path: "/card/:user",
    redirect: (to) => ({ name: "retro", params: { user: to.params.user } }),
  },
  {
    path: "/repos",
    redirect: "/",
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
