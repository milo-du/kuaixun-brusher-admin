$(function() {

	var nodes = {};

	var data = {};

	var page = {
		init: function() {
			this.initNodes();
			this.initData();
			this.bindEvent();
		},
		initNodes: function() {
			$.extend(nodes, {
				wrapper: $('#wrapper'),
				table: $('#table'),
				search: $("#search"),
				url: $("#url")
			});
		},
		initData: function() {
			$.extend(data, {
				list: [],
				filter: {
					offset: 0,
					limit: 10
				}
			});
			var userInfo = System.localStorage.get('auth', true);
			nodes.url.val('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcc878ae8bfac523f&redirect_uri=http%3a%2f%2fapi2.runningdreamer.com%2fbrusher_auth&response_type=code&scope=snsapi_base&state=%s#wechat_redirect'.printf(userInfo.uid));
		},
		bindEvent: function() {
			nodes.table.on('click', '[data-action]', this.handleAction);
			//nodes.search.on('submit',this.handleSearch);
		},
		handleAction: function(event) {
			event.preventDefault();
			var self = $(this);
			action = self.attr('data-action');

			switch (action) {
				case 'recive':
					page.handleRecive(self);
					break;
			}
		},
		handleRecive: function(self) {
			var id = self.attr('data-id');
			return System.request({
					type: 'POST',
					url: 'brusher_job/recive',
					data: {
						jobID: id
					}
				})
				.done(function(response) {
					if (response.ret == 0) {
						$.toast({
							icon: 'success',
							text: '领取成功'
						});
						nodes.table.bootstrapTable('refresh');
					} else {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				});
		},
		handleSearch: function(event) {
			event.preventDefault();
		},
		getData: function(params) {
			return System.request({
					type: 'GET',
					url: 'brusher_job/get_list',
					data: $.extend(data.filter, {
						begin: params.data.offset,
						limit: params.data.limit
					})
				})
				.done(function(response) {
					if (response.ret == 0) {
						var list = {
							rows: response.data.data,
							total: response.data.total
						};
						params.success(list);
						data.filter.keyWord = null;
						data.list = response.data;
					} else {
						$.toast({
							icon: 'error',
							text: response.msg
						});
					}
				})
		},
		operateFormatter: function(value, row, index) {
			var tpl = ['<div class="btn-group btn-group-xs opr-btn">'];
			if (row.reciveState == "0") {
				tpl.push('<button data-action="recive" data-id="' + row.ID + '" class="btn btn-sm btn-success" type="button">领取</button>');
			}
			tpl.push('</div>');

			return tpl.join('');
		},
		statusFormatter: function(value, row, index) {
			if (row.reciveState == "0") {
				return '您未领取';
			} else {
				return '您已领取';
			}
		},
		timeFormatter: function(value, row, index) {
			return new Date(row.create_time * 1000).format('Y年M月d日 H:m:s');
		},
	};

	page.init();
	window.getData = page.getData;
	window.operateFormatter = page.operateFormatter;
	window.statusFormatter = page.statusFormatter;
});