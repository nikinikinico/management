// 员工的路由规则
import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees', // 后面会在做权限的时候用到
  component: Layout,
  children: [{
    path: '', // 这里什么都不写表示二级路由的默认路由
    component: () => import('@/views/employees'),
    name: 'employees',
    // 路由的元信息
    meta: {
      title: '员工', // 这里用title因为左侧导航读取了这里的title属性
      icon: 'people'
    }
  },
  {
    path: 'detail/:id',
    component: () => import('@/views/employees/detail'),
    hidden: true,
    meta: {
      title: '员工详情'
    }
  },
  {
    path: 'print/:id',
    component: () => import('@/views/employees/print-info'),
    hidden: true,
    meta: {
      title: '打印',
      icon: 'people'
    }
  }
  ]
}
