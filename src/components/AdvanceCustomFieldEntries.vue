<template>
	<b-row>	
		<b-col cols="6">			
			<h4>Advance Custom Fields</h4>
				<b-list-group>
					<b-list-group-item class="d-flex justify-content-between align-items-center" v-for="entry  in $store.state.PluginPost.pluginSettings.acf">
    					{{entry.title}}
    					<b-badge variant="default" pill v-if="entry.found==undefined" >Loading</b-badge>
    					<b-badge variant="success" pill v-else-if="entry.found">Installed</b-badge>
    					<b-badge variant="danger" pill v-else="entry.found" >Not Installed</b-badge>
    				</b-list-group-item>
				</b-list-group>
		</b-col>
		<b-col cols="6">
			<h4>Custom Post Types</h4>
			<b-list-group>
				<b-list-group-item class="d-flex justify-content-between align-items-center" v-for="entry  in $store.state.PluginPost.pluginSettings.cptui">
		    		{{entry.title}}
    				<b-badge variant="default" pill v-if="entry.found==undefined" >Loading</b-badge>
    				<b-badge variant="success" pill v-else-if="entry.found">Installed</b-badge>
    				<b-badge variant="danger" pill v-else="entry.found" >Not Installed</b-badge>
    		</b-list-group-item>
			</b-list-group>
		</b-col>
		  <br>
		 <button class="btn btn-success btn-block" @click="install">Install Options</button>
	</b-row>
</template>
<script>
	import { mapState, mapActions } from 'vuex'
	export default{
		name:'AdvanceCustomFieldEntries',
		methods:{
     		...mapActions('PluginPost',['loadOptions','getItems','getCPTStatus','install']),
  		},
  		async created(){
  			await this.loadOptions();
  			// await this.getItems();
  			// await this.getCPTStatus();
  		}
	}
</script>