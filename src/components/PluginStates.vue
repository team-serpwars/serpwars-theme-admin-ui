<template>
	<b-list-group>
		<b-list-group-item class="d-flex justify-content-between align-items-center" v-for="plugin  in $store.state.loadedData.plugins">
				
    		<label for="">
    			<input type="checkbox" v-model="pluginPicked" :value="plugin">
    		{{plugin.name}}</label>
    			<span v-if="plugin.status!=''">
    				<b-badge variant="info" pill >{{plugin.status}}</b-badge>
    			</span>
    			<span v-else>
    				
    			<b-badge variant="success" pill v-if="plugin.isActive && plugin.isInstalled">Activated</b-badge>
    			<b-badge variant="primary" pill v-if="!plugin.isActive && plugin.isInstalled">Installed</b-badge>
    			<b-badge variant="danger" pill v-if="!plugin.isActive && !plugin.isInstalled">Not Installed</b-badge>
    			</span>
    	</b-list-group-item>
	</b-list-group>
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
		computed:{
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