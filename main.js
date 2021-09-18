//获取canvas标签
var myCanvas = document.querySelector('#myCanvas')
//获取2D上下文
var context = myCanvas.getContext('2d')


/***********************自动宽高处理*************************************************/
function resizeFun() {
    myCanvas.height = document.documentElement.clientHeight
    myCanvas.width = document.documentElement.clientWidth
}
resizeFun()
window.onresize = function () {
    resizeFun()
}
/***********************自动宽高处理*************************************************/

// 鼠标使用标志位
var useing = false;
var eraserEnabled = false

/*********************************** 绘画方法 Start**********************************/
//初始化数值
context.strokeStyle = "black"
context.fillStyle = "black"
context.lineWidth = 2
context.radius = 1

//画圈方法，使用fill实现画一个360度实心弧，即圆
function drawCircle(x, y, radius) {
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
    //封闭新路径
    context.closePath()
}
//画圈方法

//画线方法
function drawLine(x1, y1, x2, y2) {
    context.beginPath()
    //起点
    context.moveTo(x1, y1)
    //线终点
    context.lineTo(x2, y2)
    context.stroke()
    context.closePath()
}
//画线方法

//标志位置为fale则不能画圆
//指定起始位置
var lastPoint = { x: undefined, y: undefined }

//鼠标按下时，画初始位置的圆
myCanvas.onmousedown = function (e) {
    useing = true
    var x = e.offsetX
    var y = e.offsetY
    // console.log(x)
    // console.log(y)
    lastPoint = { x: x, y: y }
    if (!eraserEnabled) {
        drawCircle(x, y, 1)
    }
    else {
        context.clearRect(x - 5, y - 5, 10, 10)
    }
}

//鼠标移动时，一边画圆，一边画线把圆形连接起来
//如果只画线，则只能画出一根根直挺挺的直线
myCanvas.onmousemove = function (e) {
    if (useing) {
        var x = e.offsetX
        var y = e.offsetY
        var newPoint = { x: x, y: y }
        if (!eraserEnabled) {
            drawCircle(x, y, 1)
            drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
            //更新参考point，使得每次画线的起点变为上一次画线的终点
            //避免出现画出满屏黑线链接起始点的不规则图形
            lastPoint = newPoint
        }
        else {
            context.clearRect(x - 5, y - 5, 10, 10)
        }
    }
}

//鼠标抬起停止画圆画线
myCanvas.onmouseup = function (e) {
    useing = false
}
/**************************** 绘画方法 End*******************************************/



/**************************** 画笔颜色 Start*****************************************/

let penClo = document.querySelector('#color')

penClo.addEventListener('click', function (e) {
    context.strokeStyle = e.target.id
    context.fillStyle = e.target.id
    // 更改样式功能
    actived(e.target.id, e.target.parentNode.id)

})
/**************************** 画笔颜色 End*****************************************/



/**************************** 画笔粗细 Start*****************************************/

let thickness = document.querySelector('#thickness')
thickness.addEventListener('click', function (e) {
    console.log(e.target.id)
    switch (e.target.id) {
        case 'thick':
            context.lineWidth = 10
            context.radius = 5
            break
        case 'middle':
            context.lineWidth = 6
            context.radius = 3
            break
        case 'thin':
            context.lineWidth = 2
            context.radius = 1
            break
    }
    console.log(context.lineWidth)


    actived(e.target.id, e.target.parentNode.id)
})

/**************************** 画笔粗细 End*********************************************/

/****************************添加/移除 激活样式 Start**********************************/
function actived(id, fatherId) {
    var parentNode = document.getElementById(fatherId)
    var node = document.getElementById(id)
    for (let i = 0; i < parentNode.children.length; i++) {
        parentNode.children[i].className = ''
        node.classList.add("active")
    }
}
/****************************添加/移除 激活样式 End***********************************/


/**************************** 功能区 Start*********************************************/

// color.addEventListener('click', changeColor)
// thickness.addEventListener('click', changeThickness)
actions.addEventListener('click', (e) => {
    if (e.target.tagName === 'svg') {
        takeAction(e.target.id)
    }
    else if (e.target.tagName === 'use') {
        takeAction(e.target.parentElement.id)
    }
    else if (e.target.tagName === 'LI') {
        takeAction(e.target.children[0].id)
    }
})

function takeAction(element) {
    if (element === 'pen') {
        eraserEnabled = false
        pen.classList.add("active")
        eraser.classList.remove("active")
        color.className = "active"
        thickness.className = "active"
    }
    else if (element === 'eraser') {
        eraserEnabled = true
        pen.classList.remove("active")
        eraser.classList.add("active")
        color.className = "remove"
        thickness.className = "remove"
    }
    else if (element === 'clearall') {
        context.clearRect(0, 0, myCanvas.width, myCanvas.height)    //清屏
        eraserEnabled = false
        pen.classList.add("active")
        eraser.classList.remove("active")
        color.className = "active"
        thickness.className = "active"
    }
    else if (element === 'save') {
        let a = document.createElement("a")
        a.href = myCanvas.toDataURL()           //获得图片地址
        a.target = "_blank"
        a.download = "image.png"
        a.click()
    }
}
/**************************** 功能区 End*********************************************/
