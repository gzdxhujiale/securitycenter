document.addEventListener('DOMContentLoaded', () => {
    // 假设当前用户分数为 95 (信用优秀) 
    // 您可以修改这里为 85(良好), 65(较差), 30(极差) 来测试不同状态
    const score = 95; 
    
    const progressCircle = document.querySelector('.progress-circle');
    const scoreValue = document.querySelector('.score-value');
    const statusTitle = document.querySelector('.status-title');
    const statusDesc = document.querySelector('.status-desc');
    
    // 计算环形进度条的偏移量
    const radius = progressCircle.r.baseVal.value; // r="54"
    const circumference = 2 * Math.PI * radius; // 约等于 339.29
    
    // 逻辑：90-100:优秀, 70-90:良好, 50-70:较差, 0-50:极差
    let colorVar, statusText, descText, shadowColor;
    
    if (score >= 90) {
        colorVar = 'var(--success)'; // #10b981
        shadowColor = 'rgba(16, 185, 129, 0.4)';
        statusText = '信用优秀';
        descText = '当前无功能限制，请继续保持良好行为';
    } else if (score >= 70) {
        colorVar = 'var(--primary-dark)'; // #4f46e5
        shadowColor = 'rgba(79, 70, 229, 0.4)';
        statusText = '信用良好';
        descText = '上麦、弹幕及私聊功能受到影响，请注意规范行为';
    } else if (score >= 50) {
        colorVar = 'var(--warning)'; // #f59e0b
        shadowColor = 'rgba(245, 158, 11, 0.4)';
        statusText = '信用较差';
        descText = '有封号风险，可通过申诉或等待分值恢复';
    } else {
        colorVar = 'var(--danger)'; // #ef4444
        shadowColor = 'rgba(239, 68, 68, 0.4)';
        statusText = '信用极差';
        descText = '有永久封禁风险，请尽快改善行为';
    }

    // 应用颜色和文案状态
    statusTitle.textContent = statusText;
    statusTitle.style.color = colorVar;
    statusDesc.textContent = descText;
    progressCircle.style.stroke = colorVar;
    progressCircle.style.filter = `drop-shadow(0 4px 8px ${shadowColor})`;
    
    // 分数递增动画
    let currentScore = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function animateScore(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        
        currentScore = Math.floor(easeProgress * score);
        scoreValue.textContent = currentScore;
        
        if (progress < 1) {
            requestAnimationFrame(animateScore);
        } else {
            scoreValue.textContent = score;
        }
    }
    
    requestAnimationFrame(animateScore);
    
    // 进度条动画
    setTimeout(() => {
        const offset = circumference - (score / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }, 100);

    // Tab 栏切换逻辑
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有 active 状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // 为当前点击的按钮和对应的内容添加 active
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
});
