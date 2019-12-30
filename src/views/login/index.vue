<template>
  <div class="loginPage">
    <el-card>
      <el-form ref="loginForm"
               status-icon
               :rules="loginRules"
               :model="loginForm">
        <div class="loginTitel"><span>登录</span></div>
        <el-form-item prop="account">
          <el-input v-model="loginForm.account"
                    placeholder="请输入账号"
                    prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password"
                    type="password"
                    autocomplete="off"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-key"></el-input>
        </el-form-item>
        <div>
          <el-button type="primary"
                     @click="login"
                     :loading="loading"
                     class="loginButton">登录</el-button>
        </div>
        <div class="loginOther">
          <el-button type="text">注册账号</el-button>
          <el-button type="text">忘记密码</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    login () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push('/')
          })
        } else {
          this.$message.error('账号或密码不能为空')
          return false
        }
      })
    }
  }
}
</script>

<style>
.loginPage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.loginTitel {
  font-size: 24px;
  text-align: center;
  margin-bottom: 22px;
}

.loginButton {
  width: 100%;
}

.loginOther {
  display: flex;
  justify-content: space-between;
}
</style>
