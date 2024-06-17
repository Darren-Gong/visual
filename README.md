# visual
ERA5数据集下载地址：https://cds.climate.copernicus.eu/cdsapp#!/dataset/reanalysis-era5-single-levels?tab=form

通过对1979-2023年间的风速数据进行详细的可视化分析，可以揭示中国海域风速的长期变化趋势。这种趋势分析对于理解气候变化、预测极端天气事件以及规划可再生能源项目都具有重要的意义。同时，风能资源的可视化与评估是确保风力发电项目可行性的关键步骤。通过这方面的研究，可以更好地了解不同地区的风能资源分布，为可再生能源规划提供科学依据。

本项目是一个综合运用前端(HTML、CSS、JavaScript、Leafet库)、后端(Flask)、数据处理(NumPy、Matplotlib)和可视化(d3.is)技术的风能数据可视化与预测应用。通过Leafet 实现交互式地图，展示海洋风能数据的空间分布，同时使用 Matplotlib 绘制风能随时间变化的曲线图。后端通过 Flask 处理前端请求，对ASCI格式风场数据进行解析、映射和计算，提供了 /predict 路由用于接收日期参数并返回风能预测结果，/plot 路由接收经纬度并返回该点历年的风能变化曲线和平均值
