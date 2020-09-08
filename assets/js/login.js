$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 从layui中获取form对象
    var form = layui.form // 只要导入了layui，就有layui对象，就能得到form属性

    // layui消息框
    var layer = layui.layer

    // 通过form.verify()函数来自定义校验规则
    form.verify({
        // 自定义pwd 的校验规则
        pwd: [
            // \S 表示非空格的字符
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],

        // 两次密码校验
        repwd: function(value) {
            // 形参直接拿到了确认密码
            // 通过父级元素，用选择器拿到密码框的值
            var pwd = $('.reg-box [name=password]').val();
            // 对两次输入的密码是否相同进行判断
            if (value !== pwd) {
                return "两次密码不一致！"
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        var data = { username: $('.reg-box [name=username]').val(), password: $('.reg-box [name=password]').val() }
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            $('#link_login').click();
            layer.msg("注册成功，请登录！");
        })
    })

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！');
                }
                layer.msg('登录成功！');
                // 将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        });
    })
})