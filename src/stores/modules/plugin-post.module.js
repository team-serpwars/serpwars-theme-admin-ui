import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
let ajax_url = aux_setup_params.ajaxurl  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";
console.log(aux_setup_params);

Vue.use(Vuex);

export const PluginPost = {
	namespaced: true,
	state:{
		pluginSettings:{
			elementor_templates:[		
				{
					name: "4 Block Section",
					id:0
				},
				{
					name: "Why Choose Us?",
					id:0
				},
				{
					name: "What we do",
					id:0
				},
				{
					name: "8 Block Image Section",
					id:0
				},
				{
					name: "Gallery",
					id:0
				},
				{
					name: "Footer",
					id:0
				},
				{
					name: "Testimonial",
					id:0
				},
				{
					name: "2 Step Form",
					id:0
				},
				{
					name: "How it Works",
					id:0
				}							
			],
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
					id:385,
					title:"Services Pages"
				}
			],
			cptui:[
				{slug:"services",title:"Services"},
				{slug:"locations",title:"Location"}
			],			
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
		install({state}){
			// console.log(state.pluginSettings.cptui);
			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_options"
          	} ) ).then(response=>{              		
				state.pluginSettings = response.data.data;         	
     	
			})	
		},
		importTemplates({state,dispatch}){
			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_templates"
          	} ) ).then(response=>{              		
				var templates = response.data.data;
				templates.forEach(template=>{
					dispatch('importTemplate',template)
				})     	
			})	
		},
		importTemplate({state},template){
			var url = template.template
			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_elementor_templates",
            		url:url,
            		name:template.name
          	} ) ).then(response=>{              		
				console.log(response)
			})
		}
	}
}