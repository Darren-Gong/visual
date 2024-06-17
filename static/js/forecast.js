document.addEventListener('DOMContentLoaded', function () {
    // 获取按钮和用于显示返回数据的元素
    var predictButton = document.querySelector('.button'); // 使用 class 选择器获取按钮
    var returnDataElement = document.getElementById('returnData');
    var datePicker = document.getElementById('datePicker');

    // 添加点击事件监听器
    predictButton.addEventListener('click', function () {
        // 获取所选日期
        var selectedDate = datePicker.value;

        // 发送请求到 Flask 应用
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedDate: selectedDate })
        })
        .then(response => response.text())  // 使用 text() 方法获取文本响应
        .then(data => {
            // 处理返回的数据
            console.log('Returned Data:', data);
            // 将数据显示在页面上
            returnDataElement.textContent = 'Returned Data: ' + data;

            // 弹出提示框
            alert('预测完成');
        })
        .catch(error => {
            console.error('Error:', error);
            returnDataElement.textContent = 'Error occurred while fetching data.';
        });
    });
});

