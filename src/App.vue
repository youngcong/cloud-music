<template>
  <div id="app">
    <link rel="stylesheet" href="//at.alicdn.com/t/font_1654044_7fb6pz0mo1.css">
    <link rel="stylesheet" href="//at.alicdn.com/t/font_1905269_sw1ijd6t8zl.css">
    <top />
    <index />
  </div>
</template>

<script>
import top from "./components/top";
import index from "./components/index";

export default {
  name: "App",
  components: {
    top,
    index
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
