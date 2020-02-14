<template>
	<b-list-group>
		<b-list-group-item class="d-flex justify-content-between align-items-center" v-for="plugin  in $store.state.loadedData.plugins">

    		{{plugin.name}}
    			<b-badge variant="success" pill v-if="plugin.isActive && plugin.isInstalled">Activated</b-badge>
    			<b-badge variant="primary" pill v-if="!plugin.isActive && plugin.isInstalled">Installed</b-badge>
    			<b-badge variant="danger" pill v-if="!plugin.isActive && !plugin.isInstalled">Not Installed</b-badge>
    	</b-list-group-item>
	</b-list-group>
</template>
<script>
	export default{
		name:'PluginStates'

	}
</script>