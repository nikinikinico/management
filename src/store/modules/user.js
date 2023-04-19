import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken() || null, // 设置token为共享状态
  userInfo: {} // 定义一个空对象，如果为null，则用getter获取的时候会报错
}
const mutations = {
  setToken (state, token) {
    state.token = token // 将数据设置给vuex
    setToken(token) // 存储到本地cookie
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  setUserInfo (state, data) {
    state.userInfo = data // 这样是响应式
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    // 调用api的结果
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    setTimeStamp() // 设置当前的时间戳
  },
  async getUserInfo (context) {
    const data = await getUserInfo()
    const baseInfo = await getUserDetailById(data.userId) // 用户的详情数据
    const baseResult = { ...data, ...baseInfo }
    context.commit('setUserInfo', baseResult) // 提交到mutation
    return data // 这里是给我们后期做权限的时候做下伏笔
  },
  logout (context) { // 登出操作
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter() // 重置路由
    // 设置权限模块下的初始路由
    // vuex子模块调用子模块，都没加锁的情况可直接调用
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
