<template>
  <div id="app" class="">
      <b-container class="bv-example-row ">
      <h1>Welcome to Serpwars Theme</h1>
      <h5>v 1.0.0</h5>
      <div class="spacer"></div>  

        <b-row class="text-center">
          <b-col cols="4">
            <h4>Plugins</h4>
            <plugin-states></plugin-states>
            <br>
            <button class="btn btn-success btn-block" @click="install">Install Plugins</button>
          </b-col>
          <b-col cols="8">
            <elementor-templates></elementor-templates>
          </b-col>
          <b-col cols="4">
          </b-col>
        </b-row>
        <div class="spacer"> </div>
        <advance-custom-field-entries></advance-custom-field-entries>          
        
      </b-container>
  </div>
</template>

<script>

import Toastify from 'toastify-js'
import { mapState, mapActions } from 'vuex'
import PluginStates from './components/PluginStates.vue'
import AdvanceCustomFieldEntries from './components/AdvanceCustomFieldEntries.vue'
import ElementorTemplates from './components/ElementorTemplates.vue'
export default {
  name: 'App',
  components: {
      PluginStates,AdvanceCustomFieldEntries,ElementorTemplates
  },
  methods:{
     ...mapActions(['loadData','install']),
  },
  async created(){
    await this.loadData();
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.spacer{
  margin-top:50px;
}
</style>
