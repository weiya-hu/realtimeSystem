import Vue from "vue";
import VueRouter from "vue-router";
import Video from "../components/video";
import Home from "../components/home"
Vue.use(VueRouter);
export default new VueRouter({
    routes: [
        { path: "/home", component: Home },
        { path: "/video", component: Video },
         { path: "*", redirect: "/home" }
    ]
})