<template>
  <h1>{{ msg }}</h1>

  <!-- <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a> |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p> -->

  <button @click="state.count++">count is: {{ state.count }}</button>
  <div>
    <button @click="inc">count2 is: {{count2}}</button>
    <p>computedTwiceTheCount2: {{computedTwiceTheCount2}}</p>
    <p>watchThriceTheCount2: {{watchThriceTheCount2}}</p>
  </div>
  <div>
    <p v-for="(item, i) in list.list" :key="`key-${item}`">
      item: {{item}}&nbsp;&nbsp;i: {{i}}
    </p>
  </div>
  <button @click="changeList">changeList</button>
  <!-- <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p> -->
  <Foo/>
  <Bar/>
  <component :is="ok ? Foo : Bar"/>
  <input v-on:keyup.h="showHelpText" />
</template>

<script setup>
import { defineProps, reactive, ref, computed, watch } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'
defineProps({
  msg: String
})

const state = reactive({ count: 0 })

const count2 = ref(0)
const ok = ref(false)

const computedTwiceTheCount2 = computed(()=>count2.value*2)

let watchThriceTheCount2 = ref(0);
watch(count2, (nv, ov)=>{watchThriceTheCount2.value = nv*3})

function inc(){
  count2.value++;
}

const list = reactive({list: [1, 2, 3]})

function changeList(){
  let d = Math.round(Math.random() * (100 - 10) + 10);
  list.list.push(d)
}
function showHelpText(...args) {
  console.log(...args)
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>