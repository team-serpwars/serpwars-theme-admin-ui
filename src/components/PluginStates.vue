<template>
    <div>   
	<b-list-group>
		<b-list-group-item class="d-flex justify-content-between align-items-center" v-for="plugin  in $store.state.loadedData.plugins">
          
    		<label for="" :class="{
                'text-success': (plugin.isActive && plugin.isInstalled),
                'text-primary': (!plugin.isActive && plugin.isInstalled),
                'text-danger': (!plugin.isActive && !plugin.isInstalled)
            }">
    			<input type="checkbox" v-model="pluginPicked" :value="plugin" v-if="!plugin.isActive ">    		{{plugin.name}} 

                <div class="spinner-border spinner-border-sm text-dark" role="status" v-if="plugin.status!=''">
                    <span class="sr-only">Loading...</span>
                </div>

            </label>
    			<span v-if="plugin.status!=''">
    				<b-badge variant="info" pill v-if="plugin.status=='Processing'">{{plugin.status}}</b-badge>
                    <b-badge variant="secondary" pill v-else-if="plugin.status=='Pending'">{{plugin.status}}</b-badge>
    			</span>
    			<span v-else>
    				
    			<b-badge variant="success" pill v-if="plugin.isActive && plugin.isInstalled">Activated</b-badge>
    			<b-badge variant="primary" pill v-if="!plugin.isActive && plugin.isInstalled">Installed</b-badge>
    			<b-badge variant="danger" pill v-if="!plugin.isActive && !plugin.isInstalled">Not Installed</b-badge>
    			</span>
    	</b-list-group-item>
	</b-list-group>
        <br>
    <button class="btn btn-success btn-block" @click="_processPlugins" v-if="installerData.canInstall" >Install Plugins</button>
    </div>
</template>
<script>
	import { mapState, mapActions } from 'vuex'
	export default{
		name:'PluginStates',
		data(){
			return{
				picked:[]
			}
		},
        methods:{
            ...mapActions(['_processPlugins']),
        },
		computed:{
            ...mapState(['installerData']),
			pluginPicked: {
      			get () {
        			return this.$store.state.pluginPicked
      			},
      			set (value) {
        			this.$store.commit('setPluginPicked', value);
        			// console.log(this.$store.state.pluginPicked);
      			}
    		},
		}
	}
</script>