<template>
  <div>
    <div class="logo">logo</div>
    <el-menu
      mode="vertical"
      :default-active="activeMenu"
      :collapse="store.getters.getSidebarOpened"
      :unique-opened="false"
      :collapse-transition="true"
    >
      <template v-for="route in routes" :key="`route-${route.path}`">
        <router-link v-if="!(route.children && route.children.length)" :to="route.path">
          <el-menu-item :index="route.path">
            <i class="el-icon-menu"></i>
            <template #title>{{ route.meta.title }}</template>
          </el-menu-item>
        </router-link>
        <el-submenu :index="route.path" v-else>
          <template #title>
            <i class="el-icon-location"></i>
            <span>{{ route.meta.title }}</span>
          </template>
          <router-link v-for="subroute in route.children" :key="`subroute-${subroute.path}`" :to="subroute.path">
            <el-menu-item
              :index="subroute.path"
              ><span>{{ subroute.meta.title }}</span>
            </el-menu-item>
          </router-link>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { routes } from "/src/router.js";

const store = useStore();
const route = useRoute();
const activeMenu = computed(() => {
  const { meta, path } = route;
  if (meta.activeMenu) {
    return meta.activeMenu;
  }
  return path;
});
</script>
<style scoped>
.logo {
  height: 60px;
}
</style>