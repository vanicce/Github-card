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
    path: "/card/:user",
    name: "card",
    component: Retro,
  },
  {
    path: "/r/:user",
    redirect: (to) => ({ name: "card", params: { user: to.params.user } }),
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
