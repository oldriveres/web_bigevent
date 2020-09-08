 // 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
 // 会先调用 ajaxPrefilter 这个函数，此函数会拿到传递进来的配置对象
 $.ajaxPrefilter(function(options) {
     //1、  在发起真正的 Ajax请求之前，统一拼接请求的根路径
     options.url = 'http://ajax.frontend.itheima.net' + options.url

     //2、  为有权限的接口<font color=red>统一设置headers请求头
     if (options.url.indexOf('/my/') !== -1) {
         options.headers = {
             Authorization: localStorage.getItem('token') || ''
         }
     }

     //  全局统一挂载 complete 回调函数
     options.complete = function(res) {
         // 不论成功还是失败，都会调用complete函数
         console.log(res);
         if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
             // 1、强制清空token
             localStorage.removeItem('token');
             // 2、强制跳转到登录页
             location.href = '/login.html'
         }
     }
 })