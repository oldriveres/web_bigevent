$(function() {
    var layer = layui.layer
    var form = layui.form
        // 导入分页对象
    var laypage = layui.laypage;
    // 定义一个查询的参数对象，将来请求数据时，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()
        // 初始化文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)

                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 为筛选按钮绑定 submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象q 中对应的属性赋值
        q.state = state;
        q.cate_id = cate_id
            // 重量渲染表格数据
        initTable()
    })

    // 渲染底部分布区域的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器 Id
            count: total, // 分页条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 指定默认选中哪一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            jump: function(obj, first) {
                q.pagenum = obj.curr;
                // 根据最新的q 获取对应的数据
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })
    }

    $('tbody').on('click', '.btn-delete', function() {
        // 获取按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len == 1) {
                        // len=1 表示删除前，还有一条，删除后就没有数据了
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })

    // 给文章编辑按钮绑定 click 单击事件
    $('body').on('click', '.btn-edit', function() {
        location.href = '/article/art_edit.html?id=' + $(this).attr('data-id')
    })
})