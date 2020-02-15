import Vue from 'vue'
import App from './App.vue'
import {store} from './stores/store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false


var test_variable="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, neque. Vel, asperiores. Animi officiis quae cumque quas saepe, quod, culpa, eligendi nihil libero ratione perspiciatis est. Repudiandae tempora, deserunt debitis.";

new Vue({
	store,
  render: h => h(App),
}).$mount('#app')
