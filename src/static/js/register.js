$(function() {

	var nodes = {};

	var data = {};

	var page = {
		init: function() {
			this.initNodes();
			this.initData();
			nodes.form.on('submit', this.handleSubmit);
			System.localStorage.set('env', System.getParam('env') || '');
		},
		initNodes: function() {
			$.extend(nodes, {
				wrapper: $('#wrapper'),
				form: $('#form'),
				verifycode: $('#verifycode'),
				submit: $('#submit')
			});
		},
		initData: function() {
			$.extend(data, {

			});
		},
		handleMobileWatch: function() {
			var v = nodes.mobile.val();
			nodes.mobile.val(v);
			data.formData.username = v;
		},
		handlePwdWatch: function() {
			data.formData.password = $.trim(nodes.pwd.val());
		},
		handleVerifycodeWatch: function() {
			data.formData.code = $.trim(nodes.verifycode.val());
		},
		handleSubmit: function(event) {
			event.preventDefault();
			var formData = nodes.form.serializeObject();
			if ($.trim(formData.mobile).length == 0) {
				$.toast({
					icon: 'error',
					text: '请输入手机号'
				});
				return;
			}
			if ($.trim(formData.pwd).length == 0) {
				$.toast({
					icon: 'error',
					text: '请输入密码'
				});
				return;
			}
			if ($.trim(formData.pwd2).length == 0) {
				$.toast({
					icon: 'error',
					text: '请输入确认密码'
				});
				return;
			}
			if (formData.pwd != formData.pwd2) {
				$.toast({
					icon: 'error',
					text: '两次密码输入不一致'
				});
				return;
			}		
			formData.pwd = md5(formData.pwd2);
			nodes.submit.prop('disabled', true);
			System.request({
					type: 'POST',
					data: formData,
					url: 'brusher_user/register'
				})
				.done(function(response) {
					var data = response.data,
						url;
					if (response.ret == 0) {
						System.redirect('login.html');
					} else {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				})
				.always(function() {
					nodes.submit.prop('disabled', false);
				})
		}
	};

	page.init();

});