document.getElementById("startAnalysisBtn").addEventListener("click", function() {
    var xCoordinate = document.getElementById("xCoordinate").value;
    var yCoordinate = document.getElementById("yCoordinate").value;

    if (!xCoordinate || !yCoordinate) {
        alert("请输入有效的坐标值。");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/plot", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // 将Base64编码的图像数据插入到图像容器中
            document.getElementById("plotImageContainer").innerHTML = '<img src="' + xhr.responseText + '" alt="Wind Speed Plot">';
            // 显示可移动窗口
            openModal(xhr.responseText);
        }
    };
    xhr.send("x=" + xCoordinate + "&y=" + yCoordinate);
});


function openModal(imageSrc) {
    var modalContainer = document.getElementById("modalContainer");
    var plotImageContainer = document.getElementById("plotImageContainer");

    // 设置图像
    plotImageContainer.innerHTML = '<img src="' + imageSrc + '" alt="Wind Speed Plot">';

    // 显示可移动窗口
    modalContainer.style.display = "block";
}

function closeModal() {
    var modalContainer = document.getElementById("modalContainer");
    // 关闭可移动窗口
    modalContainer.style.display = "none";
}
