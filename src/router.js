/**路由管理 */
import { createRouter, createWebHistory } from 'vue-router'
import Layout from './layout/index.vue'
import MapWidget from '/src/components/map/index.vue'

export const routes = [
  {
    path: '/',
    meta: { title: 'root' },
    component: Layout,
    redirect: 'home',
    children: [
      {
        path: '/home',
        meta: { title: 'home' },
        component: () => import('/src/components/HelloWorld.vue')
      }
    ]
  },
  {
    path: '/map',
    meta: { title: 'map' },
    component: MapWidget,
  },
  {
    path: '/foo-root',
    meta: { title: 'foo-root' },
    component: Layout,
    children: [
      {
        path: '/foo1',
        meta: { title: 'foo1' },
        component: () => import('/src/components/Foo.vue') 
      },{
        path: '/foo2',
        meta: { title: 'foo2' },
        component: () => import('/src/components/Bar.vue') 
      }
    ]
}];
const router = createRouter({
  history: createWebHistory(),
  //    history : createWebHistory(process.env.BASE_URL),
  routes
})

export default router;