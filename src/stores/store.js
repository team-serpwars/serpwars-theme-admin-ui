import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
// import {WP_Plugins} from './modules/wp-plugins.store.js'

Vue.use(Vuex);

export const store = new Vuex.Store({
	// modules:{
	// 	WP_Plugins
	// },
	state:{
		loadedData:{
			plugins:[]
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

			axios.post( "http://localhost/custom-site/wp-admin/admin-ajax.php", qs.stringify( {
            action:"serpwars_get_plugin_status"

          } ) ).then(response=>{
              state.commit('setData',response.data.data)
          })
		}
	}

	
	

})