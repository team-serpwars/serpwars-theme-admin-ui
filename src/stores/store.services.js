import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import qs  from 'qs';

var  _ajaxData = {};
var currentItemHash,_ajaxUrl,_attemptsBuffer,_attemptsBuffer;
var currentIndex=0;

export._installPlugin= function() {
	var plugins = pluginsList.map(function(e){ if (e.ischecked) return e.slug });
	console.log("installing "+_currentItem);
    if (_currentItem) {                
        _ajaxData = {
            action: "serpwars_setup_plugins",
            wpnonce: aux_setup_params.wpnonce,
            slug: _currentItem,
            plugins: plugins
        };
        
        _globalAJAX(
            function(response) {
                _pluginActions(response);
            }
        );
    }
}