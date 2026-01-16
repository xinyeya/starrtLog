$(document).ready(function() {
    let currentUser = null;

    // --- 星空背景逻辑 (Starry Sky Logic) ---
    const starsContainer = document.getElementById('stars-container');
    const starCount = 100; // 减少星星数量以优化性能 (原300)
    const stars = [];

    // 创建静态背景星星
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'static-star';
        
        // 随机位置 (百分比)
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // 随机大小 (2px - 4px)
        const size = Math.random() * 2 + 2; 
        
        // 随机闪烁动画时长 (1s - 3s)
        const duration = Math.random() * 2 + 1; 

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.setProperty('--duration', `${duration}s`);
        
        // 存储数据用于星座连线效果
        stars.push({ element: star, x, y });
        starsContainer.appendChild(star);
    }

    // 星座连线特效 (鼠标附近的星星连线)
    const constellationCanvas = document.createElement('canvas');
    const ctx = constellationCanvas.getContext('2d');
    const connectionDistance = 150; // 连线触发距离
    const mouse = { x: -1000, y: -1000 }; // 初始鼠标位置在屏幕外

    // 调整画布大小
    const resizeCanvas = () => {
        const rect = starsContainer.getBoundingClientRect();
        constrainCanvasSize(constellationCanvas, rect.width, rect.height);
    };
    
    const constrainCanvasSize = (canvas, w, h) => {
        canvas.width = w;
        canvas.height = h;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none'; // 确保鼠标事件穿透
        canvas.style.zIndex = '-1';
    }

    resizeCanvas();
    starsContainer.appendChild(constellationCanvas);
    window.addEventListener('resize', resizeCanvas);

    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        drawConstellations();
    });

    // 绘制星座连线
    function drawConstellations() {
        ctx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);
        
        // 性能优化：只计算鼠标附近的星星
        const w = constellationCanvas.width;
        const h = constellationCanvas.height;
        
        // 优化：仅连接星星与鼠标，移除 O(N^2) 的星星间连线
        stars.forEach(star => {
            const starX = (star.x / 100) * w;
            const starY = (star.y / 100) * h;
            
            const dx = mouse.x - starX;
            const dy = mouse.y - starY;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < connectionDistance) {
                // 绘制鼠标到星星的连线
                ctx.beginPath();
                ctx.moveTo(mouse.x, mouse.y);
                ctx.lineTo(starX, starY);
                // 距离越近线越清晰
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist/connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
        
        // 使用 requestAnimationFrame 保持流畅动画
        requestAnimationFrame(drawConstellations);
    }
    
    // 初始绘制
    drawConstellations();


    // --- 流星雨逻辑 (Shooting Stars Logic) ---
    // 随机爆发模式："每3秒一次，随机产生3-10颗流星"
    function scheduleShootingStar() {
        // 间隔：约3000ms
        const interval = 3000;
        
        setTimeout(() => {
            triggerMeteorShower();
            scheduleShootingStar(); // 重新调度下一次爆发
        }, interval);
    }

    function triggerMeteorShower() {
        // 随机数量：3 到 10 颗
        const count = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
        
        for(let i=0; i<count; i++) {
            // 为每颗流星添加微小的随机延迟，避免同时出现
            setTimeout(() => {
                createShootingStar();
            }, Math.random() * 2000); // 在2秒内分散出现
        }
    }

    function createShootingStar(x, y) {
        const $container = $('<div class="shooting-star-container"></div>');
        const $star = $('<div class="shooting-star"></div>');
        
        // 随机大小：0.3倍 到 1.4倍
        const scale = Math.random() * (1.4 - 0.3) + 0.3;
        $container.css('transform', `scale(${scale})`); 

        // 物理逻辑：大流星下落快（时长短），小流星下落慢（时长长）
        // 公式映射：scale 0.3 -> 5.0s, scale 1.4 -> 1.0s
        const duration = 5.0 - ((scale - 0.3) / 1.1) * 4.0;
        
        $star.css('--duration', `${duration}s`);

        $container.append($star);

        let startY, startX;

        if (x !== undefined && y !== undefined) {
            startX = x;
            startY = y;
        } else {
            // 随机生成位置：主要在右侧和上半部分
            startY = Math.random() * (window.innerHeight * 0.7); 
            startX = Math.random() * window.innerWidth;
        }

        // 方向：从右上往左下 (约120-150度)
        const angle = Math.random() * 30 + 120; 
        
        // 组合变换：位移 -> 旋转 -> 缩放
        $container.css({
            top: startY + 'px',
            left: startX + 'px',
            transform: `rotate(${angle}deg) scale(${scale})`
        });
        
        $('#stars-container').append($container);
        
        // 动画结束后移除元素 (预留足够时间)
        setTimeout(() => $container.remove(), 6000);
    }
    
    // 启动流星循环
    scheduleShootingStar();
    // 立即触发一次演示
    triggerMeteorShower();


    // --- 现有应用逻辑 (App Logic) ---

    // 鼠标点击特效 (波纹)
    $(document).click(function(e) {
        const effect = $('<div class="click-ripple"></div>');
        effect.css({ top: e.clientY - 10, left: e.clientX - 10 });
        $('body').append(effect);
        setTimeout(() => effect.remove(), 600);
        
        // (可选) 点击生成流星代码已注释
        // createShootingStar(e.clientX, e.clientY);
    });

    // 导航栏滚动变色效果
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }
    });

    // 初始化富文本编辑器 (Summernote)
    $('#summernote').summernote({
        placeholder: '记录你的想法...',
        tabsize: 2,
        height: 400,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['insert', ['link', 'picture']],
          ['view', ['fullscreen', 'codeview']]
        ],
        callbacks: {
            onImageUpload: function(files) {
                alert('图片上传暂未配置后端存储，建议使用图片链接。');
            }
        }
    });

    // 身份验证检查
    function checkAuth() {
        $.get('/api/auth', function(data) {
            if (data.authenticated) {
                currentUser = data.role;
                initApp();
            } else {
                // 检查是否为分享链接
                const urlParams = new URLSearchParams(window.location.search);
                const shareId = urlParams.get('share');
                if (shareId) {
                    // 加载分享的公开日志
                    loadSharedLog(shareId);
                } else {
                    $('#loginModal').modal('show');
                }
            }
        });
    }

    // 登录逻辑
    $('#loginBtn').click(function() {
        const password = $('#passwordInput').val();
        $.post('/api/login', { password: password })
            .done(function(data) {
                if (data.success) {
                    $('#loginModal').modal('hide');
                    currentUser = data.role;
                    initApp();
                }
            })
            .fail(function() {
                $('#loginError').text('口令错误，无法进入星空。');
            });
    });

    // 切换密码可见性
    $('#togglePassword').click(function() {
        const input = $('#passwordInput');
        const icon = $(this).find('i');
        
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // 登出逻辑
    $('#logoutBtn').click(function() {
        $.post('/api/logout', function() {
            location.reload();
        });
    });

    // 初始化应用
    function initApp() {
        $('#app').removeClass('d-none');
        if (currentUser === 'admin') {
            $('#newPostBtn').removeClass('d-none');
        }
        loadLogs();

        // 登录后检查分享链接
        const urlParams = new URLSearchParams(window.location.search);
        const shareId = urlParams.get('share');
        if (shareId) {
            const log = allLogs.find(l => l._id === shareId);
            if(log) {
                showLogModal(log);
            } else {
                // 尝试直接获取
                $.get('/api/public/logs/' + shareId, function(log) {
                    showLogModal(log);
                });
            }
            // 清理 URL
            window.history.replaceState({}, document.title, "/");
        }
    }

    // 加载分享日志 (公开)
    function loadSharedLog(id) {
        $.get('/api/public/logs/' + id)
            .done(function(log) {
                $('#app').removeClass('d-none'); // 显示应用框架
                // 隐藏交互元素
                $('#newPostBtn').addClass('d-none'); 
                $('#logoutBtn').addClass('d-none'); 
                
                // 清空看板
                $('#kanbanBoard').empty(); 
                // 直接显示弹窗
                showLogModal(log);
                
                // 导航栏添加登录按钮
                $('.navbar-nav').html('<li class="nav-item"><a class="nav-link" href="#" id="guestLoginBtn">登录</a></li>');
                $('#guestLoginBtn').click(function(e) {
                    e.preventDefault();
                    $('#loginModal').modal('show');
                });
            })
            .fail(function() {
                // 重定向到 404 页面
                window.location.href = '/404.html';
            });
    }

    // 加载所有日志
    let allLogs = [];
    function loadLogs() {
        const search = $('#searchInput').val();
        
        let url = '/api/logs?';
        if (search) url += `search=${encodeURIComponent(search)}&`;
        
        $.get(url, function(logs) {
            allLogs = logs;
            renderBoard(logs);
            renderTimeline(logs);
        });
    }

    // 渲染瀑布流看板 (Masonry)
    function renderBoard(logs) {
        const container = $('#kanbanBoard');
        // 如果已初始化 Masonry，先销毁
        if (container.data('masonry')) {
            container.masonry('destroy');
        }
        container.empty();
        
        if (logs.length === 0) {
            container.html('<div class="col-12 text-center text-muted py-5"><i class="far fa-star fa-2x mb-3 d-block"></i>暂无星空记录</div>');
            return;
        }

        logs.forEach(log => {
            const date = new Date(log.createdAt).toLocaleDateString();
            
            // 去除 HTML 标签以生成预览文本
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = log.content;
            const textContent = tempDiv.textContent || tempDiv.innerText || "";
            // 截断逻辑由 CSS line-clamp 处理，这里提供足够文本即可
            const preview = textContent.substring(0, 300); 

            const card = `
                <div class="col-md-6 col-lg-4 grid-item">
                    <div class="kanban-card" data-id="${log._id}">
                        <div class="card-meta">
                            <span><i class="far fa-clock me-1"></i>${date}</span>
                        </div>
                        <h3 class="card-title">${log.title}</h3>
                        <div class="card-preview">${preview}</div>
                        ${currentUser === 'admin' ? `
                        <div class="mt-auto pt-3 d-flex justify-content-end gap-2 opacity-50 hover-opacity-100 transition">
                            <button class="btn btn-sm btn-outline-info rounded-circle edit-btn" title="编辑"><i class="fas fa-pen"></i></button>
                            <button class="btn btn-sm btn-outline-danger rounded-circle delete-btn" title="删除"><i class="fas fa-trash"></i></button>
                        </div>` : ''}
                    </div>
                </div>
            `;
            container.append(card);
        });

        // 延迟初始化 Masonry 以确保 DOM 渲染完成
        setTimeout(() => {
            container.masonry({
                itemSelector: '.grid-item',
                percentPosition: true
            });
        }, 100);
    }

    // 渲染时间轴
    function renderTimeline(logs) {
        const list = $('#timelineList');
        list.empty();
        
        // 按 年-月 分组
        const groups = {};
        logs.forEach(log => {
            const date = new Date(log.createdAt);
            const key = `${date.getFullYear()}年${date.getMonth() + 1}月`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(log);
        });

        Object.keys(groups).forEach(key => {
            const groupHtml = $(`<div class="timeline-year">${key}</div>`);
            list.append(groupHtml);
            
            groups[key].forEach(log => {
                const date = new Date(log.createdAt);
                const day = date.getDate() + '日';
                const item = `
                    <a href="#" class="timeline-item" data-id="${log._id}">
                        <span class="me-2 small opacity-50">${day}</span>
                        <span>${log.title}</span>
                    </a>
                `;
                list.append(item);
            });
        });
    }

    // 事件监听器
    $('#searchBtn').click(loadLogs);
    $('#searchInput').on('keyup', function(e) { 
        if(e.key === 'Enter') loadLogs();
    });
    
    // 显示日志详情弹窗
    function showLogModal(log) {
        $('#viewTitle').text(log.title);
        $('#viewContent').html(log.content);
        $('#viewDate').html(`<i class="far fa-calendar me-1"></i>${new Date(log.createdAt).toLocaleString()}`);
        
        // 重置控件
        const $controls = $('#shareControls');
        const $linkContainer = $('#shareLinkContainer');
        const $linkInput = $('#shareLinkInput');
        const $copyBtn = $('#copyShareLinkBtn');
        $controls.empty();
        $linkContainer.addClass('d-none');

        // 仅管理员可见分享控件
        if (currentUser === 'admin') {
            if (log.shareToken) {
                // 已分享状态
                const shareUrl = window.location.origin + '/?share=' + log.shareToken;
                
                const $cancelBtn = $('<button class="btn btn-sm btn-outline-danger rounded-pill"><i class="fas fa-ban me-1"></i>取消分享</button>');
                $cancelBtn.click(function() {
                    if(confirm('取消分享后，原来的链接将失效，是否继续？')) {
                        $.post('/api/logs/' + log._id + '/unshare', function() {
                            // 更新本地数据
                            log.shareToken = null;
                            const idx = allLogs.findIndex(l => l._id === log._id);
                            if(idx !== -1) allLogs[idx].shareToken = null;
                            showLogModal(log); // 重新渲染
                        });
                    }
                });
                
                $controls.append($cancelBtn);
                $linkContainer.removeClass('d-none');
                $linkInput.val(shareUrl);
                
                // 复制按钮逻辑
                $copyBtn.off('click').click(function() {
                    const onSuccess = function() {
                        const originalHtml = $copyBtn.html();
                        $copyBtn.html('<i class="fas fa-check"></i>');
                        
                        // Show Starry Toast
                        const toastEl = document.getElementById('starryToast');
                        const toast = new bootstrap.Toast(toastEl);
                        toast.show();

                        setTimeout(() => $copyBtn.html(originalHtml), 2000);
                    };

                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(shareUrl).then(onSuccess).catch(err => {
                            console.error('Failed to copy: ', err);
                            // 如果 clipboard API 失败，尝试 fallback
                            fallbackCopyTextToClipboard(shareUrl);
                        });
                    } else {
                        fallbackCopyTextToClipboard(shareUrl);
                    }

                    function fallbackCopyTextToClipboard(text) {
                        var textArea = document.createElement("textarea");
                        textArea.value = text;
                        
                        // 避免页面滚动
                        textArea.style.top = "0";
                        textArea.style.left = "0";
                        textArea.style.position = "fixed";
                        textArea.style.opacity = "0";

                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();

                        try {
                            var successful = document.execCommand('copy');
                            if(successful) onSuccess();
                        } catch (err) {
                            console.error('Fallback: Oops, unable to copy', err);
                            alert('复制失败，请手动复制链接');
                        }

                        document.body.removeChild(textArea);
                    }
                });

            } else {
                // 未分享状态
                const $shareBtn = $('<button class="btn btn-sm btn-outline-info rounded-pill"><i class="fas fa-share-alt me-1"></i>生成分享链接</button>');
                $shareBtn.click(function() {
                    $.post('/api/logs/' + log._id + '/share', function(data) {
                        if(data.success) {
                            // 更新本地数据
                            log.shareToken = data.shareToken;
                            const idx = allLogs.findIndex(l => l._id === log._id);
                            if(idx !== -1) allLogs[idx].shareToken = data.shareToken;
                            showLogModal(log); // 重新渲染
                        }
                    });
                });
                $controls.append($shareBtn);
            }
        } else {
            // 访客模式不显示控件
        }

        $('#viewModal').modal('show');
    }

    // 点击卡片或时间轴项查看详情
    $(document).on('click', '.kanban-card, .timeline-item', function(e) {
        if ($(e.target).closest('.edit-btn, .delete-btn').length) return;
        e.preventDefault();
        const id = $(this).data('id');
        const log = allLogs.find(l => l._id === id);
        if (log) {
            showLogModal(log);
            // 高亮时间轴项
            $('.timeline-item').removeClass('active');
            $(`.timeline-item[data-id="${id}"]`).addClass('active');
        }
    });

    // 新建日志按钮
    $('#newPostBtn').click(function() {
        $('#postModalTitle').text('新建日志');
        $('#postId').val('');
        $('#postTitle').val('');
        $('#summernote').summernote('code', '');
        $('#postModal').modal('show');
    });

    // 编辑按钮
    $(document).on('click', '.edit-btn', function(e) {
        e.stopPropagation();
        const id = $(this).closest('.kanban-card').data('id');
        const log = allLogs.find(l => l._id === id);
        if (log) {
            $('#postModalTitle').text('编辑日志');
            $('#postId').val(log._id);
            $('#postTitle').val(log.title);
            $('#summernote').summernote('code', log.content);
            $('#postModal').modal('show');
        }
    });

    // 删除按钮
    $(document).on('click', '.delete-btn', function(e) {
        e.stopPropagation();
        if (confirm('确定要让这条记忆消失在星空中吗？')) {
            const id = $(this).closest('.kanban-card').data('id');
            $.ajax({
                url: '/api/logs/' + id,
                type: 'DELETE',
                success: function() {
                    loadLogs();
                }
            });
        }
    });

    // 保存/发布日志
    $('#savePostBtn').click(function() {
        const id = $('#postId').val();
        const data = {
            title: $('#postTitle').val(),
            status: 'done', // 默认为已完成
            content: $('#summernote').summernote('code')
        };

        if(!data.title || !data.content) {
            alert('标题和内容不能为空');
            return;
        }

        if (id) {
            $.ajax({
                url: '/api/logs/' + id,
                type: 'PUT',
                data: data,
                success: function() {
                    $('#postModal').modal('hide');
                    loadLogs();
                }
            });
        } else {
            $.post('/api/logs', data, function() {
                $('#postModal').modal('hide');
                loadLogs();
            });
        }
    });

    // 初始检查认证
    checkAuth();
});
