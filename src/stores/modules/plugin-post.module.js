import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
let ajax_url = ajax_url  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";

Vue.use(Vuex);

export const PluginPost = {
	namespaced: true,
	state:{
		pluginSettings:{
			acf:[
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
					id:3805,
					title:"Services Pages"
				}
			],
			cptui:[
				{slug:"services",title:"Services"},
				{slug:"location",title:"Location"}
			]
		}
	},

	actions:{
		getItems:function({state}){
			state.pluginSettings.acf.forEach(function(item,index){				
				axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_check_post_exists",
            		id:item.id
          		} ) ).then(response=>{              		
              		Vue.set(state.pluginSettings.acf[index],"found",response.data.success)
          		})			
			})
		},
		// getCPTStatus:function({state}){
		// 	state.pluginSettings.cptui.forEach(function(item,index){				
		// 		axios.post(ajax_url, qs.stringify( {
  //           		action:"serpwars_check_cpt_exists",
  //           		slug:item.slug
  //         		} ) ).then(response=>{              		
  //             		// Vue.set(state.pluginSettings.acf[index],"found",response.data.success)
  //         		})	
		// 	})
		// }
	}
}