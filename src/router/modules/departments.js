
import Layout from '@/layout'
export default {
  path: '/departments',
  name: 'departments', // 后面会在做权限的时候用到
  component: Layout,
  children: [{
    path: '', // 这里什么都不写表示二级路由的默认路由
    component: () => import('@/views/departments'),
    name: 'departments',
    // 路由的元信息
    meta: {
      title: '组织架构', // 这里用title因为左侧导航读取了这里的title属性
      icon: 'tree'
    }
  }]
}
