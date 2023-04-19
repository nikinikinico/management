const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 头像的快捷访问
  name: state => state.user.userInfo.username, // 建立对于用户名的快捷访问
  userId: state => state.user.userInfo.userId,
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes // 建立权限模块下的快捷访问
}
export default getters
