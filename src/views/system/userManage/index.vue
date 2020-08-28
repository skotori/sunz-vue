<template>
  <div class="userManagePage">
    <div class="headBlock">
      <div class="searchBlock">
        <el-input placeholder="请输入账号或者名称"
                  v-model="searchKeyword"
                  clearable
                  @change="search"
                  size="mini"
                  class="searchKeyword">
        </el-input>
        <el-select v-model="searchDept"
                   clearable
                   placeholder="请选择部门"
                   @change="search"
                   size="mini"
                   class="searchDept">
          <el-option v-for="item in deptList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="searchDisabledState"
                   clearable
                   placeholder="请选择禁用状态"
                   @change="search"
                   size="mini"
                   class="searchDisabledState">
          <el-option label="未禁用"
                     :value="0"></el-option>
          <el-option label="已禁用"
                     :value="1"></el-option>
        </el-select>
      </div>
      <el-button type="success"
                 @click="addVisible = true"
                 icon="el-icon-plus"
                 size="mini"
                 round>新 增</el-button>
    </div>

    <el-table :data="userList"
              border
              style="width: 100%"
              v-loading="tableLoading"
              :row-class-name="rowClassName">
      <el-table-column fixed
                       prop="id"
                       label="id"
                       width="50">
      </el-table-column>
      <el-table-column prop="account"
                       label="账号"
                       width="100">
      </el-table-column>
      <el-table-column prop="name"
                       label="名称"
                       width="100">
      </el-table-column>
      <el-table-column prop="icon"
                       label="头像"
                       width="100">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.icon"
                     :size="30"
                     @error="true">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="sex"
                       label="性别"
                       width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sex === 1 ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="birthday"
                       label="生日"
                       width="200">
        <template slot-scope="scope">
          {{ birthdayFormat(scope.row.birthday) }}
        </template>
      </el-table-column>
      <el-table-column prop="email"
                       label="邮箱"
                       width="200">
      </el-table-column>
      <el-table-column prop="tell"
                       label="电话"
                       width="200">
      </el-table-column>
      <el-table-column prop="deptName"
                       label="部门"
                       width="100">
      </el-table-column>
      <el-table-column prop="roles"
                       label="角色"
                       width="200"
                       :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.roles"
                  :key="item.id"
                  size="mini"
                  type="success"
                  disable-transitions>
            {{item.name}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="disabledState"
                       label="禁用状态"
                       width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.disabledState === 1 ? 'danger' : ''"
                  size="mini"
                  disable-transitions>
            {{ scope.row.disabledState === 1 ? '已禁用' : '未禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark"
                       label="备注"
                       width="200">
      </el-table-column>
      <el-table-column prop="createTime"
                       label="创建时间"
                       width="200">
      </el-table-column>
      <el-table-column prop="createUser"
                       label="创建人"
                       width="100">
      </el-table-column>
      <el-table-column prop="updateTime"
                       label="更新时间"
                       width="200">
      </el-table-column>
      <el-table-column prop="updateUser"
                       label="更新人"
                       width="100">
      </el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="200">
        <template slot-scope="scope">
          <el-button @click="openDrawer(scope.row)"
                     type="primary"
                     size="mini"
                     icon="el-icon-edit"
                     round>编 辑</el-button>
          <el-popconfirm title="确定删除此用户吗?"
                         @onConfirm="deleteUser(scope.row)"
                         class="deleteButton">
            <el-button slot="reference"
                       type="danger"
                       size="mini"
                       icon="el-icon-delete"
                       round>删 除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="pageNum"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="pageTotal">
    </el-pagination>

    <el-dialog title="新增用户"
               :visible.sync="addVisible"
               :show-close="false"
               width="1000px"
               :close-on-click-modal="false">
      <el-form ref="addForm"
               :model="addForm"
               label-width="100px"
               status-icon
               :rules="addRules"
               size="mini">
        <el-row>
          <el-col :span="8">
            <el-form-item label="账号"
                          prop="account">
              <el-input v-model="addForm.account"
                        placeholder="请输入账号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码"
                          prop="password">
              <el-input type="password"
                        v-model="addForm.password"
                        placeholder="请输入密码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="确认密码"
                          prop="checkPassword">
              <el-input type="password"
                        v-model="addForm.checkPassword"
                        placeholder="请再次输入密码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称"
                          prop="name">
              <el-input v-model="addForm.name"
                        placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="头像"
                          prop="icon">
              <div class="iconBlock">
                <el-avatar :src="addForm.icon"
                           :size="30"
                           @error="true">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <el-input v-model="addForm.icon"
                          placeholder="请输入头像图片链接"
                          class="iconUrl"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="性别"
                          prop="sex">
              <template>
                <el-radio v-model="addForm.sex"
                          :label="1">男</el-radio>
                <el-radio v-model="addForm.sex"
                          :label="2">女</el-radio>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生日"
                          prop="birthday">
              <el-date-picker v-model="addForm.birthday"
                              type="date"
                              placeholder="请选择生日"
                              value-format="yyyy-MM-dd"
                              clearable>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱"
                          prop="email">
              <el-input v-model="addForm.email"
                        placeholder="请输入邮箱"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电话"
                          prop="tell">
              <el-input v-model="addForm.tell"
                        placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门"
                          prop="deptId">
              <el-select v-model="addForm.deptId"
                         clearable
                         placeholder="请选择部门">
                <el-option v-for="item in deptList"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色"
                          prop="roles">
              <el-select v-model="addForm.roles"
                         multiple
                         clearable
                         value-key="id"
                         placeholder="请选择角色">
                <el-option v-for="item in roleList"
                           :key="item.id"
                           :label="item.name"
                           :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="禁用状态"
                          prop="disabledState">
              <el-switch v-model="addForm.disabledState"
                         active-color="#FF4949"
                         inactive-color="#C0CCDA"
                         :active-value="1"
                         :inactive-value="0">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注"
                          prop="remark">
              <el-input type="textarea"
                        resize="none"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入备注"
                        v-model="addForm.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="add">确 定</el-button>
      </span>
    </el-dialog>

    <el-drawer :title="updateTitle"
               :visible.sync="updateVisible"
               direction="rtl"
               size="500px"
               :show-close="false"
               :wrapperClosable="false">
      <div class="drawerContent">
        <el-form ref="updateForm"
                 :model="updateForm"
                 label-width="60px"
                 status-icon
                 :rules="updateRules"
                 size="mini">
          <el-form-item label="名称"
                        prop="name">
            <el-input v-model="updateForm.name"
                      placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="头像"
                        prop="icon">
            <div class="iconBlock">
              <el-avatar :src="updateForm.icon"
                         :size="30"
                         @error="true">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
              <el-input v-model="updateForm.icon"
                        placeholder="请输入头像图片链接"
                        class="iconUrl"></el-input>
            </div>
          </el-form-item>
          <el-form-item label="性别"
                        prop="sex">
            <template>
              <el-radio v-model="updateForm.sex"
                        :label="1">男</el-radio>
              <el-radio v-model="updateForm.sex"
                        :label="2">女</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="生日"
                        prop="birthday">
            <el-date-picker v-model="updateForm.birthday"
                            type="date"
                            placeholder="请选择生日"
                            value-format="yyyy-MM-dd"
                            clearable>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="邮箱"
                        prop="email">
            <el-input v-model="updateForm.email"
                      placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="电话"
                        prop="tell">
            <el-input v-model="updateForm.tell"
                      placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="部门"
                        prop="deptId">
            <el-select v-model="updateForm.deptId"
                       clearable
                       placeholder="请选择部门">
              <el-option v-for="item in deptList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色"
                        prop="roles">
            <el-select v-model="updateForm.roles"
                       multiple
                       clearable
                       value-key="id"
                       placeholder="请选择角色">
              <el-option v-for="item in roleList"
                         :key="item.id"
                         :label="item.name"
                         :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="禁用状态"
                        prop="disabledState">
            <el-switch v-model="updateForm.disabledState"
                       active-color="#FF4949"
                       inactive-color="#C0CCDA"
                       :active-value="1"
                       :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="备注"
                        prop="remark">
            <el-input type="textarea"
                      resize="none"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入备注"
                      v-model="updateForm.remark">
            </el-input>
          </el-form-item>
        </el-form>
        <div class="drawerFooter">
          <el-button @click="updateVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="updateUser()">确 定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { pageList, userInfoById, deptList, roleList, accountCheck, add, update, deleteById } from '../../../api/system/userManage'

export default {
  name: 'userManage',
  data () {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      } else {
        setTimeout(() => {
          accountCheck(value).then(res => {
            if (res) {
              if (res.data === 1) {
                callback(new Error('账号重复'))
              } else {
                callback()
              }
            }
          })
        }, 1000)
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        let reg = /^[a-zA-Z0-9]{6,8}$/
        if (!reg.test(value)) {
          callback(new Error('密码应由6-8位数字或字母组成'))
        }
        if (this.addForm.checkPassword !== '') {
          this.$refs.addForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else {
        if (value !== this.addForm.password) {
          callback(new Error('两次输入密码不一致!'))
        }
        callback()
      }
    }
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    var validateDeptId = (rule, value, callback) => {
      if (!value || value === null) {
        callback(new Error('部门不能为空'))
      } else {
        callback()
      }
    }
    var validateRoles = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('角色不能为空'))
      } else {
        callback()
      }
    }
    var validateDisabledState = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('状态不能为空'))
      } else {
        callback()
      }
    }
    return {
      searchKeyword: '',
      searchDept: null,
      searchDisabledState: null,
      deptList: [],
      roleList: [],
      addVisible: false,
      addForm: {
        account: '',
        password: '',
        checkPassword: '',
        name: '',
        icon: '',
        sex: null,
        birthday: '',
        email: '',
        tell: '',
        deptId: null,
        roles: [],
        disabledState: 0,
        remark: ''
      },
      addRules: {
        account: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: validateCheckPassword, trigger: 'blur' }
        ],
        name: [
          { required: true, validator: validateName, trigger: 'blur' }
        ],
        deptId: [
          { required: true, validator: validateDeptId, trigger: 'blur' }
        ],
        roles: [
          { required: true, validator: validateRoles, trigger: 'blur' }
        ],
        disabledState: [
          { required: true, validator: validateDisabledState, trigger: 'blur' }
        ]
      },
      tableLoading: false,
      userList: [],
      pageNum: 1,
      pageSize: 10,
      pageTotal: 1,
      updateVisible: false,
      updateTitle: '',
      updateForm: {},
      updateRules: {
        deptId: [
          { required: true, validator: validateDeptId, trigger: 'blur' }
        ],
        roles: [
          { required: true, validator: validateRoles, trigger: 'blur' }
        ],
        disabledState: [
          { required: true, validator: validateDisabledState, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.pageList()
    this.getDeptList()
    this.getRoleList()
  },
  watch: {
    addVisible (val) {
      if (!val) {
        this.$refs.addForm.resetFields()
      }
    },
    updateVisible (val) {
      if (!val) {
        this.$refs.updateForm.resetFields()
      }
    }
  },
  methods: {
    search () {
      this.pageNum = 1
      this.pageList()
    },
    pageList () {
      this.tableLoading = true
      pageList(this.pageNum, this.pageSize, {
        keyword: this.searchKeyword,
        deptId: this.searchDept,
        disabledState: this.searchDisabledState
      }).then(res => {
        if (res) {
          this.userList = res.data.list
          this.pageNum = res.data.pageNum
          this.pageSize = res.data.pageSize
          this.pageTotal = res.data.total
          this.tableLoading = false
        }
      })
    },
    add () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          add(this.addForm).then(res => {
            if (res) {
              this.addVisible = false
              this.$message({
                message: '新增用户成功',
                type: 'success'
              })
              this.pageNum = 1
              this.pageList()
            }
          })
        } else {
          return false
        }
      })
    },
    openDrawer (user) {
      userInfoById(user.id).then(res => {
        if (res) {
          this.updateForm = res.data
          this.updateTitle = '编辑用户-' + res.data.account
          this.updateVisible = true
        }
      })
    },
    updateUser (user) {
      this.$refs.updateForm.validate((valid) => {
        if (valid) {
          update(this.updateForm).then(res => {
            if (res) {
              this.updateVisible = false
              this.$message({
                message: '编辑用户成功',
                type: 'success'
              })
              this.pageNum = 1
              this.pageList()
            }
          })
        } else {
          return false
        }
      })
    },
    deleteUser (user) {
      deleteById(user.id).then(res => {
        if (res) {
          this.$message({
            message: '删除用户成功',
            type: 'success'
          })
          this.pageNum = 1
          this.pageList()
        }
      })
    },
    getDeptList () {
      deptList().then(res => {
        if (res) {
          this.deptList = res.data
        }
      })
    },
    getRoleList () {
      roleList().then(res => {
        if (res) {
          this.roleList = res.data
        }
      })
    },
    birthdayFormat (birthday) {
      let date = new Date(birthday)
      let year = date.getFullYear()
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '年' + month + '月' + day + '日'
    },
    rowClassName ({ row, rowIndex }) {
      if (row.disabledState === 1) {
        return 'warning-row'
      }
      return ''
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageList()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.pageList()
    }
  }
}
</script>

<style>
.userManagePage {
  margin: 10px 10px 0px 10px;
}

.headBlock {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.searchBlock {
  display: flex;
  flex: auto;
}

.searchKeyword {
  flex: 0.1;
}

.searchDept {
  flex: 0.1;
  margin-left: 10px;
}

.searchDisabledState {
  flex: 0.1;
  margin-left: 10px;
}

/* 可以通过指定 Table 组件的 row-class-name 属性来为 Table 中的某一行添加 class，表明该行处于某种状态 */
.el-table .warning-row {
  background: oldlace;
}

/* 重写tag样式 */
.el-tag + .el-tag {
  margin-left: 10px;
}

.deleteButton {
  margin-left: 10px;
}

.iconBlock {
  display: flex;
  justify-content: space-between;
}

.iconUrl {
  margin-left: 10px;
}

.drawerContent {
  padding: 0px 20px 20px 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
}
</style>
