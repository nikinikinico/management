// 混入对象
import store from '@/store'
export default {
  methods: {
    // 检查权限，要么有，要么没有
    checkPermission (key) {
      // 去用户的信息里找有没有key
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      } else {
        return false
      }
    }
  }
}
