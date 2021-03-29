<template>
  <div>
    <el-button type="text" @click="handleOpen">{{store.getters.getSidebarOpened ? '展开' : '收起'}}</el-button>
    <el-breadcrumb separator="/" class="app-breadcrumb">
      <el-breadcrumb-item v-for="item in state.levelList" :key="`path-${item.path}`">
        <a :href="item.path">{{item.meta.title}}</a>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue';
import { useRoute } from "vue-router";
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const state = reactive({levelList: []})
const handleOpen = function(){
  store.commit('setSidebarOpened')
}
const getBreadcrumb = function(){
  let matched = route.matched.filter((item) => item.meta && item.meta.title);
  state.levelList = matched;
}
onMounted(()=>{
  getBreadcrumb()
})
watch(route, (nv)=>{
  getBreadcrumb()
})
</script>
<style scoped>
  .app-breadcrumb{
    display: inline-block;
    margin-left: 32px;
  }
</style>