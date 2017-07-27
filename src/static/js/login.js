$(function() {

	var nodes = {};

	var data = {};

	var page = {
		init: function() {
			this.initNodes();
			this.initData();
			nodes.form.on('submit', this.handleSubmit);
			$('#refreshCode').on('click', function() {
				nodes.imgcode.attr('src', System.api.url + 'tools/get_img_code?t=' + Date.now());
			});

			System.localStorage.set('env', System.getParam('env') || '');
		},
		initNodes: function() {
			$.extend(nodes, {
				wrapper: $('#wrapper'),
				form: $('#form'),
				mobile: $('#mobile'),
				pwd: $('#pwd'),
				verifycode: $('#verifycode'),
				submit: $('#submit'),
				imgcode: $('#imgcode')
			});
		},
		initData: function() {
			$.extend(data, {});
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

			formData.pwd = md5(formData.pwd);
			nodes.submit.prop('disabled', true);
			System.request({
					type: 'POST',
					data: formData,
					url: 'brusher_user/login'
				})
				.done(function(response) {
					var data = response.data,
						url;
					if (response.ret == 0) {
						System.localStorage.set('auth', response.data);						
						System.redirect('index.html');
					} else if (response.ret == 2103) {
						$.toast({
							icon: 'error',
							text: '验证码不正确'
						});
						nodes.verifycode.val('');
						$('#refreshCode').trigger('click');
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