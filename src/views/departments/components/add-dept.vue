<template>
  <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeesSimple">
          <el-option v-for="item in people" :key="item.id" :label="item.username" :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 底部操作栏 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :spa="6">
        <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetails,
  updateDepartments
} from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'
export default {
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式，同级部门不能有相同名字
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some((item) => item.name === value)
      } else {
        isRepeat = depts
        // 过滤出该节点下的所有子节点
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value)
      }
      isRepeat
        ? callback(new Error(`同级部门下已经存在${value}部门了`))
        : callback()
    }
    // 检查编码是否重复
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式, 不能有一样的code
        isRepeat = depts
          .filter((item) => item.id !== this.treeNode.id)
          .some((item) => item.code === value && value)
      } else {
        isRepeat = depts.some((item) => item.code === value && value)
      }

      isRepeat
        ? callback(new Error(`组织架构下已经存在编码为${value}的部门了`))
        : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称长度为1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkNameRepeat
          }
        ], // 部门名称
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码长度为1-50个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: checkCodeRepeat
          }
        ], // 部门编码
        manager: [
          { required: true, message: '部门管理员不能为空', trigger: 'blur' }
        ], // 部门管理者
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门编码介绍长度为1-300个字符',
            trigger: 'blur'
          }
        ] // 部门介绍
      },
      people: []
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeesSimple() {
      this.people = await getEmployeesSimple()
    },
    btnOk() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
            console.log('编辑')
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
            console.log('新增')
          }
          this.$emit('addDepts')
          this.$emit('update:showDialog', false) // sync 修饰符语法糖
          // 关闭弹窗的时候会自动触发el-dialog的close时间，即btnCancel事件，里边定义了清除规则，所以这里不用在重复写到
        }
      })
    },
    btnCancel() {
      // resetFields只能重置表单上的数据
      this.formData = {
        name: '',
        code: '',
        anager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.deptForm.resetFields()
    },
    async getDepartDetail(id) {
      this.formData = await getDepartDetails(id)
    }
  }
}
</script>
<style scoped>
</style>
