import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';

import {PluginPost} from './modules/plugin-post.module.js'
import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'

Vue.use(Vuex);


// if(!serpwars_setup_params){
// 	var serpwars_setup_params = {
// 		onbefore_text: "Please do not refresh or leave the page during the wizard\'s process.",
// 		ajaxurl:"http://localhost/custom-site/wp-admin/admin-ajax.php"
// 	}	
// }


let ajax_url = serpwars_setup_params.ajaxurl  ;



var  _ajaxData = {};
var currentItemHash,_attemptsBuffer,_attemptsBuffer;
var currentIndex=0;
var _currentItem = null;

let _ajaxUrl = ajax_url;

export const store = new Vuex.Store({
	modules:{
		PluginPost
	}, state:{
		pluginPicked:[],
		installerData:{
			progress:0,
			currentItemHash:"",
			_attemptsBuffer:0,
			currentIndex:0,
			_ajaxData:{},
			_ajaxUrl :serpwars_setup_params.ajaxurl,
			_currentItem:undefined,
			canInstall:true,
			showMessage:false,
			message:serpwars_setup_params.onbefore_text
		},
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
            var picked = [];
            for(var i in state.loadedData.plugins){
            	if((state.loadedData.plugins[i].isChecked && !state.loadedData.plugins[i].isActive) || (state.loadedData.plugins[i].isInstalled && !state.loadedData.plugins[i].isActive)){
            		state.pluginPicked.push(state.loadedData.plugins[i])
            	}
            }

			if(!state.pluginPicked.length){
				state.installerData.canInstall = false;
			}
		},
		setPluginPicked(state,data){
			state.pluginPicked = data;
		},
		
	},
	actions:{
		setPluginStatus({state},status){
			if(state.installerData._currentItem){				
			const slug = state.installerData._currentItem.slug;
			state.loadedData.plugins[slug].status = status
			}
		},
		activate({state},slug){
			state.loadedData.plugins[slug].isInstalled = true
			state.loadedData.plugins[slug].status = ""
			state.loadedData.plugins[slug].isActive = true
		},
		loadData:function(state){
			axios.post(ajax_url, qs.stringify( {
            action:"serpwars_get_plugin_status"

          } ) ).then(response=>{
              state.commit('setData',response.data.data)
          })
		},
		uninstall:function(state){
			axios.post(ajax_url, qs.stringify( {
            action:"serpwars_uninstall_features"

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
		installPickedPlugins({state,dispatch}){		
			// _installPlugin();

			state.installerData.canInstall = false;
			state.installerData.showMessage = true;
			


			dispatch("_installPlugins");
		},
		_installPlugins({state,dispatch}){
			var selectedPlugins = [];
			for(var slug in state.loadedData.plugins){
				if(!state.loadedData.plugins[slug].isActive){
					selectedPlugins.push(slug)
				}
			}		
			if (state.installerData._currentItem) {
				state.installerData_ajaxData = {
		            action: "serpwars_setup_plugins",
		            wpnonce: serpwars_setup_params.wpnonce,
		            slug: state.installerData._currentItem.slug,
		            plugins: selectedPlugins
		        };	        
		        dispatch('setPluginStatus',"Downloading");
				dispatch("_globalAJAX", function(response) {
					if(response.data.status==500){				
						dispatch('setPluginStatus',"Failed");
					}else{						
						dispatch('_pluginActions',response.data)
					}
				});
			}
		},
		_globalAJAX({state},callback){			
			axios.post(_ajaxUrl, qs.stringify(state.installerData_ajaxData)).then(response=>{
    			return response
			}).then(callback)
		},
		_pluginActions({state,dispatch},response){

            if (typeof response === "object" && response.success) {

		    // Update plugin status message                
            // At this point, if the response contains the url, it means that we need to install/activate it.
            	dispatch('setPluginStatus',response.data.message);
            	if(response.data.message=="Activated"){
            		dispatch("activate",state.installerData._currentItem.slug);
            		state.installerData._currentItem = null;
            		dispatch('_processPlugins');
            	}           
                else if (typeof response.data.url !== "undefined") {
                    if (state.installerData.currentItemHash == response.data.hash) {                    	   
    					dispatch('setPluginStatus',"Failed");
    				    state.installerData.currentItemHash = null;
    				    dispatch("_installPlugins");
                    } else {
                        // we have an ajax url action to perform.
                        _ajaxUrl = response.data.url;
                        state.installerData_ajaxData = response.data;
                        state.installerData.currentItemHash = response.data.hash;
                        if(response.data.url  && state.installerData._currentItem){
                        	console.log(response.data.url );

                        	axios.post(response.data.url,
                        	 qs.stringify(state.installerData_ajaxData))
                        	.then(response=>{
                        		
    							return response
							}).then(function(html){
								_ajaxUrl = ajax_url;
                        		console.log(response.data);
								dispatch("activate",state.installerData._currentItem.slug);
                            	dispatch("_installPlugins");
							})
                        }else{
                        	dispatch("_globalAJAX", 		function(response) {
                        		state.installerData._ajaxUrl = serpwars_setup_params.ajaxurl;
                            	dispatch("_installPlugins");
							});
                        }
                    }
                } else {
                    // otherwise it's just installed and we should make a notify to user
                    // update isChecked
                    state.installerData._currentItem.isInstalled = true
                    for(var slug in state.loadedData.plugins){
                    	if(slug==state.installerData._currentItem.slug){
                    		state.loadedData.plugins[slug].isChecked = false;
                    		state.loadedData.plugins[slug].isDone = true;
                    		state.loadedData.plugins[slug].status = "";
            				dispatch('_processPlugins');                    		
                    	}
                    }
                }
            } else {
                // If there is an error, we will try to reinstall plugin twice with buffer checkup.
                if (state.installerData._attemptsBuffer > 1) {
                    // Reset buffer value
                    state.installerData._attemptsBuffer = 0;
                    // error & try again with next plugin   
    				dispatch('setPluginStatus',"Failed");
    				dispatch('_processPlugins');
                } else {
                    // Try again & update buffer value
                    state.installerData.currentItemHash = null;
                    state.installerData._attemptsBuffer += 1;
    				dispatch('_installPlugins');
                }

            }
		},
		unselectItem({state},index){
			state.loadedData.plugins[index].isChecked = false;			
		},
		_processPlugins({state,dispatch}){
			var doNext = false;
            var done_counter = 0;
            state.installerData.canInstall = false;
			state.installerData.showMessage = true;

                for(var slug in state.loadedData.plugins){
                	var item = state.loadedData.plugins[slug];

                	if (state.installerData._currentItem == null || doNext) {
                		if( !item.isActive){
                			console.log("Installing "+slug)
                			state.installerData.currentIndex = slug
                			state.installerData._currentItem = state.loadedData.plugins[slug]
                			console.log(state.installerData._currentItem);

                			dispatch('_installPlugins');
                			doNext = false;
                		}else if(item.slug == slug){
                			
                			
                			dispatch('unselectItem',slug);
                			doNext = true;
                		}
                	}else{

                	}
                }


     var finish = true
     var ol = Object.keys(state.loadedData.plugins);
     for(var slug in state.loadedData.plugins){
     	if(state.loadedData.plugins[slug].isActive){
     		done_counter += 1;
     	}
     	// if(state.loadedData.plugins.length){
     		state.installerData.progress = ((done_counter/ol.length)*100);
     		console.log(state.installerData.progress +" "+ done_counter+" " +ol.length );
     	// }
     }
            if(parseInt(state.installerData.progress)== 100){
            	Toastify({
					text: "All Plugins were successfully installed",
					duration: 3000,
					close: true,
					gravity: "top", // `top` or `bottom`
					position: 'right', // `left`, `center` or `right`
					backgroundColor: "linear-gradient(to right, #009900, #00aa00)",
					stopOnFocus: true // Prevents dismissing of toast on hover
    			}).showToast(); 
    			state.installerData.showMessage = false;
            }    
		}

	}

})


