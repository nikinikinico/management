import request from '@/utils/request'
// 获取公司角色信息
export const getRoleList = (params) => {
  return request({
    url: '/sys/role',
    params
  })
}

// 获取公司信息
export const getCompanyInfo = (companyId) => {
  return request({
    url: `/company/${companyId}`
  })
}

// 删除角色信息
export const delRole = (id) => {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 编辑角色信息
export const editRoleInfo = (data) => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 获取角色信息
export const getRoleInfo = (id) => {
  return request({
    url: `/sys/role/${id}`
  })
}

// 新增角色信息
export const addRole = (data) => {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 给角色分配权限
export const assignPerm = (data) => {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
