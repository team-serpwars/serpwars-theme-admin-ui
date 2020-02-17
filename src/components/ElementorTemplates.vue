<template>
	<div>	
	<b-list-group>
		<b-list-group-item class="d-flex justify-content-between align-items-center" v-for="entry  in $store.state.PluginPost.pluginSettings.elementor_templates">

    		{{entry.name}}
    			<b-badge variant="default" pill v-if="entry.found==undefined" >Loading</b-badge>
    			<b-badge variant="success" pill v-else-if="entry.found">Installed</b-badge>
    			<b-badge variant="danger" pill v-else="entry.found" >Not Installed</b-badge>
    	</b-list-group-item>
	</b-list-group>
  <button class="btn btn-success btn-block" @click="importTemplates">Import Templates</button>
	</div>
</template>
<script>
	import { mapState, mapActions } from 'vuex'
	export default{
		name:'ElementorTemplates',
		methods:{
     		...mapActions('PluginPost',['getElementorTemplatesStatus','importTemplates']),
  		},
  		async created(){
  			await this.getElementorTemplatesStatus();
  		}
	}
</script>