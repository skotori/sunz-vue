<template>
  <div>
    <el-container>
      <el-aside width="auto">
        <!-- 导航菜单 -->
        <el-menu class="menu"
                 :router="true"
                 :unique-opened="true"
                 :default-active="active"
                 :collapse="isCollapse">
          <!-- 菜单树行组件，递归动态加载菜单 -->
          <menuTree v-for="item in menu"
                    :key="item.id"
                    :menu="item"></menuTree>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header height="50px"
                   class="header">
          <i :class="isCollapse? 'el-icon-s-unfold': 'el-icon-s-fold'"
             class="collapseIcon"
             @click="handleCollapse"></i>
          <el-dropdown trigger="click">
            <el-avatar :src="user.avatar"
                       :size="30"
                       @error="true"
                       class="avatar">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
            <el-dropdown-menu slot="dropdown"
                              class="dropdown">
              <el-dropdown-item disabled
                                class="account">{{user.account}}</el-dropdown-item>
              <el-dropdown-item>用户信息</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <el-tabs v-model="active"
                   type="card"
                   closable
                   @tab-remove="removeTab"
                   @tab-click="clickTab">
            <el-tab-pane v-for="item in tabs"
                         :key="item.name"
                         :label="item.title"
                         :name="item.name">
            </el-tab-pane>
            <router-view></router-view>
          </el-tabs>
        </el-main>
        <el-footer height="50px">
          <span>sunz-vue version-0.1.0 copyright@<a href="https://github.com/skotori">skotori</a></span>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import menuTree from '../../components/menuTree/index'

export default {
  name: 'layout',
  components: {
    menuTree
  },
  data () {
    return {
      isCollapse: false,
      menu: [],
      active: '',
      tabs: [],
      user: ''
    }
  },
  mounted () {
    this.menu = this.$store.getters.getMenu
    this.active = this.$route.name
    this.tabs = this.$store.getters.getTabs
    this.user = this.$store.getters.getUser
  },
  watch: {
    $route (to, from) {
      this.active = this.$route.name
      this.tabs = this.$store.getters.getTabs
    }
  },
  methods: {
    handleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    removeTab (targetName) {
      let active = this.active
      let tabs = this.tabs
      if (active === targetName) {
        tabs.forEach((item, index) => {
          if (item.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              active = nextTab.name
            }
          }
        })
      }
      this.$store.dispatch('removeTab', targetName).then(tabs => {
        if (!tabs.length) {
          let tab = {
            title: '仪表盘',
            name: 'dashboard'
          }
          this.$store.dispatch('addTab', tab).then(() => {
            this.$router.push('/dashboard')
          })
        } else {
          this.tabs = tabs
          this.$router.push(active)
        }
      })
    },
    clickTab (tab) {
      this.$router.push(tab.name)
    },
    logout () {
      this.$store.dispatch('logout').then(() => {
        window.location.reload()
      })
    }
  }
}
</script>

<style>
.el-aside {
  height: 100vh;
}

.menu {
  height: 100%;
}

.menu:not(.el-menu--collapse) {
  width: 200px;
}

.el-header {
  padding: 0px;
  border-bottom: solid 1px #e6e6e6;
}

.header {
  display: flex;
  justify-content: space-between;
}

.collapseIcon {
  font-size: 30px;
  cursor: pointer;
  margin: 10px;
}

.avatar {
  cursor: pointer;
  margin: 10px;
}

.dropdown {
  margin: 0px;
  padding: 0px;
}

.account {
  border-bottom: solid 1px #e6e6e6;
}

/* 重写element标签页样式 */
.el-tabs__header {
  margin: 0px;
}

.el-main {
  padding: 0px;
}

.el-footer {
  padding: 0px;
  border-top: solid 1px #e6e6e6;
  text-align: center;
  line-height: 50px;
}
</style>
