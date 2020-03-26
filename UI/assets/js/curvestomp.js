/** 
* ported from https://github.com/CHGLongStone/just-core-stub/blob/master/_UI/MAIN_UI/assets/scripts/just-core.js
* some basic helper functions
*/
function prettyPrint(DOMid=null,min=null)
{
	if(null === DOMid){
		DOMid = '#jsonString';
	}
	if(null === min){
		min = '\t';
	}else{
		min = 0;
	}
	
	objData = $(DOMid).val();
	objData = jQuery.parseJSON(objData);
	objJSON = JSON.stringify(objData, null, min);
	$(DOMid).val(objJSON);  //text(),html(),val()
}

function pageSingle(id){
	if (document.getElementById(id)){
		(document.getElementById(id).style.display == 'none')? display = 'block': display = 'none' ;
		document.getElementById(id).style.display = display;
	}
}


/**
* the core javascript service object
*/
var CurveStomp = CurveStomp || {};

SERVICE_CALL = '';
user_guid = '';
passcode = '';
SESSIONID ='';

CurveStomp = {
	API_PATH: '/api/',
	request: function(callback) {
		console.log('Do Request');
	},
	login: function() {
		var container = $('#returning');
		user_guid = container.find('#user_guid').val();
		passcode = container.find('#passcode').val();
		console.log('user_guid:'+user_guid);
		console.log('passcode:'+passcode);
		//JSON.stringify(callresult, null, 2)
		SERVICE_CALL = 'authenticate.user';
		params = {
			"user_guid" : user_guid,
			"passcode" : passcode,
			
		};
		var callresult = CurveStomp.service.call(params);
		console.log('callresult:'+JSON.stringify(callresult, null, 2));
		
		if(true === callresult.result.data.authenticated){
			$( '#returning' ).hide();
			$( '#report_list' ).show();
		}else{
			alert('Login Failed');
		}
	},
};


/**
* Mikes templater modified
*/
CurveStomp.templater = {

	renderHTML: function(prefix, obj, html) {
		if (typeof obj !== typeof undefined && typeof prefix !== typeof undefined && typeof html !== typeof undefined){
			var keys = Object.keys(obj);
			var elmType = {
				"text" : [
					"DIV", 
					"SPAN", 
					"A", 
					"TD", 
					"I", 
					"LI", 
					"UL" 
				],
				"form" : [
					"INPUT"
				],
				"media" : [
					"IMG", 
					"CANVAS", 
					"CSS", 
					"SCRIPT" 
				]
			}

			$.each(keys, function(k,v) {
				if (v == 'id'){
					html.attr(prefix, obj[v]);
					var el = '';
				}else{
					var el = html.find('['+prefix+'-'+v+']');
				}

				if (el.length > 0){
					switch(true){
						case -1 < $.inArray(el.prev().prop('nodeName'), elmType.text)://inArray( value, array)
							el.html(obj[v]);
							break;
						case -1 < $.inArray(el.prev().prop('nodeName'), elmType.form):
							//console.log('---------form');
							if (
								el.attr('type') !== 'checkbox'
								|| 
								el.is('select')
							){
								el.val(obj[v]);
							}else if (el.attr('type') == 'checkbox'){
								if (obj[v] == 1 || obj[v] == true){
									el.prop('checked', true);
								}else{
									el.prop('checked', false);
								}
							}		
							break;
						case -1 < $.inArray(el.prev().prop('nodeName'), elmType.media):
							//console.log('---------media');
							if ((obj[v] !== '' || obj[v] !== null)){
								el.attr('src', obj[v]);
							}		
							break;
						default:
							//console.log('DEFAULT:');
							el.html(obj[v]);

							break;
					}
					if (el.is('div') || el.is('span'))
					{
						el.html(obj[v]);
					}else if (el.is('img') && (obj[v] !== '' || obj[v] !== null)){
						el.attr('src', obj[v]);
					}else if ((el.is('input') && el.attr('type') !== 'checkbox') || el.is('select')){
						el.val(obj[v]);
					}else if (el.is('input') && el.attr('type') == 'checkbox'){
						if (obj[v] == 1 || obj[v] == true){
							el.prop('checked', true);
						}else{
							el.prop('checked', false);
						}
					}
				}else{
					// console.log(v+' no element el.length'+el.length); 
					
				}
			});
			return html;
		}else{
			console.log('All parameters required. Prefix, Object and HTML object');
		}
	},
	
	
};


