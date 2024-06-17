let colorBar = document.querySelector(".colorBar");
let colorScale = document.querySelector(".bar");
let colorBtns = document.querySelectorAll(".colorBtn");
let colorBoxBar = document.querySelector(".boxBar");
let bigTriangle = document.querySelector(".bigTriangle");
let colorBarBoxTop = document.querySelector(".colorBarBox").offsetTop;
let colorList = ["#1d257d","#2e49a5","#387cba","#4ca7c5","#74c4bf"];
let triangles = document.querySelectorAll(".triangle");
let colorDict = {0:"#1d257d",0.25:"#2e49a5",0.5:"#387cba",0.75:"#4ca7c5",1:"#74c4bf"};

let ind = 1.5;


for(let i = 0;i < triangles.length;i++){
    triangles[i].style.backgroundImage = `linear-gradient(45deg,transparent 0% 50%,${colorList[i]} 50% 100%)`
    triangles[i].style.top = i*50-6+"px";
}
function makeAriangles(){
    let triangles = document.querySelectorAll(".triangle");
    for(let i = 0;i < triangles.length;i++){
        triangles[i].addEventListener("click",(e)=>{
            let j = i;
            return function(){
                let tri = triangles[j];
                let ind = Number(tri.getAttribute("data-ind"));
                document.querySelector(".colorBarBox").removeChild(tri);
                delete colorDict[ind];
                makectxBoxBar();
                makeAriangles();
            }(j,e);
        })
    }
}
makeAriangles();
for(let i = 0,j = 0;i < 6;i++,j += 20){
    let theSacle = document.querySelector(".theSacle");
    let scaleText = document.createElement("div");
    scaleText.className = "scaleText";
    scaleText.style.top = 130 - i*26-4.5+"px";
    let sBar = document.createElement("div");
    sBar.className = "sBar";
    let sText = document.createElement("div");
    sText.className = "sText";
    sText.innerText = ind + i*5;
    scaleText.appendChild(sBar);
    scaleText.appendChild(sText);
    theSacle.appendChild(scaleText);

    let theBoxSacle = document.querySelector(".theBoxSacle");
    let BoxSacle = document.createElement("div");
    BoxSacle.className = "BoxSacle";
    BoxSacle.style.top = 100 - j -8+ '%';
    let bSacle = document.createElement("div");
    bSacle.className = "bSacle";
    let tScale = document.createElement("div");
    tScale.className = "tScale";
    tScale.innerText = ind + i*5;
    BoxSacle.appendChild(bSacle);
    BoxSacle.appendChild(tScale);
    theBoxSacle.appendChild(BoxSacle);
}




function makectxBoxBar(){
    let ctxBar=colorScale.getContext("2d");
    let theGradient=ctxBar.createLinearGradient(0,0,0,170);
    let ctxBoxBar=colorBoxBar.getContext("2d");
    let theBoxGradient=ctxBoxBar.createLinearGradient(0,0,0,170);
    let Keys = Object.keys(colorDict);
    for(let i = 0;i < Keys.length;i++){
        theGradient.addColorStop(Keys[i],colorDict[Keys[i]]);
        theBoxGradient.addColorStop(Keys[i],colorDict[Keys[i]]);
    }
    ctxBar.fillStyle=theGradient;
    ctxBar.fillRect(0,0,300,150);
    ctxBoxBar.fillStyle=theBoxGradient;
    ctxBoxBar.fillRect(0,0,300,150);
}

makectxBoxBar();



function toMakeTri(o,flag){
    let chooseColor;
    if(flag == 0){
        chooseColor = $(o).val();
    }else{
        chooseColor = o;
    }
    let tipTop = parseFloat(document.querySelector(".bigTriangle").style.top) + 9;
    if(isNaN(tipTop))tipTop = 202;
    let theTop = Number((tipTop/202).toFixed(2)) - 0.1;
    if(theTop*100%10%2 != 0){theTop += 0.01;theTop = Number((theTop).toFixed(2))};
    let t = document.querySelector(`.triangle${Math.floor(theTop*100).toString()}`);
    let triangles = document.querySelectorAll(".triangle");
    if(!t){
        if(triangles.length >= 6)return;
        t = document.createElement("div");
        t.className = `triangle triangle${theTop*100}`;
        t.setAttribute("data-ind",theTop);
        document.querySelector(".colorBarBox").appendChild(t);
    }
    t.setAttribute("data-ind",theTop);
    t.style.top = tipTop - 8 + "px";
    t.style.backgroundImage = `linear-gradient(45deg,transparent 0% 50%,${chooseColor} 50% 100%)`
    if(theTop < 0)theTop = 0;
    colorDict[theTop]=chooseColor;
    makectxBoxBar();
    makeAriangles();
}

