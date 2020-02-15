import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';
// import {WP_Plugins} from './modules/wp-plugins.store.js'
import {PluginPost} from './modules/plugin-post.module.js'

Vue.use(Vuex);

let ajax_url = ajax_url  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";
let aux_setup_params = aux_setup_params  ||  {
	wpnonce:"4de84d"
};

var  _ajaxData = {};
var currentItemHash,_attemptsBuffer,_attemptsBuffer;
var currentIndex=0;


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
            		state.pluginPicked.push(state.loadedData.plugins[i].slug)
            	}
            }
		},
		setPluginPicked(state,data){
			state.pluginPicked = data;
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
			// console.log(state.pluginPicked);
			_installPlugin();
		},
		_installPlugin({state}){
			console.log("Install and activate all plugins")
			// var plugins = pluginsList.map(function(e){ if (e.ischecked) return e.slug });

		}
	}

})

const _installPlugin= function() {
	var plugins = store.state.pluginPicked.map(el =>{return el;})
	console.log(plugins);
	store.state.pluginPicked._currentItem = plugins[0]
	console.log("installing "+store.state.pluginPicked._currentItem);
    if (store.state.pluginPicked._currentItem) {                
        store.state.pluginPicked._ajaxData = {
            action: "serpwars_setup_plugins",
            wpnonce: aux_setup_params.wpnonce,
            slug: store.state.pluginPicked._currentItem,
            plugins: plugins
        };


        // console.log(qs.stringify(store.state.pluginPicked._ajaxData ));

        _globalAJAX(
            function(response) {
            	// console.log(response)
                _pluginActions(response.data);
            }
        );

  //       axios.post(_ajaxUrl, qs.stringify( {
  //           data:store.state.pluginPicked._ajaxData
  //   	})).then(response=>{
  //   		return response
		// })
    }
}

const _globalAJAX= function(callback) {

	axios.post(_ajaxUrl, qs.stringify( 
        store.state.pluginPicked._ajaxData
    )).then(response=>{
    	return response
	}).then(callback)
}

const _pluginActions = function(response) {

    if (typeof response === "object" && response.success) {

                // Update plugin status message
                
                // At this point, if the response contains the url, it means that we need to install/activate it.
                if (typeof response.data.url !== "undefined") {

                    if (currentItemHash == response.data.hash) {
                        console.log("Failed")
                        currentItemHash = null;
                        _installPlugin();
                    } else {
                        // we have an ajax url action to perform.
                        _ajaxUrl = response.data.url;
                        _ajaxData = response.data;
                        currentItemHash = response.data.hash;

                        if(response.data.url){

                        axios.post(_ajaxUrl, qs.stringify( 
        					store.state.pluginPicked._ajaxData
    					)).then(response=>{
    						return response
						}).then(function(html){
							_ajaxUrl = _ajaxUrl;
                            _installPlugin();
						})
                //         	$.ajax({
            				//     url: response.data.url,
            				//     type: "post",
            				//     data: _ajaxData
            				// }).done(function(html) {
                //                 // Reset ajax url to default admin ajax value
                //                 _ajaxUrl = aux_setup_params.ajaxurl;
                //                 _installPlugin();
                //             });

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
                    // otherwise it's just installed and we should make a notify to user
                    // update isChecked
                     pluginsList.forEach(function(e){ 
                     	if(e.slug==_currentItem){
                     		// e.isChecked = false;
                     		e.isDone = true;
                     		currentIndex+=1;

                     	}
                     });
                    console.log(_currentItem + " Is Already Installed")
                    // Then jump to next plugin
                    _processPlugins();
                }
    } else {
        // If there is an error, we will try to reinstall plugin twice with buffer checkup.
        if (_attemptsBuffer > 1) {
            // Reset buffer value
            _attemptsBuffer = 0;
            // error & try again with next plugin
            console.log("AJAX Error")
            _processPlugins();
        } else {
            // Try again & update buffer value
            currentItemHash = null;
            _attemptsBuffer++;
            _installPlugin();
        }
    }
}
const _processPlugins = function() {
   var doNext = false,
       $pluginsList =  pluginsList.map(function(e){ if(e.ischecked) return  e;});

       console.log(_currentItem);

   var done_counter = 0;
   // Scroll on each progress in modal view
   

   pluginsList.forEach(function(item) {
       if (_currentItem == null || doNext) {
           if (item.isChecked) {
           	item.inProgress = true
               _currentItem = item.slug;
               _installPlugin();
               doNext = false;
           }
       } else if (item.slug === _currentItem) {
           item.inProgress = false;
           doNext = true;

       }
   });
   pluginsList.forEach(function(item) {
       if (item.isChecked && item.isDone) {
       	done_counter+=1
       }
   });

   if(done_counter == $pluginsList.length){
   	console.log("All Items were installed")
   }          
}