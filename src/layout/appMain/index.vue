<template>
  <div class="app-main">
    <router-view :key="route.path" />
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route.path)
</script>
<style>
  .app-main{
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>