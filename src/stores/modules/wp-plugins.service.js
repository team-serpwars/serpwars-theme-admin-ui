import axios from 'axios';
import qs  from 'qs';
import "toastify-js/src/toastify.css"
import Toastify from 'toastify-js'


let ajax_url = ajax_url  ||  "http://localhost/custom-site/wp-admin/admin-ajax.php";
let aux_setup_params = aux_setup_params  ||  {
	wpnonce:"4de84d"
};

console.log(aux_setup_params);

var  _ajaxData = {};
var currentItemHash,_attemptsBuffer,_attemptsBuffer;
var currentIndex=0;
var slug = "elementor"

let _ajaxUrl = ajax_url;

var pluginList = [];
var _currentItem = null;


const _init = function(collection){
	pluginList = collection;
	if((pluginList.length>1)){		
		_currentItem = pluginList[0]
	}
}

const _globalAJAX= function(callback) {
	console.log(_ajaxData);
	axios.post(_ajaxUrl, qs.stringify( 
        _ajaxData
    )).then(response=>{
    	return response
	}).then(callback)
}

const _installPlugin = function(){
	 Toastify({
		text: "Installing "+_currentItem,
		duration: 3000,
		close: true,
		gravity: "top", // `top` or `bottom`
		position: 'right', // `left`, `center` or `right`
		backgroundColor: "linear-gradient(to right, #47a3da, #4284f4)",
		stopOnFocus: true // Prevents dismissing of toast on hover
    }).showToast();

	if (_currentItem) {
		_ajaxData = {
            action: "serpwars_setup_plugins",
            wpnonce: aux_setup_params.wpnonce,
            slug: _currentItem,
            plugins: pluginList
        };

        _globalAJAX(
			function(response) {
			    _pluginActions(response.data);
			}
        );
	}
}

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
            //             _installPlugin();
                    } else {
            //             // we have an ajax url action to perform.
                        _ajaxUrl = response.data.url;
                        _ajaxData = response.data;
                        currentItemHash = response.data.hash;

                        if(response.data.url){
                        	console.log(_ajaxUrl,_ajaxData)
            //             	$.ajax({
            // 				    url: response.data.url,
            // 				    type: "post",
            // 				    data: _ajaxData
            // 				}).done(function(html) {
            //                     // Reset ajax url to default admin ajax value
            //                     _ajaxUrl = aux_setup_params.ajaxurl;
            //                     _installPlugin();
            //                 });

                        }else{

            //             _globalAJAX(
            //                 function(html) {
            //                     // Reset ajax url to default admin ajax value
            //                     _ajaxUrl = aux_setup_params.ajaxurl;
            //                     _installPlugin();
            //                 }
            //             );
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


export const WP_Plugin_Service = {
	_init,
	_installPlugin
}