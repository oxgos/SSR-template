import Vue from 'vue'
import Router from 'vue-router'

const Foo = () => import(/* webpackChunkName: "Foo" */'../components/Foo.vue')
const Bar = () => import(/* webpackChunkName: "Bar" */'../components/Bar.vue')
const Baz = () => import(/* webpackChunkName: "Baz" */'../components/Baz.vue')

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/foo',
        component: Foo
      },
      {
        path: '/bar',
        component: Bar
      },
      {
        path: '/baz',
        component: Baz
      }
    ]
  })
}
