if(!tc){ var tc = {}; }

tc.merlin = makeClass();

tc.merlin.prototype.options = {
	name:null,
	dom:null,
	progress_element:null,
	next_button:null,
	back_button:null,
	watch_keypress:true,
	first_step:'start',
	steps:{
		'start':{
			progress_selector:'.1',
			selector:'.start',
			prev_step:null,
			next_step:null
		}
	}
}

tc.merlin.prototype.init = function(app,options){
	tc.util.log('tc.merlin.init');
	this.options = tc.jQ.extend({},this.options,options);
	this.app = app;
	if(this.options.dom instanceof String){
		this.options.dom = tc.jQ(options.dom);
	}
	this.dom = this.options.dom;
	this.event_data = {app:app,me:this};
	this.handle_steps();
	this.handle_controls(options.controls);
	this.setup_events(app);
	tc.util.dump(this.options);
	if(this.options.first_step){
		this.show_step(this.options.first_step);
		//if(this.options.name){
		//	window.location.hash = this.options.name+','+this.options.first_step;
		//} else {
		//	window.location.hash = this.options.first_step;
		//}
	}
	this.current_hash = null;
}

tc.merlin.prototype.setup_events = function(app){
	tc.util.log('tc.merlin.setup_events');
	tc.jQ(window)
		.unbind('hashchange',this.event_data,this.handlers.hashchange)
		.bind('hashchange',this.event_data,this.handlers.hashchange);
	this.dom.find('a.step_link').unbind('click').bind('click',this.event_data,this.handlers.a_click);
	if(this.options.back_button){
		this.options.back_button.unbind('click').bind('click',this.event_data,this.handlers.last_step);
	}
	if(this.options.next_button){
		this.options.next_button.addClass('disabled');
		this.options.next_button.unbind('click').bind('click',this.event_data,this.handlers.next_step);
	}
	this.dom.bind('merlin-step-valid',this.event_data,this.handlers.valid);
	this.dom.bind('merlin-step-invalid',this.event_data,this.handlers.invalid);
}

tc.merlin.prototype.handle_controls = function(controls){
	tc.util.log('tc.merlin.handle_controls');
	if(this.options.progress_element){
		this.options.progress_element.find('a.indicator').bind('click',this.event_data,this.handlers.indicator_click);
	}
	if(this.options.error_indicator){
		this.options.error_indicator.html('<span></span>');
	}
}

tc.merlin.prototype.handle_steps = function(){
	tc.util.log('tc.merlin.handle_steps');
	var i;
	for(i in this.options.steps){
		if(this.options.steps[i].selector){
			this.options.steps[i].dom = this.dom.find(this.options.steps[i].selector);
		}
	}
}

tc.merlin.prototype.show_step = function(step){
	tc.util.log('tc.merlin.show_step['+step+']');
	var i, j;
	
	if(this.current_step){
		//this.current_step.dom.find('input, textarea').unbind('keyup change');
		
		if(step == this.current_step.step_name){
			return;
		}
		if(tc.jQ.isFunction(this.current_step.finish)){
			this.current_step.finish(this,this.current_step.dom);
		}
	}
	if(!this.options.steps[step]){
		return;
	}
	
	this.options.steps[step].step_name = step;
	if(this.current_step && this.current_step.use_for_history){
		this.options.steps[step].prev_step = this.current_step.step_name;
	} else if(this.current_step){
		this.options.steps[step].prev_step = this.current_step.prev_step;
	}
	this.current_step = this.options.steps[step];
	if(this.options.next_button){
		this.options.next_button.removeClass('disabled');
	}
	if(this.current_step.progress_selector){
		if(this.options.progress_element){
			this.options.progress_element.find(this.current_step.progress_selector)
				.addClass('cur')
				.attr('href','#'+this.current_step.step_name)
				.nextAll().removeClass('cur').attr('href','#');
		}
	}
	if(this.current_step.title && this.options.title){
		this.options.title.html(this.current_step.title);
	}
	if(this.current_step.sub_title && this.options.sub_title){
		this.options.sub_title.html(this.current_step.sub_title);
	}
	if(tc.jQ.isFunction(this.current_step)){
		this.current_step(this);
		return;
	}
	
	if(tc.jQ.isFunction(this.current_step.transition)){
		this.current_step.transition(this);
	} else {
		this.dom.find('.step').hide();
		this.dom.find(this.current_step.selector).show();
	}
	
	if(this.current_step.inputs && !this.current_step.has_been_initialized){
		for(i in this.current_step.inputs){
			if(!this.current_step.inputs[i].dom && this.current_step.inputs[i].selector){
				this.current_step.inputs[i].dom = this.current_step.dom.find(this.current_step.inputs[i].selector);
			}
			this.current_step.inputs[i].dom
				.bind('focus',this.event_data,this.handlers.focus)
				.bind('keyup change',this.event_data,this.handlers.keypress)
				.bind('blur',this.event_data,this.handlers.blur).data({merlin:this,input:this.current_step.inputs[i]}).each(function(i,j){
					var $j;
					$j = tc.jQ(j);
					if($j.data().input.hint || ($j.data().input.hint == "")){
						j.value = $j.data().input.hint;
					}
				});
			if(this.current_step.inputs[i].handlers){
				for(j in this.current_step.inputs[i].handlers){
					this.current_step.inputs[i].dom.bind(j,this.event_data,this.current_step.inputs[i].handlers[j]);
				}
			}
			if(this.current_step.inputs[i].focus_first){
				//this.current_step.inputs[i].dom.focus();
			}
		}
	}
	
	if(tc.jQ.isFunction(this.current_step.init)){
		this.current_step.init(this,this.current_step.dom);
	}
	if(this.options.name){
		window.location.hash = this.options.name+','+step;
	} else {
		window.location.hash = step;
	}
	this.validate(false);
	this.current_step.has_been_initialized = true;
}

