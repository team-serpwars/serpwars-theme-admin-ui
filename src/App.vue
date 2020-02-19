<template>
  <div id="app" class="">
      <b-container class="bv-example-row ">
      <h1>Welcome to Serpwars Theme</h1>
      <h5>v 1.0.0</h5>
      <div class="spacer"></div>  
      
      <div class="alert alert-primary" role="alert" v-if="installerData.showMessage">
        {{installerData.message}}      
      </div>
      <div class="spacer"></div>  

      <button class="btn btn-default btn-lg border border-secondary mb-2 plugins">Plugins</button>
      <button class="btn btn-default btn-lg border border-secondary mb-2 ml-2 mr-2 templates">Templates</button>
      <button class="btn btn-default btn-lg border border-secondary mb-2 options">Options</button>
      <div class="siema">
        <div> 
          <plugin-states></plugin-states>
          
        </div>
        <div>
          <elementor-templates></elementor-templates>
        </div>
        <div>
          <advance-custom-field-entries></advance-custom-field-entries>  
        </div>
      </div>            
      </b-container>
  </div>
</template>

<script>

import Toastify from 'toastify-js'
import { mapState, mapActions } from 'vuex'
import PluginStates from './components/PluginStates.vue'
import AdvanceCustomFieldEntries from './components/AdvanceCustomFieldEntries.vue'
import ElementorTemplates from './components/ElementorTemplates.vue'
import Siema from 'siema';

export default {
  name: 'App',  
  data(){
      return {
        mySiema:{}
      }
    },
  components: {
      PluginStates,AdvanceCustomFieldEntries,ElementorTemplates
  },
  computed:{
    ...mapState(['installerData']),
  },
  methods:{
     ...mapActions(['loadData','install']),
  },
  async created(){
    await this.loadData();
    this.mySiema = new Siema()

    const btn0 = document.querySelector('.plugins');
    const btn1 = document.querySelector('.templates');
    const btn2 = document.querySelector('.options');

    btn0.addEventListener('click', () => this.mySiema.goTo(0));
    btn1.addEventListener('click', () => this.mySiema.goTo(1));
    btn2.addEventListener('click', () => this.mySiema.goTo(2));
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
