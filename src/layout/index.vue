<template>
<div :class="{'sidbar-hide': store.getters.getSidebarOpened}">
  <sidebar class="sidbar-com"></sidebar>
  <div class="main-container">
    <navbar/>
    <app-main />
  </div>
</div>
</template>
<script setup>
import { useStore } from 'vuex';
import Sidebar from './sidebar/index.vue';
import Navbar from './navbar/index.vue';
import appMain from './appMain/index.vue'

const store = useStore();
</script>
<style scoped>
  .sidbar-com{
    position: absolute;
    top: 0;
    left: 0;
    width: 260px;
    height: 100%;
    transition: width 0.28s;
    z-index: 1001;
    overflow: hidden;
  }
  .main-container {
    height: 100%;
    transition: margin-left 0.28s;
    margin-left: 260px;
    position: relative;
    overflow: hidden;
  }
  .sidbar-hide .sidbar-com{
    width: 65px;
  }
  .sidbar-hide .main-container{
    margin-left: 65px;
  }
</style>