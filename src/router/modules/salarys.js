
import Layout from '@/layout'

const salaryRouter = {
  path: '/salarys',
  component: Layout,
  name: 'salarys',
  meta: {
    title: '工资',
    icon: 'money'
  },
  children: [
    {
      path: '',
      component: () => import('@/views/salarys'),
      name: 'salarys',
      meta: {
        title: '工资'
      }
    },
    {
      path: 'setting',
      component: () => import('@/views/salarys/setting'),
      name: 'salarysSetting',
      meta: {
        title: '设置'
      }
    },
    {
      path: 'details/:yearMonth/:id',
      component: () => import('@/views/salarys/detail'),
      name: 'salarysDetails',
      meta: {
        title: '详情'
      }
    },
    {
      path: 'historicalArchiving',
      component: () => import('@/views/salarys/historical'),
      name: 'salarysHistorical',
      meta: {
        title: '历史归档'
      }
    },
    {
      path: 'monthStatement',
      component: () => import('@/views/salarys/month'),
      name: 'salarysMonthStatement',
      meta: {
        title: '月报表'
      }
    }
  ]
}
export default salaryRouter
