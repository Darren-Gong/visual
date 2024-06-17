import os
from datetime import datetime

import numpy as np
from sklearn.linear_model import LinearRegression

# 定义基本路径和输出路径
base_path = "F:\Software\JetBrains\WebStormProject\\final\static\ASC_sea"
out_path = 'static\output'
# 初始化数据列表
u_wind_data_list = []
v_wind_data_list = []
wind_speed_data_list = []
time_data_list = []

start_year = 1979
start_month = 1

# 遍历年
for y in range(start_year, 2024):
    # 遍历月
    for m in range(start_month if y == start_year else 1, 13):
        # 遍历U和V分量
        for component in ['U', 'V']:
            asc_file = f"{base_path}\\{y}\\{str(m).zfill(2)}\\ERA5{component}\\00.asc"

            # 从ASC文件加载数据
            with open(asc_file, 'r') as f:
                # 跳过头信息
                for _ in range(6):
                    f.readline()

                # 读取数据到一个二维数组
                wind_data = []
                for line in f:
                    wind_data.append(list(map(float, line.split())))

            # 将数据转换为NumPy数组
            wind_data = np.array(wind_data)

            # 将U和V分量数据分别添加到列表中
            if component == 'U':
                u_wind_data_list.append(wind_data)
            else:
                v_wind_data_list.append(wind_data)

        # 获取时间信息，假设数据是每月一个时间点的
        time_data_list.append(datetime(y, m, 1))

# 将列表转换为NumPy数组
u_wind_data = np.array(u_wind_data_list)
v_wind_data = np.array(v_wind_data_list)
wind_speed_data = np.sqrt(u_wind_data ** 2 + v_wind_data ** 2)
time_data = np.array(time_data_list)

# 获取网格大小
rows, cols = u_wind_data[0].shape

# 创建一个数组用于保存每个点位的线性模型参数
model_parameters = np.zeros((rows, cols, 3))  # 3个参数：斜率1，斜率2，截距

# 遍历每个点位
for i in range(rows):
    for j in range(cols):
        # 获取当前点位的数据和时间
        u_point_data = u_wind_data[:, i, j]
        v_point_data = v_wind_data[:, i, j]
        wind_speed_point_data = wind_speed_data[:, i, j]
        time_point_data = time_data

        # 将数据和时间合并
        data_with_time_point = np.column_stack(
            (u_point_data.flatten(), v_point_data.flatten(), np.ones_like(u_point_data.flatten())))
        wind_speed_with_time_point = wind_speed_point_data.flatten()

        # 创建线性回归模型
        model_point = LinearRegression()

        # 训练模型
        model_point.fit(data_with_time_point, wind_speed_with_time_point)

        # 保存模型参数
        model_parameters[i, j] = [model_point.coef_[0], model_point.coef_[1], model_point.intercept_]

# 保存模型参数为原格式
for i in range(rows):
    for j in range(cols):
        output_file = os.path.join(out_path, f"ERA5_model_parameters_{i}_{j}.txt")
        np.savetxt(output_file, model_parameters[i, j])

print("模型参数已保存")
