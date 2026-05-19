// 简单的平滑滚动功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('网站加载成功！');
    
    // 添加导航链接的平滑滚动
    var navLinks = document.querySelectorAll('.nav-links a, .footer-links a, .btn');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            
            // 只处理锚点链接
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                var targetElement = document.querySelector(href);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    console.log('导航功能已就绪');
});