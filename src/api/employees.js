import request from '@/utils/request'

// 获取员工简单数据
export const getEmployeesSimple = () => {
  return request({
    url: '/sys/user/simple'
  })
}

// 获取员工复杂数据
export const getEmployeesInfo = (params) => {
  return request({
    url: '/sys/user',
    params
  })
}

// 删除员工数据
export const delEmployee = (id) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 新增员工
export const addEmployee = (data) => {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

// 批量导入员工
export const importEmployee = (data) => {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 保存个人基本信息
export const saveUserDetailById = data => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/* 分配角色 */
export function assignRoles (data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
