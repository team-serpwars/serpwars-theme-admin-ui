import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'

// if(!serpwars_setup_params){
// var serpwars_setup_params = {}	
// }

let ajax_url = serpwars_setup_params.ajaxurl  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";
// console.log(ajax_url);
// let ajax_url = serpwars_setup_params.ajaxurl  ;

Vue.use(Vuex);

export const PluginPost = {
	namespaced: true,
	state:{
		canImportTemplates:true,
		isInstalling:false,
		template_imports:{
			currentIndex:-1,
			list:[],
			queue:[],
			template_install:[]
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
			console.log(state.pluginSettings.elementor_templates);
			state.pluginSettings.elementor_templates.forEach(function(item,index){	
     		

				if(item.id!=0){
				axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_check_template_exists",
            		id:item.id
          		} ) ).then(response=>{  
					
          			if(response.data.data.found){
              			Vue.set(state.pluginSettings.elementor_templates[index],"found",true)
              			state.canImportTemplates = false;
          			}else{
              			state.template_imports.list.push(state.pluginSettings.elementor_templates[index]);
              			state.canImportTemplates = true;
              			Vue.set(state.pluginSettings.elementor_templates[index],"found",false)          				
          			}
					

          		})			
				}else{

              		Vue.set(state.pluginSettings.elementor_templates[index],"found",false);
              		state.canImportTemplates = true;
              		state.template_imports.list.push(state.pluginSettings.elementor_templates[index]);
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

			Toastify({
						text: "Installing Options",
						duration: 3000,
						close: false,
						gravity: "top", // `top` or `bottom`
						position: 'right', // `left`, `center` or `right`
						backgroundColor: "linear-gradient(to right, #000099, #0000aa)",
						stopOnFocus: true // Prevents dismissing of toast on hover
    				}).showToast();


			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_acf_options"
          	} ) ).then(response=>{              		
				state.pluginSettings.acf = response.data.data.acf;         	
				state.pluginSettings.cptui = response.data.data.cptui;   				
				dispatch('getCPTStatus');  


				if(!response.data.acf[0].id){
					dispatch('install');
				}else{
					
					Toastify({
					text: "All Options were installed",
					duration: 3000,
					close: false,
					gravity: "top", // `top` or `bottom`
					position: 'right', // `left`, `center` or `right`
					backgroundColor: "linear-gradient(to right, #009900, #00aa00)",
					stopOnFocus: true // Prevents dismissing of toast on hover
    			}).showToast(); 
					
				}
     			// dispatch('getElementorTemplatesStatus');
			})	
		},
		importTemplates({state,dispatch}){
			state.isInstalling = true;
			axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_templates"
          	} ) ).then(response=>{              		
				state.template_imports.queue = response.data.data;
				state.template_imports.currentIndex = 0;

				for(var i=0;i<state.template_imports.queue.length;i+=1){
					for(var j=0;j<state.template_imports.list.length;j+=1){
						if(state.template_imports.queue[i].name==state.template_imports.list[j].name){
							state.template_imports.template_install.push(state.template_imports.queue[i])
						}
					}
				}
				dispatch('importTemplate')

			})	
		},
		importTemplate({state,dispatch}){
			

			if(state.canImportTemplates && state.template_imports.template_install[state.template_imports.currentIndex]){
				var template = state.template_imports.template_install[state.template_imports.currentIndex]
				// var template = state.template_imports.queue[state.template_imports.currentIndex]
				

				Toastify({
						text: "Installing "+template.name+" Template",
						duration: 3000,
						close: false,
						gravity: "top", // `top` or `bottom`
						position: 'right', // `left`, `center` or `right`
						backgroundColor: "linear-gradient(to right, #000099, #0000aa)",
						stopOnFocus: true // Prevents dismissing of toast on hover
    				}).showToast();
				console.log(state.pluginSettings.elementor_templates[state.template_imports.currentIndex]);

				// if( state.pluginSettings.elementor_templates[state.template_imports.currentIndex].found==false){

				var url = template.template ;
				axios.post(ajax_url, qs.stringify( {
            		action:"serpwars_import_elementor_templates",
            		url:url,
            		name:template.name,
            		index:state.template_imports.currentIndex
          		} ) ).then(response=>{        
          			


          			for(var i=0;i<state.pluginSettings.elementor_templates.length;i+=1){

							if(state.pluginSettings.elementor_templates[i].name==state.template_imports.template_install[state.template_imports.currentIndex].name){
				          			state.pluginSettings.elementor_templates[i].found=true;
							}

					}



          			state.template_imports.currentIndex +=1;  		
					Toastify({
						text: template.name+" Template Installed",
						duration: 3000,
						close: false,
						gravity: "top", // `top` or `bottom`
						position: 'right', // `left`, `center` or `right`
						backgroundColor: "linear-gradient(to right, #009900, #00aa00)",
						stopOnFocus: true // Prevents dismissing of toast on hover
    				}).showToast();

						dispatch('importTemplate');
				})
				// }

			}else{
				Toastify({
					text: "All templates were Imported",
					duration: 3000,
					close: false,
					gravity: "top", // `top` or `bottom`
					position: 'right', // `left`, `center` or `right`
					backgroundColor: "linear-gradient(to right, #009900, #00aa00)",
					stopOnFocus: true // Prevents dismissing of toast on hover
    			}).showToast();

    			state.isInstalling = false;
			}

			
		}
	}
}