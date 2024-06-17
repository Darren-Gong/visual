import matplotlib.pyplot as plt
from flask import Flask, render_template, request

from analysis import plot_data_curve
from forecast import model_predict

app = Flask(__name__)

plt.switch_backend('Agg')


@app.route('/')
def index():
    return render_template('main.html')


@app.route('/predict', methods=['POST'])
def predict():
    # 获取前端传递的日期参数
    future_date = request.json.get('selectedDate')

    # 解析日期参数，获取年月
    future_year, future_month = map(int, future_date.split('-'))

    # 调用 model_predict 函数获取预测结果
    wind_speed_predictions = model_predict(future_year, future_month)

    return '预测完成'


# 处理传入请求的路由
@app.route('/plot', methods=['POST'])
def plot_route():
    # 在这里手动调用绘图任务
    x = int(request.form['x'])
    y = int(request.form['y'])
    print(f"Received request for coordinates: ({x}, {y})")
    img_str = plot_data_curve(x, y)
    print("Generated image data successfully")
    return img_str


if __name__ == '__main__':
    app.run(debug=True)

# set FLASK_APP=app.py
# python -m flask run
