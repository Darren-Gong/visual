document.addEventListener("DOMContentLoaded", function () {
    const calendarInput = document.getElementById("calendar");

    // 函数：根据日历选择的日期更新数据和界面
    function updateData(selectedDate) {
        var formattedDate = selectedDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        formattedDate = formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2})/, '$3/$1/$2, $4');
        formattedDate = formattedDate.replace(/(\d{4}\/\d{2}\/\d{2},) 24/, '$1 00');

        const extracted = extractDateAndTime(formattedDate);
        if (extracted) {
            // 将提取的日期和时间传递给 loadAndDisplayData 函数
            loadAndDisplayData(extracted.date, extracted.time);
        } else {
            console.log("Invalid date format");
            // 根据需要进行错误处理
        }
    }

    // 函数：从格式化的日期字符串中提取日期和时间
    function extractDateAndTime(formattedDate) {
        const match = formattedDate.match(/(\d{4})\/(\d{2})\/(\d{2}), (\d{2}):(\d{2})/);

        if (match) {
            const extractedDate = match[1] + match[2] + match[3]; // YYYYMMDD
            const extractedTime = match[4]; // 小时

            return { date: extractedDate, time: extractedTime };
        }

        return null;
    }

    // 日历组件更改时的事件监听器
    calendarInput.addEventListener("change", function () {
        const yearMonth = this.value.split('-');
        const year = parseInt(yearMonth[0]);
        const month = parseInt(yearMonth[1]) - 1;

        const selectedDate = new Date(year, month, 1);
        selectedDate.setHours(0, 0, 0, 0);
        updateData(selectedDate);
    });

    // 初始化日历组件并触发更新
    calendarInput.value = '1979-01';
    const initialSelectedDate = new Date(calendarInput.value);
    initialSelectedDate.setHours(0, 0, 0, 0);
    updateData(initialSelectedDate);
});