/**
* a service call wrapper 
*/
CurveStomp.service = {
	lastResult: '',
	callObj: {},
	/**
	* a method to do the call and provide default parameters 
	*/
	call: function(requestParams) {
		console.log('Start CurveStomp.service.call');
		var fakeCallResult =  {
				"result": {
					"status": "OK",
					"data": {
						'authenticated' : true,
					}
				},
				"error": null,
				"id": null,
			};
		return fakeCallResult;
		
		
		
		var request = {
			method: SERVICE_CALL,
			params: requestParams,
			id: SESSIONID+'::'+SERVICE_CALL+'::'+Date.now(),
		};
		request = JSON.stringify(request);
		console.log(request);
		CurveStomp.service.callObj = $.ajax({
			type: 'post',
			/**
			headers: {
				'SESSIONID':SESSIONID,
				'passcode' : passcode,
				'user_guid' : user_guid,
				'digital_fingerprint' : digital_fingerprint,
			},
			*/
			dataType: "json",
			url: CurveStomp.API_PATH,
			data: request,
			cache: false
		})
		.done(function( data ) {
			if('OK' == data.result.status){
				if(data.result.info.callback){
					responseProcessor = data.result.info.callback+'(data.result);';
					console.log('responseProcessor=='+responseProcessor);
					eval(responseProcessor);
				}
				
				CurveStomp.service.lastResult = data.result;
			}
			return data.result;
		});
	},
	/**
	* #####################################################################
	* some service calls
	* #####################################################################
	*/
	
	/**
	* output the results of the ajax request to the browser
	*/
	notification: function(result) {
		console.log('notification');
		CurveStomp.service.lastResult = result;
		/**
		* look for the DOM element to write the notification 
		*/
		if($('#notification')){
			if('object' == typeof result){
				$('#notification').html(JSON.stringify(result, null, 2));
			}else{
				$('#notification').html(result);
			}
		}else{
			return false;
		}
	},	
	/**
	* optput the results of the ajax request to the browser
	* from a list (array) of results 
	*/
	notificationList: function(result) {
		console.log('CurveStomp.signUp.signUpNotification:'+JSON.stringify(result, null, 2));
		if('OK' == result.status){
			var msg = '';
			$.each(result.info.msg, function(k,v) {
				msg = msg+""+v+"<br>";
				//params[v.name] = v.value;
			});
			CurveStomp.service.notification(msg);
		}		
	},
	/**
	* a standard regex to validate email format
	* function pulled from here https://gist.github.com/slovisi/6387824
	*/
	isValidEmailAddress: function(emailAddress) {
		console.log('isValidEmailAddress:'+emailAddress);
		/**
		var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		* alt pattern here http://emailregex.com/
		*/
		var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return pattern.test(emailAddress);
	},	

	/**
	* #####################################################################
	* some util funcitons 
	* 
	* #####################################################################
	*/
	

	/**
	* util function to create new array input element by name
	*/
	createNeedleElm: function(elementName, containerName) {
		console.log('Start createNeedleElm elementName['+elementName+']');
		var htmlTemplate = $('[template="'+elementName+'"]').clone(true);
		console.log('html:::'+htmlTemplate);
		var renderedHTML = CurveStomp.templater.renderHTML(''+elementName+'', {}, htmlTemplate);
		$('#'+containerName+'').append(renderedHTML);
		htmlTemplate.removeAttr('template');
	},
	
	
	/**
	* util function to create new array input element by name
	*/
	addNeedleElm: function(elementName, containerName) {
		console.log('Start createNeedleElm elementName['+elementName+']');
		var htmlTemplate = $('[template="'+elementName+'"]').clone(true);
		console.log('html:::'+htmlTemplate);
		var renderedHTML = CurveStomp.templater.renderHTML(''+elementName+'', {}, htmlTemplate);
		$('#'+containerName+'').append(renderedHTML);
		htmlTemplate.removeAttr('template');
	},
	
	APISettingsNotification: function(result) {
		console.log('CurveStomp.signUp.signUpNotification:'+JSON.stringify(result, null, 2));
		if('OK' == result.status){
			var msg = '';
			//msg = msg+"Status: "+result.status+"<br>";
			msg = msg+""+result.info.msg+"<br>";
			CurveStomp.service.notification(msg);
		}
	},

};




/**
* ported from 
* https://github.com/moll/json-stringify-safe/
*/
CurveStomp.var_export = {
	// a method to do the call and provide default parameters 
	//exports: module.exports = stringify,
	//exports.getSerialize: serializer,

	stringify: function(obj, replacer, spaces, cycleReplacer) {
	  return JSON.stringify(obj, this.serializer(replacer, cycleReplacer), spaces)
	},

	serializer: function(replacer, cycleReplacer) {
	  var stack = [], keys = []

	  if (cycleReplacer == null) cycleReplacer = function(key, value) {
		if (stack[0] === value) return "[Circular ~]"
		return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
	  }

	  return function(key, value) {
		if (stack.length > 0) {
		  var thisPos = stack.indexOf(this)
		  ~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
		  ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
		  if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
		}
		else stack.push(value)

		return replacer == null ? value : replacer.call(this, key, value)
	  }
	},															
};

console.log(CurveStomp);


