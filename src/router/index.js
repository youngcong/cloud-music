import Vue from "vue";
import VueRouter from "vue-router";

const discovery = () => import("@/views/discovery.vue");
const playlists = () => import("@/views/playlists.vue");
const songs = () => import("@/views/songs.vue");
const mvs = () => import("@/views/mvs.vue");
const result = () => import("@/views/result.vue");
const playlist = () => import("@/views/playlist.vue");
const mv = () => import("@/views/mv.vue");

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect: "/discovery"
  },
  {
    path: "/discovery",
    component: discovery
  },
  {
    path: "/playlists",
    component: playlists
  },
  {
    path: "/playlist",
    component: playlist
  },
  {
    path: "/songs",
    component: songs
  },
  {
    path: "/mvs",
    component: mvs
  },
  {
    path: "/mv",
    component: mv
  },
  {
    path: "/result",
    component: result
  }
];

const router = new VueRouter({
  mode: "hash",
  routes
});

export default router;
