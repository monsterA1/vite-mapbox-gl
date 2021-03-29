<template>
  <el-button @click="state.count++">count is: {{ state.count }}</el-button>
  <p>computedTwiceTheCount2 is: {{computedTwiceTheCount2}}</p>
  <button @click="changeStoreCount">store count is: {{store.getters.getCount}}</button>
</template>
<script setup>
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  toRefs,
} from "vue";
import { useStore } from "vuex";

const store = useStore();
const state = reactive({ count: 0 });
const computedTwiceTheCount2 = computed(()=>state.count*2)
const changeStoreCount = function(){
  store.commit('setCount', 1)
}
onBeforeMount(() => {
  console.log("onBeforeMount,载入前");
});
onMounted(() => {
  console.log("onMounted,载入中");
});
onBeforeUpdate(() => {
  console.log("onBeforeUpdate,更新前");
});
onUpdated(() => {
  console.log("onUpdated,更新中");
});
</script>