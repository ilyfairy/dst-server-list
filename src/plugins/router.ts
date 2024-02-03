import { RouteRecordRaw, Router, RouterOptions, createRouter, createWebHistory } from "vue-router";

import HomePage from "@/pages/IndexPage.vue";
import ApiPage from "@/pages/ApiDocPage.vue";
import ModsPage from "@/pages/ModsPage.vue";
// import NotFound from "../pages/NotFound.vue";

const routers: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/api",
    name: "Api",
    component: ApiPage,
  },
  {
    path: "/mods",
    name: "Mods",
    component: ModsPage,
  },
  {
    path: "/＞﹏＜",
    name: "NotFound",
    component: () => import("@/pages/NotFound.vue"),
  },
  {
    path: "/:pathMatch(.*)", // 匹配任何其它路径
    redirect: "/＞﹏＜",
  },
];

const options: RouterOptions = {
  history: createWebHistory(),
  routes: routers,
};

const router: Router = createRouter(options);

export default router;
