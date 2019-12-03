import Vue from "vue";
import VueRouter from "vue-router";
import Video from "../components/video";
import Envir from "../components/envir";
import Home from "../components/home"
Vue.use(VueRouter);
export default new VueRouter({
    routes: [
        { path: "/home", component: Home },
        { path: "/video", component: Video },
        { path: "/envir", component: Envir },
         { path: "*", redirect: "/home" }
    ],
    mode: 'hash',
    scrollBehavior (to, from, savedPosition){
	    if (savedPosition) {
	      return savedPosition
	    } else {
	      return { x: 0, y: 0 }
	    }
	  }
})