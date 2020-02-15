import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
import {WP_Plugin_Service} from './modules/wp-plugins.service.js'
import {PluginPost} from './modules/plugin-post.module.js'
import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'

Vue.use(Vuex);

let ajax_url = ajax_url  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";
let aux_setup_params = aux_setup_params  ||  {
	wpnonce:"4de84d"
};

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
			_attemptsBuffer:"",
			currentIndex:0,
			_ajaxData:{},
			_currentItem:undefined
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
            	if(state.loadedData.plugins[i].isChecked){
            		state.pluginPicked.push(state.loadedData.plugins[i])
            	}
            }
			console.log(state.pluginPicked)
		},
		setPluginPicked(state,data){
			state.pluginPicked = data;
		},
		setPluginStatus(state,status){
			const slug = state.installerData._currentItem.slug;
			state.loadedData.plugins[slug].status = status
		}
	},
	actions:{
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
		install({state}){		
			// _installPlugin();
			this.dispatch("_installPlugins");
		},
		_installPlugins({state}){

			// var plugins = state.pluginPicked.map(el =>{return el;})
			state.installerData._currentItem = state.pluginPicked[state.installerData.currentIndex];

		
			Toastify({
				text: "Installing "+state.installerData._currentItem.name,
				duration: 3000,
				close: true,
				gravity: "top", // `top` or `bottom`
				position: 'right', // `left`, `center` or `right`
				backgroundColor: "linear-gradient(to right, #47a3da, #4284f4)",
				stopOnFocus: true // Prevents dismissing of toast on hover
		    }).showToast();
		
			if (state.installerData._currentItem.name) {
				state.installerData_ajaxData = {
		            action: "serpwars_setup_plugins",
		            wpnonce: aux_setup_params.wpnonce,
		            slug: state.installerData._currentItem.slug,
		            plugins: state.pluginPicked.map(el=>{return el.slug})
		        };

		        var context = this;
				this.commit('setPluginStatus',"Installing");
				this.dispatch("_globalAJAX", 		function(response) {
					    context.dispatch('_pluginActions',response.data)
					    // console.log(response.data);
					    // _pluginActions(response.data);
				});

		 //        _globalAJAX(
			// 		function(response) {
			// 		    _pluginActions(response.data);
			// 		}
		 //        );
			}
		},
		_globalAJAX({state},callback){
			axios.post(_ajaxUrl, qs.stringify(state.installerData_ajaxData)).then(response=>{
    			return response
			}).then(callback)
		},
		_pluginActions({state},response){
            if (typeof response === "object" && response.success) {
            	console.log(this);
            //     // Update plugin status message
                
            //     // At this point, if the response contains the url, it means that we need to install/activate it.
                if (typeof response.data.url !== "undefined") {

                    if (currentItemHash == response.data.hash) {
    						Toastify({
								text: "Failed Install  "+state.installerData._currentItem.slug,
								duration: 3000,
								close: true,
								gravity: "top", // `top` or `bottom`
								position: 'right', // `left`, `center` or `right`
								backgroundColor: "linear-gradient(to right, #ff0000, #ff0000)",
								stopOnFocus: true // Prevents dismissing of toast on hover
    						}).showToast();      
    				        // state.installerData.currentItemHash = null;
    				      	this.dispatch("_installPlugins");
                    } else {
            //             // we have an ajax url action to perform.
                       	var context = this;
                        _ajaxUrl = response.data.url;
                        state.installerData_ajaxData = response.data;
                        state.installerData.currentItemHash = response.data.hash;

                        if(response.data.url){
                        	console.log(_ajaxUrl,state.installerData_ajaxData)

                        	axios.post(response.data.url,
                        	 qs.stringify(state.installerData_ajaxData))
                        	.then(response=>{
    							return response
							}).then(function(html){
								_ajaxUrl = ajax_url;
                            	context.dispatch("_installPlugins");
							})


                        }else{
                        	this.dispatch("_globalAJAX", 		function(response) {
                        		_ajaxUrl = ajax_url;
                            	context.dispatch("_installPlugins");
							});
                        }
                    }
                } else {
            //         // otherwise it's just installed and we should make a notify to user
            //         // update isChecked
            //          pluginsList.forEach(function(e){ 
            //          	if(e.slug==_currentItem){
            //          		// e.isChecked = false;
            //          		e.isDone = true;
            //          		currentIndex+=1;

            //          	}
            //          });
            //         console.log(_currentItem + " Is Already Installed")
            //         // Then jump to next plugin
            //         _processPlugins();
                }
            } else {
            	// console.log("This one");
            //     // If there is an error, we will try to reinstall plugin twice with buffer checkup.
            //     if (_attemptsBuffer > 1) {
            //         // Reset buffer value
            //         _attemptsBuffer = 0;
            //         // error & try again with next plugin
            //         console.log("AJAX Error")
            //         _processPlugins();
            //     } else {
            //         // Try again & update buffer value
            //         currentItemHash = null;
            //         _attemptsBuffer++;
            //         _installPlugin();
            //     }
            }
		}

	}

})




const _pluginActions = function(response) {
	console.log(response)

            if (typeof response === "object" && response.success) {
            	console.log(this);
            //     // Update plugin status message
                
            //     // At this point, if the response contains the url, it means that we need to install/activate it.
                if (typeof response.data.url !== "undefined") {

                    if (currentItemHash == response.data.hash) {
    				Toastify({
						text: "Failed Install  "+_currentItem,
						duration: 3000,
						close: true,
						gravity: "top", // `top` or `bottom`
						position: 'right', // `left`, `center` or `right`
						backgroundColor: "linear-gradient(to right, #ff0000, #ff0000)",
						stopOnFocus: true // Prevents dismissing of toast on hover
    				}).showToast();            //             currentItemHash = null;
                        _installPlugin();
                    } else {
            //             // we have an ajax url action to perform.
                        _ajaxUrl = response.data.url;
                        _ajaxData = response.data;
                        currentItemHash = response.data.hash;

                        if(response.data.url){
                        	console.log(_ajaxUrl,_ajaxData)

                        	axios.post(response.data.url,
                        	 qs.stringify(_ajaxData))
                        	.then(response=>{
    							return response
							}).then(function(html){
								_ajaxUrl = ajax_url;
                            	_installPlugin();
							})


                        }else{
                        	_globalAJAX(
                            	function(html) {
                                	// Reset ajax url to default admin ajax value
                                	_ajaxUrl = aux_setup_params.ajaxurl;
                                	_installPlugin();
                            	}
                        	);
                        }
                    }
                } else {
            //         // otherwise it's just installed and we should make a notify to user
            //         // update isChecked
            //          pluginsList.forEach(function(e){ 
            //          	if(e.slug==_currentItem){
            //          		// e.isChecked = false;
            //          		e.isDone = true;
            //          		currentIndex+=1;

            //          	}
            //          });
            //         console.log(_currentItem + " Is Already Installed")
            //         // Then jump to next plugin
            //         _processPlugins();
                }
            } else {
            	// console.log("This one");
            //     // If there is an error, we will try to reinstall plugin twice with buffer checkup.
            //     if (_attemptsBuffer > 1) {
            //         // Reset buffer value
            //         _attemptsBuffer = 0;
            //         // error & try again with next plugin
            //         console.log("AJAX Error")
            //         _processPlugins();
            //     } else {
            //         // Try again & update buffer value
            //         currentItemHash = null;
            //         _attemptsBuffer++;
            //         _installPlugin();
            //     }
            }
        }