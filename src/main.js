import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import PubSub from 'pubsub-js'
import './plugins/element'

import "element-ui/lib/theme-chalk/index.css";
import "./assets/index.css";

Vue.config.productionTip = false;

Vue.filter('playTimeFormat', function(originVal) {
  let duration = originVal
  let min = parseInt(duration / 1000 / 60)
  let sec = parseInt(duration / 1000 % 60)
  min = min < 10 ? '0' + min : min
  sec = sec < 10 ? '0' + sec : sec
  return `${min}:${sec}`
})

Vue.filter('playNumFormat', function(playCount) {
  if (playCount > 100000) {
    return parseInt(playCount / 10000) + '万'
  }
  return playCount
})

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.$pubSub = PubSub

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
