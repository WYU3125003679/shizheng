// 阅读进度记忆功能
(function() {
    // 存储的键名前缀
    const STORAGE_PREFIX = 'novel_reading_';
    
    // 获取当前页面的唯一标识（使用文件路径或文件名）
    function getPageKey() {
        // 例如：/shizheng/chapter-01.html -> chapter-01
        let path = window.location.pathname;
        let filename = path.substring(path.lastIndexOf('/') + 1);
        // 去除扩展名
        filename = filename.replace(/\.(html|md)$/, '');
        return STORAGE_PREFIX + filename;
    }
    
    // 保存滚动位置
    function saveScrollPosition() {
        const key = getPageKey();
        const scrollY = window.scrollY;
        if (scrollY !== undefined) {
            localStorage.setItem(key, scrollY.toString());
        }
    }
    
    // 恢复滚动位置
    function restoreScrollPosition() {
        const key = getPageKey();
        const savedScrollY = localStorage.getItem(key);
        if (savedScrollY !== null && !isNaN(parseInt(savedScrollY))) {
            // 延迟执行，确保页面内容完全加载
            setTimeout(function() {
                window.scrollTo({
                    top: parseInt(savedScrollY),
                    behavior: 'smooth'  // 平滑滚动
                });
            }, 100);
        }
    }
    
    // 监听滚动事件（使用防抖，避免频繁写入）
    let scrollTimeout;
    function onScroll() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            saveScrollPosition();
        }, 300);  // 停止滚动 300ms 后保存
    }
    
    // 监听页面关闭或刷新前再保存一次
    function onBeforeUnload() {
        saveScrollPosition();
    }
    
    // 启动监控
    window.addEventListener('scroll', onScroll);
    window.addEventListener('beforeunload', onBeforeUnload);
    
    // 页面加载后恢复位置
    restoreScrollPosition();
    
    // 如果页面是 Ajax 局部加载（比如通过返回按钮），也需要处理
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            restoreScrollPosition();
        }
    });
})();