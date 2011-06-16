if(app_page.data.contact_modal){
	app_page.features.push(function(app){
			
		tc.jQ('a.contact').bind('click',{
			app:app,
			source_element:tc.jQ(".modal-content.contact-user"),
			init:function(modal,event_target,callback){
				var modal_merlin;
	
				modal_merlin = new tc.merlin(app,{
					name:'contact_message',
					dom:modal.options.element.find('.contact-user'),
					next_button: modal.options.element.find('.contact-user-submit'),
					first_step: 'contact-message',
					data:{
						to_user_id:null,
						message: null
					},
					steps:{
						'contact-message':{
							selector:'.contact-message',
							next_step:'contact-message-submit',
							inputs:{
								message:{
									selector:'textarea.contact-user-text',
									counter:{
										selector:'.charlimit',
										limit:200
									}
								}
							},
							init: function(merlin, dom) {
								dom.find('.to_u_name').text(app.app_page.data.contact_modal.to_u_name);
							},
							finish: function(merlin, dom) {
								merlin.options.data = tc.jQ.extend(merlin.options.data,{
									to_user_id: app.app_page.data.contact_modal.to_u_id,
									message: merlin.current_step.inputs.message.dom.val()
								});
							}
						},
						'contact-message-submit':{
							selector:'.contact-message-submit',
							init: function(merlin, dom) {
								dom.find('.to_u_name').text(app.app_page.data.contact_modal.to_u_name);
								tc.jQ.ajax({
									type:"POST",
									url:"/directmsg",
									data:merlin.options.data,
									context:merlin,
									dataType:"text",
									success: function(data, ts, xhr) {
										if (data == "False") {
											window.location.hash = 'contact_message,contact-message-error';
										}
										tc.timer(1500, function() {
											modal.hide();
										});
									},
									error: function(jqXHR, textStatus, errorThrown){
										window.location.hash = 'contact_message,contact-message-error';
									}
								});
							}
						},
						'contact-message-success':{
							selector:'.invite-message-success',
							init: function(merlin, dom) {
								dom.find('.to_u_name').text(app.app_page.data.contact_modal.to_u_name);
							}
						},
						"contact-message-error": {
							selector:".contact-message-error",
							init: function(merlin, dom) {
								tc.timer(2000, function() {
									modal.hide();
								});
							}
						}
					}
				});
	
				modal.cleanup = function() {
					modal_merlin.deallocate_magic();
				};
	
				if(tc.jQ.isFunction(callback)){
					callback(modal);
				}
			}
		},function(e,d){
			e.preventDefault();
			e.data.app.components.modal.show(e.data, e.target);
		});
	});
};