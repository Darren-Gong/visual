import base64
import io
from datetime import datetime

import matplotlib.pyplot as plt
import numpy as np

# 定义基本路径
base_path = "F:\Software\JetBrains\WebStormProject\\final\static\ASC_sea"

# 初始化数据列表
u_wind_data_list = []
v_wind_data_list = []
wind_speed_data_list = []
time_data_list = []

start_year = 1979
start_month = 1


def map_coordinates(lat, lon):
    # 定义原始范围
    min_lat, max_lat = 0, 50
    min_lon, max_lon = 105, 155

    # 定义目标范围
    target_min, target_max = 0, 200

    # 进行线性映射
    mapped_lat = int((lat - min_lat) / (max_lat - min_lat) * (target_max - target_min))
    mapped_lon = int((lon - min_lon) / (max_lon - min_lon) * (target_max - target_min))

    return mapped_lat, mapped_lon


# 读取数据的函数
def read_data(x, y):
    # x, y = map_coordinates(x, y)
    u_data = []
    v_data = []
    speed_data = []
    time_data = []

    for year in range(start_year, 2024):
        for month in range(start_month if year == start_year else 1, 13):
            for component in ['U', 'V']:
                asc_file = f"{base_path}\\{year}\\{str(month).zfill(2)}\\ERA5{component}\\00.asc"

                with open(asc_file, 'r') as f:
                    for _ in range(6):
                        f.readline()

                    wind_data = []
                    for line in f:
                        wind_data.append(list(map(float, line.split())))

                wind_data = np.array(wind_data)

                if component == 'U':
                    u_data.append(wind_data[x, y])
                else:
                    v_data.append(wind_data[x, y])

            time_data.append(datetime(year, month, 1))

    u_data = np.array(u_data)
    v_data = np.array(v_data)
    speed_data = np.sqrt(u_data ** 2 + v_data ** 2)
    time_data = np.array(time_data)

    return time_data, u_data, v_data, speed_data


# 示例绘制曲线的函数
# 将绘图任务放在一个单独的函数中
def plot_data_curve(x, y):
    x1, y1 = map_coordinates(x, y)
    time, u_data, v_data, speed_data = read_data(x1, y1)

    # 计算平均风速
    avg_speed = np.mean(speed_data)

    plt.figure(figsize=(10, 6))
    plt.plot(time, speed_data, label=f'Wind Energy at ({x}, {y})')
    plt.axhline(y=avg_speed, color='red', linestyle='--', label=f'Average Wind Energy ({avg_speed:.2f} KW)')
    plt.title(f'Wind Energy Over Time at Point ({x}, {y})')
    plt.xlabel('Time')
    plt.ylabel('Wind Energy (KW)')
    plt.legend()

    # 将图像保存为BytesIO对象
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png')
    img_buffer.seek(0)

    # 将图像转换为Base64编码的字符串
    img_str = "data:image/png;base64," + base64.b64encode(img_buffer.read()).decode()

    plt.close()

    return img_str


# 示例：绘制坐标为(100, 100)的数据曲线
plot_data_curve(50, 105)
