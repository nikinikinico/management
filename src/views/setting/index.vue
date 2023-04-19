<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="heigth:60px;margin-bottom: 15px;">
              <el-button icon="el-icon-plus" size="small" type="primary" @click="showDialog=true">新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column width="300" align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRole(row.id)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination :current-page="page.page" :page-size="page.pagesize" :total="page.total"
                             layout="prev,pager,next" @current-change="changePage"></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false">
            </el-alert>
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增/编辑角色弹窗 -->
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="90px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6" style="text-align:center">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确认</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <el-tree ref="permTree" :data="permData" :props="defaultProps" :show-checkbox="true" :check-strictly="true"
               :default-expand-all="true" :default-checked-keys="selectCheck" node-key="id" />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  delRole,
  getRoleInfo,
  editRoleInfo,
  addRole,
  assignPerm
} from '@/api/setting'
import { mapGetters } from 'vuex'
import { tranListToTreeData } from '@/utils'
import { getPermissionList } from '@/api/permission'
export default {
  data() {
    return {
      list: [], // 获取公司的角色列表
      page: {
        // 放置页码等相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      showDialog: false, // 展示弹窗
      showPermDialog: false, // 展示分配角色权限
      formData: {},
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      title: '新增角色信息', // 弹窗标题
      permData: [], // 树形权限数据
      defaultProps: {
        label: 'name'
      },
      selectCheck: [], // 定义一个数据来接收已选中的节点
      roleId: null // 用来记录分配角色的Id
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async delRole(id) {
      try {
        await this.$confirm('确认删除该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        await delRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleInfo(id)
      this.title = '编辑角色信息'
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await editRoleInfo(this.roleForm)
        } else {
          await addRole(this.roleForm)
        }
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields() // 移除校验
      this.showDialog = false
      this.title = '新增角色信息'
    },
    async assignPerm(id) {
      // 分配角色权限
      this.permData = tranListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      const { permIds } = await getRoleInfo(id) // 获取当前角色所有的权限点数据
      this.selectCheck = permIds
      this.showPermDialog = true
    },
    async btnPermOK() {
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId
      })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style>
</style>
