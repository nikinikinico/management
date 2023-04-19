
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes // 标识当前用户所以同游的所有路由的数组
}
const mutations = {
  // 定义修改routes的mutation
  setRoutes (state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  filterRoutes (context, menus) {
    const routes = []
    // 筛选出动态路由作用和menus能对上的
    // asyncRoutes是所有的动态路由
    menus.forEach(key => {
      // item就是标识
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // routes是所有模块中满足权限要求的路由数组
    context.commit('setRoutes', routes) // 将动态路由提交给mutation
    return routes // state数据是用来显示左侧菜单用的，return 是给路由addRoutes用的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
