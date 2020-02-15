import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
// import {WP_Plugins} from './modules/wp-plugins.store.js'
import {PluginPost} from './modules/plugin-post.module.js'

Vue.use(Vuex);

let ajax_url = ajax_url  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";

export const store = new Vuex.Store({
	modules:{
		PluginPost
	},
	state:{
		loadedData:{
			plugins:[],
			templates:[],
			pluginSettings:{
				"acf":[
					{
						id:331,
						title:"General Pages"
					},
					{
						id:337,
						title:"Icon Field"
					},
					{
						id:339,
						title:"Industry Pages"
					},
					{
						id:385,
						title:"Services Pages"
					}
				]
			}
		}
	},
	mutations:{
		setData(state,data){
			state.loadedData.plugins=data;
			console.log(state.loadedData.plugins);
		}
	},
	actions:{
		loadData:function(state){
			axios.post(ajax_url, qs.stringify( {
            action:"serpwars_get_plugin_status"

          } ) ).then(response=>{
              state.commit('setData',response.data.data)
          })
		},
		loadThemeAssets:function(state){
		axios.post(ajax_url, qs.stringify( {
            action:"serpwars_get_theme_assets"
          } ) ).then(response=>{
              state.commit('setData',response.data.data)
          })
		},
		loadTemplates:function(state){

		},
		pluginSettings:function(state){

		}
	}

	
	

})