/**
* a service call wrapper 
*/
CurveStomp.registration = {
	setMembers: function(num_members) {
		var current_members = $('#household_members').find(".member_row").length;
		if(num_members == current_members){
			return;
		}
		if( current_members > num_members){
			i = current_members-1;
			var rows = $(".member_row");
			while(i >= num_members){
				$(".member_row").eq( i ).remove();
				i--;
			}
			return;
		}
		
		i = current_members;
		while(i <= num_members){
			i++;
			if(i > num_members){
				break;
			}
			var htmlTemplate = $('[template="household_member"]').clone(true);
			member = {
				member_id : i,
				guid: 'asdwefjlsakdjfskjf'
			};
			var renderedHTML = CurveStomp.templater.renderHTML('household', member, htmlTemplate);
			$('#household_members').append(renderedHTML);
			htmlTemplate.removeAttr('template');
			
		}
		
		
		/*
		var country_select = $('#country_container').find('#country_select');
		$.each(countries, function( key, value ) {
			//console.log('key: '+key+' value: '+JSON.stringify(value, null, 2));
			$(country_select).append($("<option></option>").attr("value",value.id).text(value.text)); 
		});
		*/
	},
};

/**
* a service call wrapper 
*/
CurveStomp.reports = {
	symptom : {
		//symptom_log_pk
		//individual_fk
		//symptom_log_timestamp
		dry_cough : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		pneumonia : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		difficulty_breathing : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		difficulty_walking : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		appetite : {value: 5, min: 1, max: 9, min_label: 'lower', max_label: 'higher', step: 1},
		diarrhea : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		muscle_ache : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		fatigue : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		runny_nose : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		congestion : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		sore_throat : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		fever_f : {value: 5, min: 1, max: 9, min_label: 'low', max_label: 'high', step: 0.1},
		fever_c : {value: 5, min: 1, max: 9, min_label: 'low', max_label: 'high', step: 0.1},
		headache : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		confusion__dizzyness : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		nausea : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		chills : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1},
		other_pain : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'severe', step: 1}
		
	}, 
	
	
	transmission : {
		isolation : {value: 1, min: 1, max: 9, min_label: 'very isolated', max_label: 'not isolated', step: 1},
		travel : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'frequent', step: 1},
		surface_touch : {value: 1, min: 1, max: 9, min_label: 'none', max_label: 'frequent', step: 1},
		number_of_regular_contacts : {value: 1, min: 1, max: 9, min_label: 'less than 5', max_label: 'more than 20', step: 1},
	},
	
	renderReport : function(report_name) {
		console.log('report_name'+report_name);
		var report_data = CurveStomp.reports[report_name];
		var elem_name = '#'+report_name+'_form';
		console.log('elem_name'+elem_name);
		newElem = $(elem_name);
		var htmlTemplate = '';

		htmlTemplate = $('[template="symptom_report_item"]').clone(true);
		htmlTemplate.removeAttr('template');
		
		parent_container = newElem.closest('#symptom_form');
		$.each(report_data, function(k,v) {
			
			iHtml = htmlTemplate.clone(true);
			if(k.includes('__')){
				display_name = k.replace(/__/g, " / ");
			}else{
				display_name = k.replace(/_/g, " ");
			}
			
			console.log('display_name: '+display_name);
			console.log('display_name: '+display_name);
			v['name'] = k;
			v['display_name'] = display_name;
			v['slider_name'] = k+"_symptom_level";
			console.log('k:-'+k+'--------------v:::'+JSON.stringify(v, null, 2));
			//website_container = parent_container.find('#advertiser-website_container');
			//var el = website_container.find('*[website-flag_description]').filter(":last");
			finishedHtml = CurveStomp.templater.renderHTML('report_item', v, iHtml);
			parent_container.append(finishedHtml);
			
			var new_slider = $(parent_container).find('*[report_item-symptom_level]').filter(":last");
			//var new_slider = parent_container.last('.slider');
			$(new_slider).slider({
				value: v.value,
				min: v.min,
				max: v.max,
				step: v.step,
				slide: function( event, ui ) {
					$( "[name="+k+"_symptom_level]" ).val(ui.value);
					household_members = ui.value;
					CurveStomp.registration.setMembers(household_members);
				},
			});
			//console.log('---------------$(el).html()'+$(el).html());
			//var flag_name = CurveStomp.display.getFlagClass(v.flag_name);
			//console.log('---------------flag_name:::'+flag_name);
			//$(el).addClass(flag_name);
			if(v.score){
				//renderScore(v.score);
			}else{
				//console.log('k'+k+' v'+JSON.stringify(v, null, 2));
			}
				
		});		
		
	},
	
}




function next(action){
	switch(action){
		case"location_profile":
			$( '#identity' ).hide();
			$( '#location' ).show();
			
			break;
		case"":
			break;
		
	}
}

/**
createMatchStageElm: function(elementName, containerName) {
		console.log('Start createStageCourseElm elementName['+elementName+']');
		var htmlTemplate = $('[template="'+elementName+'"]').clone(true);
		console.log('html:::'+htmlTemplate);
		var renderedHTML = JCORE.templater.renderHTML('user', user, htmlTemplate);

		
		$('#'+containerName+'').append(renderedHTML);
		
		//console.log('Start createStageCourseElm renderedHTML '+JSON.stringify(renderedHTML));
		
		htmlTemplate.removeAttr('template');
		$('#matchstage_ID').val('');
		$('#MatchStageSearch').val('');

}
*/
