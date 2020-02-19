import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';

import {PluginPost} from './modules/plugin-post.module.js'
import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'

Vue.use(Vuex);


if(!serpwars_setup_params){
	var serpwars_setup_params = {
		onbefore_text: "Please do not refresh or leave the page during the wizard\'s process."
	}	
}

let ajax_url = serpwars_setup_params.ajaxurl  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";



console.log(serpwars_setup_params);
var  _ajaxData = {};
var currentItemHash,_attemptsBuffer,_attemptsBuffer;
var currentIndex=0;
var _currentItem = null;

let _ajaxUrl = ajax_url;

export const store = new Vuex.Store({
	modules:{
		PluginPost
	},
	state:{
		pluginPicked:[],
		installerData:{
			currentItemHash:"",
			_attemptsBuffer:0,
			currentIndex:0,
			_ajaxData:{},
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
			// console.log(state.pluginPicked)
		},
		
	},
	actions:{
		setPluginStatus({state},status){
			const slug = state.installerData._currentItem.slug;
			state.loadedData.plugins[slug].status = status
		},
		loadData:function(state){
			axios.post(ajax_url, qs.stringify( {
            action:"serpwars_get_plugin_status"

          } ) ).then(response=>{
              state.commit('setData',response.data.data)

              // console.log(state.loadedData.plugins);
              	// console.log(response.data.data);

          })
		},
		loadThemeAssets:function(state){
		axios.post(ajax_url, qs.stringify( {
            action:"serpwars_get_theme_assets"
          } ) ).then(response=>{
              state.commit('setData',response.data.data)
          })
		},
		install({state,dispatch}){		
			// _installPlugin();

			state.installerData.canInstall = false;
			state.installerData.showMessage = true;
			console.log("Installing");
			console.log(state);

			// Toastify({
			// 	text: serpwars_setup_params.onbefore_text,
			// 	duration: 30000,
			// 	close: false,
			// 	gravity: "top", // `top` or `bottom`
			// 	position: 'right', // `left`, `center` or `right`
			// 	backgroundColor: "linear-gradient(to right, #47a3da, #4284f4)",
			// 	stopOnFocus: true // Prevents dismissing of toast on hover
		 //    }).showToast();

			dispatch("_installPlugins");
		},
		_installPlugins({state,dispatch}){

			state.installerData._currentItem = state.pluginPicked[state.installerData.currentIndex];
			
		
			if (state.installerData._currentItem) {

		
			Toastify({
				text: "Installing "+state.installerData._currentItem.name,
				duration: 3000,
				close: true,
				gravity: "top", // `top` or `bottom`
				position: 'right', // `left`, `center` or `right`
				backgroundColor: "linear-gradient(to right, #47a3da, #4284f4)",
				stopOnFocus: true // Prevents dismissing of toast on hover
		    }).showToast();


				state.installerData_ajaxData = {
		            action: "serpwars_setup_plugins",
		            wpnonce: serpwars_setup_params.wpnonce,
		            slug: state.installerData._currentItem.slug,
		            plugins: state.pluginPicked.map(el=>{return el.slug})
		        };

				dispatch('setPluginStatus',"Installing");
				dispatch("_globalAJAX", 		function(response) {
					    dispatch('_pluginActions',response.data)
					    // console.log(response.data);
					    // _pluginActions(response.data);
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
                if (typeof response.data.url !== "undefined") {

                    if (state.installerData.currentItemHash == response.data.hash) {
                    	
    				// 		Toastify({
								// text: "Failed Install  "+state.installerData._currentItem.slug,
								// duration: 3000,
								// close: true,
								// gravity: "top", // `top` or `bottom`
								// position: 'right', // `left`, `center` or `right`
								// backgroundColor: "linear-gradient(to right, #ff0000, #ff0000)",
								// stopOnFocus: true // Prevents dismissing of toast on hover
    				// 		}).showToast();      
    						dispatch('setPluginStatus',"Failed");
    				        state.installerData.currentItemHash = null;
    				        state.installerData.currentIndex+=1
    				      	// dispatch("_installPlugins");
                    } else {
      //       //             // we have an ajax url action to perform.
                        _ajaxUrl = response.data.url;
                        state.installerData_ajaxData = response.data;
                        state.installerData.currentItemHash = response.data.hash;


                        if(response.data.url){
                        	axios.post(response.data.url,
                        	 qs.stringify(state.installerData_ajaxData))
                        	.then(response=>{
    							return response
							}).then(function(html){
								_ajaxUrl = ajax_url;
                            	dispatch("_installPlugins");
							})
                        }else{
                        	dispatch("_globalAJAX", 		function(response) {
                        		_ajaxUrl = ajax_url;
                            	dispatch("_installPlugins");
							});
                        }
                    }
                } else {
                    // otherwise it's just installed and we should make a notify to user
                    // update isChecked
                     state.installerData._currentItem.isInstalled = true
                     state.pluginPicked.forEach(function(e){ 
                     if(e.slug==state.installerData._currentItem.slug){
                     	console.log(e.name);
                     		state.installerData._currentItem.isChecked = false
                     		state.pluginPicked[state.installerData.currentIndex].isChecked = false
                     		state.installerData._currentItem.isDone = true
                     		state.installerData._currentItem.isActive = true
                     		state.installerData._currentItem.status = "";

        //              		Toastify({
								// text: "installed "+e.slug,
								// duration: 3000,
								// close: false,
								// gravity: "top", // `top` or `bottom`
								// position: 'right', // `left`, `center` or `right`
								// backgroundColor: "linear-gradient(to right, #000099, #0000aa)",
								// stopOnFocus: true // Prevents dismissing of toast on hover
    				// 		}).showToast();
    						dispatch('setPluginStatus',"done");

                     		state.installerData.currentIndex+=1
                     		console.log("Current index is "+state.installerData.currentIndex);
                     	}
                     });

                     

                    // Then jump to next plugin
            		dispatch('_processPlugins');
                }
            } else {


      //           // If there is an error, we will try to reinstall plugin twice with buffer checkup.
                if (state.installerData._attemptsBuffer > 1) {
      //               // Reset buffer value
                    state.installerData._attemptsBuffer._attemptsBuffer = 0;
      //               // error & try again with next plugin
      //               Toastify({
						// text: "AJAX Error",
						// duration: 3000,
						// close: true,
						// gravity: "top", // `top` or `bottom`
						// position: 'right', // `left`, `center` or `right`
						// backgroundColor: "linear-gradient(to right, #ff0000, #ff0000)",
						// stopOnFocus: true // Prevents dismissing of toast on hover
    		// 		}).showToast();   
    				dispatch('setPluginStatus',"Failed");
    				dispatch('_processPlugins');
                } else {
      //               // Try again & update buffer value
                    state.installerData.currentItemHash = null;
                    state.installerData._attemptsBuffer += 1;
    				dispatch('_installPlugins');
                }
            }
		},
		_processPlugins({state,dispatch}){
			var doNext = false,
                $pluginsList =  state.pluginPicked.map(function(e){ if(e.ischecked) return  e;});

            console.log(state.installerData._currentItem);

            var done_counter = 0;
            // Scroll on each progress in modal view
            

            state.pluginPicked.forEach(function(item,index) {
                if (_currentItem == null || doNext) {
                    if (item.isChecked) {
                    	state.installerData.currentIndex = index
                    	state.pluginPicked[index].status = "Installing"
                    	state.installerData._currentItem = state.pluginPicked[state.installerData.currentIndex];
                    	
                    	dispatch('_installPlugins');
                        doNext = false;
                    }
                } else if (item.slug === state.installerData._currentItem.slug) {
                    state.pluginPicked[index].status = ""
                    doNext = true;

                }
            });
            state.pluginPicked.forEach(function(item) {
                if (item.isDone) {
     //            	Toastify({
					// text: item.name+" installed",
					// duration: 3000,
					// close: true,
					// gravity: "top", // `top` or `bottom`
					// position: 'right', // `left`, `center` or `right`
					// backgroundColor: "linear-gradient(to right, #009900, #00aa00)",
					// stopOnFocus: true // Prevents dismissing of toast on hover
    	// 		}).showToast(); 
    				dispatch('setPluginStatus',"done");

                	done_counter+=1
                }
            });
            state.installerData.showMessage = false;

            if(done_counter == $pluginsList.length){
            	Toastify({
					text: "All Items were installed",
					duration: 3000,
					close: true,
					gravity: "top", // `top` or `bottom`
					position: 'right', // `left`, `center` or `right`
					backgroundColor: "linear-gradient(to right, #009900, #00aa00)",
					stopOnFocus: true // Prevents dismissing of toast on hover
    			}).showToast(); 
            }    
		}

	}

})


