$(function() {
    // 调用getUserInfo函数获取用户基本信息
    getUserInfo()

    var layer = layui.layer
        // 退出按钮
    $('#btnlogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //do something 
            // 清空本地存储的 token 
            localStorage.removeItem('token');
            // 重新跳转到首页
            location.href = '/login.html'
                // 关闭提示框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // header是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            };
            // 调用renderAvatar渲染用户的头像
            renderAvatar(res.data)
        }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    //1、优先获取昵称nickname，如果没有就获取用户名username
    var name = user.nickname || user.username;
    // 2、设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 渲染用户头像，优先渲染图片头像，如果没有就渲染文字头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();
    }

}