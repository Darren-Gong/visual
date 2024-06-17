import os
from datetime import datetime

import numpy as np


def model_predict(future_year, future_month):
    model_path = "static/output"

    # 输入未来的年月，计算未来的风速
    future_time = datetime(future_year, future_month, 1)

    # 获取模型参数
    rows, cols = 201, 201  # 假设网格大小是 201x201
    model_parameters = np.zeros((rows, cols, 3))  # 3个参数：斜率1，斜率2，截距

    # 从保存的模型参数文件中读取数据
    for i in range(rows):
        for j in range(cols):
            parameter_file = os.path.join(model_path, f"ERA5_model_parameters_{i}_{j}.txt")
            model_parameters[i, j] = np.loadtxt(parameter_file)

    # 输入未来时刻的U和V分量（这里假设为0）
    u_input = 0
    v_input = 0

    # 遍历每个点位，进行预测
    wind_speed_predictions = np.zeros((rows, cols))

    for i in range(rows):
        for j in range(cols):
            # 获取当前点位的模型参数
            slope_u = model_parameters[i, j, 0]
            slope_v = model_parameters[i, j, 1]
            intercept = model_parameters[i, j, 2]

            # 使用模型参数进行预测
            wind_speed_prediction = slope_u * u_input + slope_v * v_input + intercept
            wind_speed_predictions[i, j] = wind_speed_prediction

    output_asc_path = 'static/ASC_sea'
    # 创建ASC文件
    asc_file1 = f"{output_asc_path}\\{future_year}\\{str(future_month).zfill(2)}\ERA5V\\00.asc"
    os.makedirs(os.path.dirname(asc_file1), exist_ok=True)
    with open(asc_file1, 'w') as f:
        # 写入头信息
        f.write(f"ncols         {cols}\n")
        f.write(f"nrows         {rows}\n")
        f.write("xllcorner     105.0\n")
        f.write("yllcorner     0.0\n")
        f.write("cellsize      0.25\n")
        f.write("NODATA_value  -32767\n")

        # 写入数据
        for row in wind_speed_predictions:
            f.write(" ".join(map(str, row)) + "\n")
    asc_file2 = f"{output_asc_path}\\{future_year}\\{str(future_month).zfill(2)}\ERA5U\\00.asc"
    os.makedirs(os.path.dirname(asc_file2), exist_ok=True)
    with open(asc_file2, 'w') as f:
        # 写入头信息
        f.write(f"ncols         {cols}\n")
        f.write(f"nrows         {rows}\n")
        f.write("xllcorner     105.0\n")
        f.write("yllcorner     0.0\n")
        f.write("cellsize      0.25\n")
        f.write("NODATA_value  -32767\n")

        # 写入数据
        for row in wind_speed_predictions:
            f.write(" ".join(map(str, row)) + "\n")

    # return asc_file


# 调用函数并获取ASC文件名
future_year = 2025
future_month = 1
asc_file_name = model_predict(future_year, future_month)

# 打印ASC文件名
print(f"ASC文件已创建")
