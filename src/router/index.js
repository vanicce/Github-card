import { createWebHistory, createRouter } from "vue-router";
import Home from "../pages/Index.vue";
import CardPage from "../pages/cardPage.vue";
import Repos from "../pages/Repos.vue";
import NotFound from "../pages/404Page.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/card",
    name: "card",
    component: CardPage,
  },
  {
    path: "/repos",
    name: "repos",
    component: Repos,
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
