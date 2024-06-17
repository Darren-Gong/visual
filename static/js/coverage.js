const map = L.map('map', {
    center: [28, 135],
    zoom: 4
});

// 创建额外的图层
const areaLayer = L.tileLayer('/static/mapTile/{z}/{x}/{y}.png', {
    className: 'area-layer'  // 添加类名
}).addTo(map)
const labelLayer = L.tileLayer('/static/mapLabel/{z}/{x}/{y}.png', {
    className: 'label-layer'  // 添加类名
}).addTo(map)

// sss
var vectorLayer, magnitude, direction, windenergy;
var layerControl;


function loadAndDisplayData(date) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    // 根据选择的日期和时间构建文件路径
    var uFilePath = '/static/ASC_sea/' + year + '/' + month + '/ERA5U/' + '00.asc';
    var vFilePath = '/static/ASC_sea/' + year + '/' + month + '/ERA5V/' + '00.asc';

    d3.text(uFilePath, function (u) {
        originalUData = u;
        d3.text(vFilePath, function (v) {
            originalVData = v;
            displayVectorField(u, v);
        });
    });
}

let xCoordinateInput = document.getElementById("xCoordinate");
let yCoordinateInput = document.getElementById("yCoordinate");

function displayVectorField(u, v) {
    removeOldLayers();
    let scaleFactor = 0.062; // to m/s
    // 创建一个向量场
    let vf = L.VectorField.fromASCIIGrids(u, v, scaleFactor);
    var range = vf.range;
    var vectorScale = chroma.scale(['#f0f5e5']).domain(range);

    // 创建热力图层
    const s = vf.getScalarField('magnitude');
    magnitude = L.canvasLayer.scalarField(s, {
        color: chroma.scale(['#008ae5', '#67b8e5', '#a7dcd4', '#95e9a1', '#bcf456', '#ffff00']).domain([0, 0.2, 0.4, 1]),
        opacity: 0.7,
        interpolate: true
    });

    // 创建矢量图层
    vectorLayer = L.canvasLayer.vectorFieldAnim(vf, {
        paths: 350,
        color: vectorScale,
        velocityScale: 1 / 10,
        frameRate: 500,
        width: 2.5
    });

    // 创建方向层
    direction = L.canvasLayer.scalarField(vf.getScalarField('directionFrom'), {
        type: 'vector',
        color: 'white',
        vectorSize: 25,
        arrowDirection: 'from'
    });

    // 构建 ASCII 格式的风能数据
    let windPowerASCII = "NCOLS " + vf.nCols + "\n";
    windPowerASCII += "NROWS " + vf.nRows + "\n";
    windPowerASCII += "XLLCORNER " + vf.xllCorner + "\n";
    windPowerASCII += "YLLCORNER " + vf.yllCorner + "\n";
    windPowerASCII += "CELLSIZE " + vf.cellXSize + "\n";
    windPowerASCII += "NODATA_VALUE " + vf.noDataValue + "\n";

    for (let i = 0; i < vf.nRows; i++) {
        for (let j = 0; j < vf.nCols; j++) {
            let cell = vf._valueAtIndexes(j, i);
            let windPowerValue = cell !== null ? calculateWindPower(cell.u, cell.v) : vf.noDataValue;
            windPowerASCII += windPowerValue + " ";
        }
        windPowerASCII += "\n";
    }

    // 使用 ASCII 格式的风能数据创建风能标量场
    let ev = L.ScalarField.fromASCIIGrid(windPowerASCII);

    windenergy = L.canvasLayer.scalarField(ev, {
        color: chroma.scale(['#ffeda0', '#fee193', '#fed587', '#fec97a', '#febd6e', '#fdb161',
            '#fd8d3c', '#f03b20', '#ce1324', '#bd0026'])
            .domain([0, 0.002, 0.003, 0.004, 0.006, 0.008,
                0.03, 0.07, 0.1, 0.13]),
        opacity: 0.7,
        interpolate: true
    });

    // 为windenergy图层添加点击事件
    windenergy.on('click', function (event) {
        const value = event.value;
        if (value !== null) {
            const windEnergy = value.toFixed(3);
            const html = `<span class="popupText">风能 ${8 * windEnergy} kW</span>`;
            const popup = L.popup()
                .setLatLng(event.latlng)
                .setContent(html)
                .openOn(map);
            // 将点击的坐标值设置到输入框中
            xCoordinateInput.value = Math.round(event.latlng.lat);
            yCoordinateInput.value = Math.round(event.latlng.lng);
        }
    });
    // 添加图层控制器
    layerControl = L.control.layers({}, {
        "Vector animation": vectorLayer,
        "Derived magnitude": magnitude,
        "Derived direction": direction,
        "wind energy": windenergy,
    }, {
        position: 'bottomright',
        collapsed: false,
    }).addTo(map);


    // 样式调整控制
    let width = document.getElementById('width');
    width.addEventListener('input', function () {
        if (vectorLayer) {
            vectorLayer.options.width = width.value;
            vectorLayer.redraw(); // 如果需要的话，重新绘制图层
        }
    });

    let color = document.getElementById('color');
    color.addEventListener('input', function () {
        if (vectorLayer) {
            vectorLayer.options.color = color.value;
            vectorLayer.redraw(); // 如果需要的话，重新绘制图层
        }
    });

    let velocityScale = document.getElementById('velocityScale');
    velocityScale.addEventListener('input', function () {
        if (vectorLayer) {
            vectorLayer.options.velocityScale = 1 / velocityScale.value;
            vectorLayer.redraw(); // 如果需要的话，重新绘制图层
        }
    });

    let opacity = document.getElementById('opacity');
    opacity.addEventListener('input', function () {
        if (vectorLayer) {
            vectorLayer.setOpacity(opacity.value);
        }
    });
}


// 计算风速
function calculateWindSpeed(u, v) {
    return Math.sqrt(u * u + v * v);
}

// 计算风能
function calculateWindPower(u, v) {
    const rho = 1.225; // 空气密度 (kg/m³)
    const V = calculateWindSpeed(u, v);
    return 0.5 * rho * Math.pow(V, 3);
}

// 移除旧的图层和图层控制器
function removeOldLayers() {
    if (vectorLayer) {
        map.removeLayer(vectorLayer);
    }
    if (magnitude) {
        map.removeLayer(magnitude);
    }
    if (direction) {
        map.removeLayer(direction);
    }
    if (windenergy) {
        map.removeLayer(windenergy);
    }
    if (layerControl) {
        map.removeControl(layerControl);
    }

}

loadAndDisplayData('197901');



