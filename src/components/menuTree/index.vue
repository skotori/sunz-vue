<template>
  <el-submenu v-if="menu.children"
              :index="menu.code">
    <template slot="title">
      <i :class="menu.icon"></i>
      <span slot="title">{{menu.name}}</span>
    </template>
    <menuTree v-for="item in menu.children"
              :key="item.id"
              :menu="item"></menuTree>
  </el-submenu>
  <el-menu-item v-else
                :index="menu.code">
    <i :class="menu.icon"></i>
    <span slot="title">{{menu.name}}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: 'menuTree',
  props: {
    menu: {
      type: Object,
      required: true
    }
  }
}
</script>
