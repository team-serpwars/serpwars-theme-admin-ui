import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
var aux_setup_params = aux_setup_params || {
	ajaxurl:"http://localhost/custom-site/wp-admin/admin-ajax.php"
}
let ajax_url = aux_setup_params.ajaxurl  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";
console.log(ajax_url);

Vue.use(Vuex);

export const PluginPost = {
	namespaced: true,
	state:{
		template_imports:{
			currentIndex:-1,
			queue:[]
		},
		pluginSettings:{
			elementor_templates:[],
			acf:[],
			cptui:[],			
		}
	},

	actions:{
		loadOptions({state,dispatch}){
			var context = this;
			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_load_options"
          	} ) ).then(response=>{           
				state.pluginSettings = response.data.data; 
				console.log(response.data.data);
				dispatch('getItems');
				dispatch('getCPTStatus');
				dispatch('getElementorTemplatesStatus');
			})	
		},
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
		getElementorTemplatesStatus:function({state}){
			state.pluginSettings.elementor_templates.forEach(function(item,index){	
     		

				if(item.id!=0){
				axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_check_post_exists",
            		id:item.id
          		} ) ).then(response=>{  
              		Vue.set(state.pluginSettings.elementor_templates[index],"found",response.data.success)
          		})			
				}else{
              		Vue.set(state.pluginSettings.elementor_templates[index],"found",false);
				}
			})
		},
		getCPTStatus:function({state}){
			state.pluginSettings.cptui.forEach(function(item,index){				
				axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_check_cpt_exists",
            		slug:item.slug
          		} ) ).then(response=>{              		
              		Vue.set(state.pluginSettings.cptui[index],"found",response.data.success)
          		})	
			})
		},
		install({state,dispatch}){
			// console.log(state.pluginSettings.cptui);
			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_options"
          	} ) ).then(response=>{              		
				state.pluginSettings.acf = response.data.data.acf;         	
				state.pluginSettings.cptui = response.data.data.cptui;         	
     			// dispatch('getElementorTemplatesStatus');
			})	
		},
		importTemplates({state,dispatch}){
			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_templates"
          	} ) ).then(response=>{              		
				state.template_imports.queue = response.data.data;
				state.template_imports.currentIndex = 0;
				dispatch('importTemplate')

			})	
		},
		importTemplate({state,dispatch}){
			if(state.template_imports.currentIndex < state.template_imports.queue.length ){
				var template = state.template_imports.queue[state.template_imports.currentIndex]
				console.log(template);
				var url = template.template ;
				axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_elementor_templates",
            		url:url,
            		name:template.name,
            		index:state.template_imports.currentIndex
          		} ) ).then(response=>{        
          			state.pluginSettings.elementor_templates[state.template_imports.currentIndex].found=true;
          			state.template_imports.currentIndex +=1;  		
					console.log(response)

					setTimeout(function(){
						dispatch('importTemplate');
					},5000)
				})
			}else{
				console.log("All Templates Imported");
			}

			
		}
	}
}