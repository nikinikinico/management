import request from '@/utils/request'
// 获取部门列表
export const getDepartments = () => {
  return request({
    url: '/company/department'
  })
}

// 删除部门列表
export const delDepartments = (id) => {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增部门
export const addDepartments = (data) => {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 获取部门详情
export const getDepartDetails = (id) => {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑部门数据
export const updateDepartments = (data) => {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