tc.merlin.prototype.validate = function(on_submit){
	tc.util.log('tc.merlin.validate');
	var i, valid, temp_valid, j;
	if(!this.current_step.inputs){
		return true;
	}
	valid = true;
	this.current_step.errors = [];
	for(i in this.current_step.inputs){
		if(!this.current_step.inputs[i].validators){
			continue;
		}
		if(on_submit){
			this.current_step.inputs[i].dom.addClass('has-been-focused').addClass('has-attempted-submit');
		}
		if(tc.jQ.isFunction(this.current_step.inputs[i].validators)){
			temp_valid = this.current_step.inputs[i].validators(this,this.current_step.inputs[i].dom,this.current_step);
		} else {
			temp_valid = tc.validate(this.current_step.inputs[i].dom,this.current_step.inputs[i].validators);
		}
		
		if(!temp_valid.valid){
			valid = false;
		}
	}
	if(valid){
		this.dom.trigger('merlin-step-valid',{
			step:this.current_step
		});
		this.current_step.dom.removeClass('invalid').addClass('valid');
		return true;
	} else {
		this.dom.trigger('merlin-step-invalid',{
			step:this.current_step
		});
		this.current_step.dom.removeClass('valid').addClass('invalid');
		return false;
	}
}

tc.merlin.prototype.handlers = {
	hashchange:function(e,d){
		tc.util.log('tc.merlin.handlers.hashchange');
		var hash;
		hash = window.location.hash.substring(1,window.location.hash.length);
		
		if(e.data.me.options.name){
			if(hash.split(',')[0] != e.data.me.options.name){
				return;
			}
			hash = hash.split(',')[1];
		}
		
		if(e.data.me.current_hash != hash){
			e.data.me.current_hash = hash;
			e.data.me.show_step(e.data.me.current_hash);
		}
	},
	indicator_click:function(e,d){
		tc.util.log('tc.merlin.handlers.indicator_click');
		if(tc.jQ(e.target).parent().attr('href') == '#'){ e.preventDefault(); }
	},
	a_click:function(e,d){
		tc.util.log('tc.merlin.handlers.a_click');
	},
	last_step:function(e,d){
		tc.util.log('tc.merlin.handlers.last_step');
		e.preventDefault();
		if(e.data.me.current_step && e.data.me.current_step.prev_step){
			window.location.hash = e.data.me.current_step.prev_step;
			//e.data.me.show_step(e.data.me.current_step.prev_step);
		}
	},
	next_step:function(e,d){
		tc.util.log('tc.merlin.handlers.next_step');
		var valid;
		e.preventDefault();
		valid = e.data.me.validate(true);
		if(!valid){
			if(e.data.me.options.error_indicator){
				e.data.me.options.error_indicator.html('<span>Oops! Please correct the fields marked in red.</span>').show();
			}
			return;
		}
		if(e.target.className.indexOf('disabled') > 0){
			return;
		}
		if(e.data.me.current_step && e.data.me.current_step.next_step){
			if(e.data.me.options.name){
				window.location.hash = e.data.me.options.name+','+e.data.me.current_step.next_step;
			} else {
				window.location.hash = e.data.me.current_step.next_step;
			}
			
			//e.data.me.show_step(e.data.me.current_step.next_step);
		}
	},
	focus:function(e,d){
		if(e.target.className.indexOf('has-been-focused') == -1){
			tc.jQ(e.target).addClass('has-been-focused').removeClass('valid invalid').filter('[type=text]').val('');
		}
	},
	keypress:function(e,d){
		tc.util.dump(e);
		e.data.me.validate(false);
		if(e.which == 13){
			if(e.data.me.options.next_button && e.data.me.options.next_button.hasClass('enabled')){
				//e.data.me.options.next_button.click();
			}
		}
	},
	blur:function(e,d){
		if(!e.target.value.length){
			tc.jQ(e.target).removeClass('has-been-focused');
			if(e.data.me.current_step.hints){
				if(e.data.me.current_step.hints[e.target.name]){
					e.target.value = e.data.me.current_step.hints[e.target.name];
				}
			}
		}
	},
	valid:function(e,d){
		tc.util.log('tc.merlin.handlers.valid');
		if(e.data.me.options.next_button){
			e.data.me.options.next_button.removeClass('disabled').addClass('enabled');
		}
		if(e.data.me.options.error_indicator){
			e.data.me.options.error_indicator.hide();
		}
	},
	invalid:function(e,d){
		tc.util.log('tc.merlin.handlers.invalid');
		if(e.data.me.options.next_button){
			e.data.me.options.next_button.removeClass('enabled').addClass('disabled');
		}
	}
}