function changeColor(o){
    $("#color_value").val($(o).val());
    $(".colorShow").css({"background-color":$(o).val()})
    toMakeTri(o,0);
}

$(document).ready(function() {
    $('.demo').each( function() {
        $(this).minicolors({
            control: $(this).attr('data-control') || 'hue',
            defaultValue: $(this).attr('data-defaultValue') || '',
            format: $(this).attr('data-format') || 'hex',
            keywords: $(this).attr('data-keywords') || '',
            inline: $(this).attr('data-inline') === 'true',
            letterCase: $(this).attr('data-letterCase') || 'lowercase',
            opacity: $(this).attr('data-opacity'),
            position: $(this).attr('data-position') || 'bottom left',
            swatches: $(this).attr('data-swatches') ? $(this).attr('data-swatches').split('|') : [],
            change: function(value, opacity) {
                if( !value ) return;
                if( opacity ) value += ', ' + opacity;
                if( typeof console === 'object' ) {
                    console.log(value);
                }
            },
            theme: 'bootstrap'
        });
    });
});

function make216(str){
    let colors = str.replace(/rgb\(/g, "").replace(/\)/g, "").split(",")
    let r = parseInt(colors[0]).toString(16).length === 1 ? "0" + parseInt(colors[0]).toString(16) : parseInt(colors[0]).toString(16)
    let g = parseInt(colors[1]).toString(16).length === 1 ? "0" + parseInt(colors[1]).toString(16) : parseInt(colors[1]).toString(16)
    let b = parseInt(colors[2]).toString(16).length === 1 ? "0" + parseInt(colors[2]).toString(16) : parseInt(colors[2]).toString(16)
    result = `#${r}${g}${b}`
    return result;
}

for(let i = 0;i < colorBtns.length;i++){
    colorBtns[i].addEventListener("click",()=>{
        let j = i;
        return function(){
            let theColor = colorBtns[j].style.backgroundColor;
            let rgb = make216(theColor);
            document.querySelector("#color_value").value = rgb;
            document.querySelector(".colorShow").style.backgroundColor = rgb;
            toMakeTri(rgb,1);
            updateHeatmapColor(rgb)
        }(j);
    })

}

function toMove(e){
    let theTop = e.clientY - document.querySelector(".colorBoxScale").offsetTop - 10  - 9;
    console.log(theTop);
    document.addEventListener("mouseup",toMoveFun);
    if(theTop < -7 || theTop > 193)return;
    bigTriangle.style.top = theTop+"px";
}
function toMoveFun(){
    bigTriangle.removeEventListener("mousemove",toMove);
    document.removeEventListener("mouseup",toMoveFun);
}
bigTriangle.addEventListener("mouseenter",(e)=>{
    bigTriangle.addEventListener("mousedown",(e) => {
        bigTriangle.addEventListener("mousemove",toMove);
    });
    bigTriangle.addEventListener("mouseover",toMoveFun);
    bigTriangle.addEventListener("mouseup",toMoveFun);
})

document.querySelector(".colorBox").addEventListener("click",()=>{
    let bigBox = document.querySelector(".bigBox");
    if(bigBox.classList.contains("noSee"))bigBox.classList.remove("noSee");
})
document.querySelector(".boxClose").addEventListener("click",()=>{
    let bigBox = document.querySelector(".bigBox");
    bigBox.classList.add("noSee");
})
function updateHeatmapColor(newColor) {
    // 从颜色选择器获取新的颜色，并更新热力图颜色
    if (window.currentLayer && window.currentLayer.heatmap) {
        // 创建新的颜色比例尺并应用到热力图
        var newColorScale = chroma.scale( [ '#ffffff01','#ffffff01','#414AA9', '#44758C', newColor,'#399B58', '#63d584', '#F2E899'], [.1, .2, .3, .4, .7, .9, 1.5, 2]);

        window.currentLayer.heatmap.options.color = newColorScale;

        // 重新渲染热力图
        map.removeLayer(window.currentLayer.heatmap);

        const s = window.currentLayer.heatmap._scalarField;
        var magnitude = L.canvasLayer.scalarField(s, {
            color: newColorScale,
            opacity: 0.7,
            interpolate: true
        }).addTo(map);

        window.currentLayer.heatmap = magnitude;
    }
}

