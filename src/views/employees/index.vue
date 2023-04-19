<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- tab页面顶部 -->
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条员工数据</span>
        <template v-slot:after>
          <el-button size="small"
                     type="success"
                     @click="$router.push('/import?type=user')">
            excel导入</el-button>
          <el-button size="small"
                     type="danger"
                     @click="exportEmployee">excel导出
          </el-button>
          <el-button v-if="checkPermission('POINT-USER-ADD')"
                     size="small"
                     type="primary"
                     @click="showDialog=true">
            新增员工
          </el-button>
        </template>
      </page-tools>

      <!-- 表格 -->
      <el-table v-loading="loading"
                border
                :data="list"
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center'}">
        <el-table-column width="50"
                         label="序号"
                         type="index"
                         sortable="" />
        <el-table-column label="姓名"
                         prop="username"
                         sortable="" />
        <el-table-column label="工号"
                         prop="workNumber"
                         sortable="" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img v-imageerror="require('@/assets/common/bigUserHeader.png')"
                 :src="row.staffPhoto"
                 style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                 @click="showQrCode(row.staffPhoto)">
          </template>
        </el-table-column>
        <el-table-column label="聘用形式"
                         prop="formOfEmployment"
                         sortable=""
                         :formatter="formatEmployment" />
        <el-table-column label="部门"
                         prop="departmentName"
                         sortable="" />
        <el-table-column label="入职时间"
                         sortable="">
          <template slot-scope="{row}">
            {{ row.timeOfEntry|formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="账户状态"
                         sortable="">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState===1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         sortable=""
                         fixed="right"
                         width="280">
          <template slot-scope="{row}">
            <el-button type="text"
                       size="small"
                       @click="$router.push(`/employees/detail/${row.id}`)">
              查看</el-button>
            <el-button type="text"
                       size="small">转正
            </el-button>
            <el-button type="text"
                       size="small">调岗
            </el-button>
            <el-button type="text"
                       size="small">离职
            </el-button>
            <el-button type="text"
                       size="small"
                       @click="editRole(row.id)">角色
            </el-button>
            <el-button v-if="checkPermission('delete-employee')"
                       type="text"
                       size="small"
                       @click="delEmployee(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-row type="flex"
              justify="center"
              align="middle"
              style="height:60px">
        <el-pagination layout="prev,pager,next"
                       :page-size="page.size"
                       :current-page="page.page"
                       :total="page.total"
                       @current-change="changePage">
        </el-pagination>
      </el-row>
    </div>
    <AddEmployee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码"
               :visible.sync="showQRdialog">
      <el-row type="flex"
              justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <AddRole ref="addRole"
             :show-role-dialog.sync="showRoleDialog"
             :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeesInfo, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AddRole from './components/add-role.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
export default {
  components: {
    AddEmployee,
    AddRole
  },
  data () {
    return {
      list: [], // 员工列表数据,
      page: {
        page: 1,
        size: 10,
        total: 0
      }, // 页码相关数据
      loading: false,
      showDialog: false, // 新增员工的弹窗
      showQRdialog: false, // 二维码弹层
      showRoleDialog: false, // 分配角色二维码
      userId: null
    }
  },
  created () {
    this.getEmployeesInfo()
  },
  methods: {
    async getEmployeesInfo () {
      this.loading = true
      const { total, rows } = await getEmployeesInfo(this.page)
      this.list = rows
      this.page.total = total
      this.loading = false
    },

    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeesInfo()
    },
    formatEmployment (row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee (id) {
      try {
        await this.$confirm('确定删除此条员工数据吗？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        await delEmployee(id)
        this.getEmployeesInfo()
        this.$message.success('删除员工数据成功')
      } catch (err) {
        console.log(err)
      }
    },
    exportEmployee () {
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      // 懒加载
      import('@/vendor/Export2Excel').then(async (excel) => {
        const { rows } = await getEmployeesInfo({
          page: 1,
          size: this.page.total
        })
        console.log(rows)
        const data = this.formatJson(headers, rows)
        excel.export_json_to_excel({
          header: Object.keys(headers),
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx',
          data,
          multiHeader,
          merges
        })
      })
    },
    // 格式化data
    formatJson (headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const en = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          } else {
            return item[headers[key]]
          }
        })
      })
    },
    showQrCode (url) {
      if (url) {
        this.showQRdialog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole (id) {
      this.userId = id
      await this.$refs.addRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
