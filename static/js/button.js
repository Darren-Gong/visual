document.addEventListener('DOMContentLoaded', function () {
    var startPredictionButton = document.getElementById('startPredictionButton');

    var startAnalysisBtn = document.getElementById('startAnalysisBtn');

    var loading = document.querySelector('.loading');
    var loadOk = document.querySelector('.loadOk');
    var loadOk1 = document.querySelector('.loadOk1');

    startPredictionButton.addEventListener('click', function () {
        // 显示loading动画
        loading.style.display = 'block';

        // 模拟加载过程，持续10秒
        setTimeout(function () {
            // 隐藏loading动画
            loading.style.display = 'none';
            // 显示加载完成提示
            loadOk.style.display = 'block';
            // 设置定时器，在2秒后隐藏加载完成提示
            setTimeout(function () {
                loadOk.style.display = 'none';
            }, 1500);
        }, 13000); // 13秒
    });
    startAnalysisBtn.addEventListener('click', function () {
        // 显示loading动画
        loading.style.display = 'block';

        // 模拟加载过程，持续10秒
        setTimeout(function () {
            // 隐藏loading动画
            loading.style.display = 'none';
            // 显示加载完成提示
            loadOk1.style.display = 'block';
            // 设置定时器，在2秒后隐藏加载完成提示
            setTimeout(function () {
                loadOk1.style.display = 'none';
            }, 1500);
        }, 20000);//20s
    });
});