document.addEventListener('DOMContentLoaded', () => {
    // 1. 信誉分展示动画逻辑
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            let currentVal = Math.floor(easeOutProgress * (end - start) + start);
            
            if (obj) obj.innerHTML = currentVal;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                if (obj) obj.innerHTML = end;
            }
        };
        window.requestAnimationFrame(step);
    }

    const scoreConfigs = [
        {
            min: 0, max: 50,
            status: 'danger',
            text: '信誉较差',
            desc: '有永久封禁风险，请尽快改善行为',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 status-color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
        },
        {
            min: 51, max: 70,
            status: 'warning',
            text: '信誉一般',
            desc: '有封号风险，可通过申诉或等待分值恢复',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 status-color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
        },
        {
            min: 71, max: 90,
            status: 'good',
            text: '信誉良好',
            desc: '上麦、弹幕及私聊功能受到影响，请注意规范行为',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 status-color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        },
        {
            min: 91, max: 100,
            status: 'excellent',
            text: '信誉极好',
            desc: '当前无功能限制，请继续保持良好行为',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 status-color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'
        }
    ];

    const randomScores = [35, 62, 85, 98];
    const targetScore = randomScores[Math.floor(Math.random() * randomScores.length)];
    
    const scoreElement = document.getElementById('trust-score');
    const progressElement = document.getElementById('score-progress');
    const cardElement = document.getElementById('trust-card');
    const statusText = document.getElementById('status-text');
    const statusDesc = document.getElementById('status-desc');
    const statusIcon = document.getElementById('status-icon');

    const config = scoreConfigs.find(c => targetScore >= c.min && targetScore <= c.max);

    if (config && cardElement) {
        setTimeout(() => {
            cardElement.setAttribute('data-status', config.status);
            if (statusText) statusText.innerText = config.text;
            if (statusDesc) statusDesc.innerText = config.desc;
            if (statusIcon) statusIcon.innerHTML = config.icon;

            animateValue(scoreElement, 0, targetScore, 1500);
            if (progressElement) progressElement.style.width = targetScore + '%';
        }, 300);
    }

    // 2. 违规账号数量滚动动画
    const highlightSpan = document.querySelector('.stats-text .highlight');
    const targetCount = 12458;
    let count = 12000; // 从一个稍微小一点的数字开始模拟跳动
    
    const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 15);
        if (count >= targetCount) {
            count = targetCount;
            clearInterval(countInterval);
        }
        // 格式化为带千位分隔符的字符串
        highlightSpan.textContent = count.toLocaleString();
    }, 40);
    
    // 3. 动态循环播报违规账号
    const tickerData = [
        { user: "用户123***2A", penalty: "封禁7天", type: "temp" },
        { user: "用户89K***op", penalty: "永久封禁", type: "permanent" },
        { user: "用户456***wQ", penalty: "封禁3天", type: "temp" },
        { user: "用户990***12", penalty: "永久封禁", type: "permanent" },
        { user: "用户MMK***88", penalty: "警告/禁言", type: "warn" }
    ];

    const tickerScroll = document.getElementById('tickerScroll');
    if (tickerScroll) {
        function buildTickerItem(data) {
            return `
                <div class="ticker-item">
                    <div class="ticker-user">
                        <i class="ri-volume-up-line"></i>
                        <span><span class="user-id">${data.user}</span> 违反平台规定</span>
                    </div>
                    <div class="ticker-penalty penalty-${data.type}">${data.penalty}</div>
                </div>
            `;
        }

        // 插入两遍以实现无缝滚动
        tickerScroll.innerHTML = tickerData.map(buildTickerItem).join('') + tickerData.map(buildTickerItem).join('');

        let currentIndex = 0;
        const totalItems = tickerData.length;
        const itemHeight = 40;

        setInterval(() => {
            currentIndex++;
            tickerScroll.style.transition = 'transform 0.5s ease-in-out';
            tickerScroll.style.transform = `translateY(-${currentIndex * itemHeight}px)`;

            // 无缝回弹：当第一组数据播完时，瞬间重置到头部
            if (currentIndex === totalItems) {
                setTimeout(() => {
                    tickerScroll.style.transition = 'none';
                    currentIndex = 0;
                    tickerScroll.style.transform = `translateY(0)`;
                }, 500);
            }
        }, 2500); // 每2.5秒向上滚动一条
    }
    
    // 4. 为所有卡片添加点击反馈交互
    const clickables = document.querySelectorAll('.action-item, .class-card, .btn-detail');
    clickables.forEach(item => {
        item.addEventListener('click', function() {
            // 这里可以接入App的原生路由或 H5 跳转逻辑
            console.log('Clicked:', this.innerText.trim() || 'Detail button');
        });
    });
});
