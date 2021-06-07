/* eslint-disable */

import YAHOO from './utilitie'
var Canvas = window.Canvas || {}

/**
 *画布元素类
    *
    *@namespace 画布元素
    *@class Element
    *@constructor 构造函数
    */
Canvas.Element = function () {}

/**
 *表示画布的默认CSS类名的常量
    *@property Canvas.Element.CSS_CANVAS
    *@静态
    *@final
    *@type 字符串
    */
/// Canvas.Element.CSS_CANVAS = "canvas-module";
Canvas.Element.prototype.fillBackground = true
Canvas.Element.prototype.showcorners = false
Canvas.Element.prototype.photoborder = true
Canvas.Element.prototype.polaroid = false
Canvas.Element.prototype._backgroundImg = null

/**
 * 如果在空白区域单击，则包含鼠标位置的对象文本（无图像）
 * @property _groupSelector
 * @type object
 */
Canvas.Element.prototype._groupSelector = null

/**
 * 包含画布所有图像的数组元素
 * @property _aImages
 * @type object
 */
Canvas.Element.prototype._aImages = null

/**
 * 引用画布接口实现的元素
 * @property _oContext
 * @type object
 */
Canvas.Element.prototype._oContext = null

/**
 * 包含画布的主元素
 * @property _oElement
 * @type object
 */
Canvas.Element.prototype._oElement = null

/**
 * 包含配置参数的对象文本
 * @property _oConfig
 * @type object
 */
Canvas.Element.prototype._oConfig = null

/**
 * 包含配置参数的对象包含转换的当前x，y参数的对象文本
 * @property _currentTransform
 * @type object
 */
Canvas.Element.prototype._currentTransform = null

/**
 * 初始化方法
 * @method 初始化
 * @param el {HTMLElement | String}画布的容器元素。
 * @param oConfig {Object} userConfig配置对象文字
 */
Canvas.Element.prototype.init = function (el, oConfig) {
    if (el == '') {
        return
    }
    this._initElement(el)
    this._initConfig(oConfig)
    this._createContainer()
    this._initEvents()
    this._initCustomEvents()
}

/**
 * Canvas类的初始化方法。 此方法是自动的
 * 由构造函数调用，并为设置所有DOM引用预先存在的标记，如果不是，则创建所需的标记已经存在。
 * @method _initElement
 * @param el {HTMLElement | String} el表示画布的元素
 */
Canvas.Element.prototype._initElement = function (el) {
    if (YAHOO.util.Dom.inDocument(el)) {
        if (YAHOO.lang.isString(el)) {
            this._oElement = document.getElementById(el)
        } else {
            this._oElement = el
        }
    } else {
        if (YAHOO.env.ua.ie) {
            var canvasEl = excanvas(document.createElement('canvas'))
        } else {
            var canvasEl = document.createElement('canvas')
        }
        canvasEl.id = el + ''
        this._oElement = document.getElementById(el + '')
    }
    // 包含活动图像和侦听器
    this._oContextTop = this._oElement.getContext('2d')
}

/**
 * 自定义事件初始化方法。
 * @method _initCustomEvents
 */
Canvas.Element.prototype._initCustomEvents = function () {
    this.onRotateStart = new Canvas.CustomEvent('onRotateStart')
    this.onRotateMove = new Canvas.CustomEvent('onRotateMove')
    this.onRotateComplete = new Canvas.CustomEvent('onRotateComplete')
    this.onDragStart = new Canvas.CustomEvent('onDragStart')
    this.onDragMove = new Canvas.CustomEvent('onDragMove')
    this.onDragComplete = new Canvas.CustomEvent('onDragComplete')
}

/**
 * 使用不带方法的对象常量来存储配置参数
 * @method_initConfig
 * @param oConfig {Object} userConfig配置对象文字
 *包含应为此模块设置的配置。
    *有关更多详细信息，请参阅配置文档。
    */
Canvas.Element.prototype._initConfig = function (oConfig) {
    this._oConfig = oConfig

    this._oElement.style.width = this._oConfig.width + 'px'
    this._oElement.style.height = this._oConfig.height + 'px'
    /***
     * 高清显示
     * 将canvas图片原始2倍width，height制作，然后以原始图片大小CSS显示；
     * canvas的width，height与CSS的width，height不是同一概念；
     * @type {number}
     */
    this._oConfig.width = this._oConfig.width * 2
    this._oConfig.height = this._oConfig.height * 2
    this._oElement.width = this._oConfig.width
    this._oElement.height = this._oConfig.height

    this._oElement.x = this._oConfig.x
    this._oElement.y = this._oConfig.y
}

/**
 * 将主要的鼠标侦听器添加到整个画布
 * @method _initEvents
 *有关更多详细信息，请参阅配置文档。
    */
Canvas.Element.prototype._initEvents = function () {
    YAHOO.util.Event.on(this._oElement, 'mousedown', this.onMouseDown, this, true)
    YAHOO.util.Event.on(this._oElement, 'mouseup', this.onMouseUp, this, true)
    YAHOO.util.Event.on(this._oElement, 'mousemove', this.onMouseMove, this, true)
    //body鼠标点击事件
    //YAHOO.util.Event.on(document.body, 'mousedown', this.onMouseDown, this, true)
    //this._oElement.parentNode（canvas父节点）鼠标点击事件
    YAHOO.util.Event.on(this._oElement.parentNode, 'mousedown', this.onMouseDown, this, true)
}

/**
 * 创建了一个辅助画布，以包含所有未平移/旋转/缩放的图像
 * @method _createContainer
 */
Canvas.Element.prototype._createContainer = function () {
    if (YAHOO.env.ua.ie) {
        var canvasEl = excanvas(document.createElement('canvas'))
    } else {
        var canvasEl = document.createElement('canvas')
    }
    canvasEl.id = this._oElement.id + '-canvas-container'
    var oContainer = this._oElement.parentNode.insertBefore(canvasEl, this._oElement)

    // x,y坐标从画面坐标起算
    this._oElement.x = this._oElement.x - oContainer.offsetLeft
    this._oElement.y = this._oElement.y - oContainer.offsetTop

    oContainer.width = this._oConfig.width
    oContainer.height = this._oConfig.height
    oContainer.style.width = this._oConfig.width / 2 + 'px'
    oContainer.style.height = this._oConfig.height / 2 + 'px'
    // 这将包含所有不在顶部的图像
    this._oContextContainer = oContainer.getContext('2d')
}

/**
 * 定义在画布上释放鼠标时的动作的方法。
 * 该方法重置currentTransform参数，存储图像角点
 * 放置在图像对象中，并在顶部渲染画布。
 * @method onMouseUp
 * @param e {Event}在mouseup上触发事件对象
 */
Canvas.Element.prototype.onMouseUp = function (e) {
    console.log('鼠标放开=====onMouseUp')
    if (this._aImages == null) {
        return
    }
    if (this._currentTransform) {
        // 每次图像改变位置时确定新的坐标
        this._currentTransform.target.setImageCoords()
    }
    if (this._currentTransform != null && this._currentTransform.action == "rotate") {
        // 启动自定义旋转事件处理程序
        this.onRotateComplete.fire(e)
    } else if (this._currentTransform != null && this._currentTransform.action == "drag") {
        // 启动自定义拖动事件处理程序
        this.onDragComplete.fire(e)
    }
    this._currentTransform = null
    this._groupSelector = null

    // 是为了清除选择器框
    this.renderTop()
}

/**
 * 定义在画布上单击鼠标时动作的方法。
 * 该方法初始化currentTransform参数并呈现所有
 * 画布，因此当前图像可以放在顶部画布上，其余的可以放在
 * 在容器上一个。
 * @method onMouseDown
 * @param e {Event}鼠标按下时触发事件对象
 */
Canvas.Element.prototype.onMouseDown = function (e) {
    console.log('鼠标按下=====onMouseDown')
    var mp = this.findMousePosition(e)

    // 如果已经发生了其他事情，请忽略
    if (this._currentTransform != null || this._aImages == null) {
        return;
    }

    // 确定是否单击了图像
    var oImg = this.findTargetImage(mp, false)
    if (!oImg) {
        // 放置模板层下，且不透明
        this._oElement.style.opacity = 1
        this._oElement.style.filter = 'alpha(Opacity=100)'
        this._oElement.style.zIndex = 1
        this._aImages[0].setCornersVisibility(false)

        this._groupSelector = {
            ex: mp.ex,
            ey: mp.ey,
            top: 0,
            left: 0
        }
    } else {
        // 放置模板层上，且透明
        this._oElement.style.opacity = 0.50
        this._oElement.style.filter = 'alpha(Opacity=50)'
        this._oElement.style.zIndex = 3
        this._aImages[0].setCornersVisibility(true)

        //确定是拖动还是旋转情况
        //旋转和缩放同时发生
        var action = (!this.findTargetCorner(mp, oImg)) ? 'drag' : 'rotate'
        if (action == "rotate") {
            // 启动自定义旋转事件处理程序
            this.onRotateMove.fire(e)
        } else if (action == "drag") {
            // 启动自定义拖动事件处理程序
            this.onDragMove.fire(e)
        }

        this._currentTransform = {
            target: oImg,
            action: action,
            scalex: oImg.scalex,
            offsetX: mp.ex - oImg.left,
            offsetY: mp.ey - oImg.top,
            ex: mp.ex, ey: mp.ey,
            left: oImg.left, top: oImg.top,
            theta: oImg.theta
        }
    }

    // 必须全部渲染，以便将活动图像放置在canvastop中
    this.renderAll(false)
}

/**
 * 定义鼠标悬停在画布上时动作的方法。
 * currentTransform参数将定义用户是否在旋转/缩放/平移
 * 图片或两者都不显示（仅悬停）。 组选择也是可能的，并且将取消
 * 所有其他类型的动作。
 * 如果是图像转换，则仅渲染顶部画布。
 * @method onMouseMove
 * @param e {Event}在mousemove上触发事件对象
 */
Canvas.Element.prototype.onMouseMove = function (e) {
    var mp = this.findMousePosition(e)
    if (this._aImages == null) {
        return
    }
    if (this._groupSelector != null) {
        // 最初，在一个空白区域中单击，因此我们绘制了一个框以进行多项选择。
        this._groupSelector.left = mp.ex - this._groupSelector.ex
        this._groupSelector.top = mp.ey - this._groupSelector.ey
        this.renderTop()
    } else if (this._currentTransform == null) {
        // 在这里，我们将鼠标悬停在画布上，然后我们将确定
        // 我们将鼠标悬停在图片的哪一部分以更改插入符号。
        // 为了提高性能，在拖动或旋转时我们不会这样做。
        var targetImg = this.findTargetImage(mp, true)
        this.setCursor(mp, targetImg)
    } else {
        if (this._currentTransform.action == 'rotate') {
            //this.rotateImage(mp) //旋转
            this.scaleImage(mp) //拉伸
            this.onRotateMove.fire(e)
        } else {
            this.translateImage(mp) //移动
            this.onDragMove.fire(e)
        }
        // 移动照片时
        this.renderTop()
    }
}

/**
 * 移动图像
 * @method translationImage
 * @param e {Event}鼠标事件
 */
Canvas.Element.prototype.translateImage = function (mp) {
    // 移动距离
    var left = mp.ex - this._currentTransform.offsetX - this._currentTransform.target.left
    var top = mp.ey - this._currentTransform.offsetY - this._currentTransform.target.top

    // 移动图片
    this._currentTransform.target.left = mp.ex - this._currentTransform.offsetX
    this._currentTransform.target.top = mp.ey - this._currentTransform.offsetY

    // 计算图形中心点
    this._oElement.coordinatex += left
    this._oElement.coordinatey += top
}

/**
 * 放大缩放图像【拉伸】
 * @method scaleImage
 * @param e {Event}鼠标事件
 */
Canvas.Element.prototype.scaleImage = function (mp) {
    var lastLen =
        Math.sqrt(Math.pow(this._currentTransform.ey - this._currentTransform.top, 2) +
            Math.pow(this._currentTransform.ex - this._currentTransform.left, 2))
    var curLen =
        Math.sqrt(Math.pow(mp.ey - this._currentTransform.top, 2) +
            Math.pow(mp.ex - this._currentTransform.left, 2))

    this._currentTransform.target.scalex = this._currentTransform.scalex * (curLen / lastLen)
    this._currentTransform.target.scaley = this._currentTransform.target.scalex

    //更新最新中心坐标、左上角坐标
    this.upCoordinate()
}

/**
 * 旋转图片
 * @method rotateImage
 * @param e {Event} the mouse event
 */
Canvas.Element.prototype.rotateImage = function (mp) {
    var lastAngle = Math.atan2(
        this._currentTransform.ey - this._currentTransform.top,
        this._currentTransform.ex - this._currentTransform.left
    )

    var curAngle = Math.atan2(
        mp.ey - this._currentTransform.top,
        mp.ex - this._currentTransform.left
    )

    this._currentTransform.target.theta = (curAngle - lastAngle) + this._currentTransform.theta
}

/**
 * 根据用户悬停的位置设置光标图像的方法。
 * @method setCursor
 * @param e {Event}鼠标事件
 * @param targetImg {Object}鼠标悬停的图像（如果有）。
 */
Canvas.Element.prototype.setCursor = function (mp, targetImg) {
    if (!targetImg) {
        this._oElement.style.cursor = 'default'
    } else {
        var corner = this.findTargetCorner(mp, targetImg)
        if (!corner) {
            this._oElement.style.cursor = 'move'
        } else {
            if (corner == 'tr') {
                this._oElement.style.cursor = 'ne-resize'
            } else if (corner == 'br') {
                this._oElement.style.cursor = 'se-resize'
            } else if (corner == 'bl') {
                this._oElement.style.cursor = 'sw-resize'
            } else if (corner == 'tl') {
                this._oElement.style.cursor = 'nw-resize'
            } else {
                this._oElement.style.cursor = 'default'
            }
        }
    }
}

/**
 * 将图像添加到画布的方法。
 * 实际上，它仅将图像推送到稍后将在画布中渲染的数组中。
 * @方法addImage
 * @param oImg {Object}要附加的图像元素
 */
Canvas.Element.prototype.addImage = function (oImg) {
    if (YAHOO.lang.isNull(this._aImages)) {
        this._aImages = []
    }
    this._aImages.push(oImg)
    this.initCoordinate()
    this.renderAll(false)
}

/**
 * 初始化中心坐标、左上角坐标。
 * @method coordinate
 */
Canvas.Element.prototype.initCoordinate = function () {
    var oImg = this._aImages[this._aImages.length - 1]
    //设置左上角x坐标
    this._oElement.coordinatex = oImg.left + (oImg.width * oImg.scalex / 2)
    //设置左上角y坐标
    this._oElement.coordinatey = oImg.top + (oImg.height * oImg.scaley / 2)
}

/**
 * 渲染顶部画布和辅助容器画布的方法。
 * @method renderAll
 * @param allOnTop {Boolean}是否要强制所有图像呈现在顶部画布上
 */
Canvas.Element.prototype.renderAll = function (allOnTop) {
    // 当allOnTop等于true时，所有图像将在顶部画布中呈现。
    // 这用于诸如toDataUrl之类的需要在唯一画布上执行某些操作的操作。
    var containerCanvas = (allOnTop) ? this._oContextTop : this._oContextContainer
    this._oContextTop.clearRect(0, 0, parseInt(this._oConfig.width), parseInt(this._oConfig.height))
    containerCanvas.clearRect(0, 0, parseInt(this._oConfig.width), parseInt(this._oConfig.height))
    if (allOnTop) {
        var originalImgSize = this._backgroundImg.getOriginalSize()
        this._oContextTop.drawImage(this._backgroundImg._oElement, 0, 0, originalImgSize.width, originalImgSize.height)
    }
    // 渲染其余图像
    for (var i = 0, l = this._aImages.length - 1; i < l; i += 1) {
        this.drawImageElement(containerCanvas, this._aImages[i])
    }
    // 渲染顶部上下文
    this.drawImageElement(this._oContextTop, this._aImages[this._aImages.length - 1])
}

/**
 * 仅渲染顶部画布的方法。
 * 也用于渲染组选择框。
 * @method renderTop
 */
Canvas.Element.prototype.renderTop = function () {
    this._oContextTop.clearRect(0, 0, parseInt(this._oConfig.width), parseInt(this._oConfig.height))

    // 渲染顶部上下文
    this.drawImageElement(this._oContextTop, this._aImages[this._aImages.length - 1])

    if (this._groupSelector != null) {
        this._oContextTop.fillStyle = "rgba(0, 0, 200, 0.5)"
        this._oContextTop.fillRect(
            this._groupSelector.ex - ((this._groupSelector.left > 0) ?
            0 : -this._groupSelector.left),
            this._groupSelector.ey - ((this._groupSelector.top > 0) ?
            0 : -this._groupSelector.top),
            Math.abs(this._groupSelector.left),
            Math.abs(this._groupSelector.top)
        )
        this._oContextTop.strokeRect(
            this._groupSelector.ex - ((this._groupSelector.left > 0) ?
            0 : Math.abs(this._groupSelector.left)),
            this._groupSelector.ey - ((this._groupSelector.top > 0) ?
            0 : Math.abs(this._groupSelector.top)),
            Math.abs(this._groupSelector.left),
            Math.abs(this._groupSelector.top)
        )
    }
}

/**
 * 最后使用canvas函数渲染图像的方法
 * @method drawImageElement
 * @param context{Object}必须呈现图像的画布上下文
 * @param oImg{Object}图像对象
 */
Canvas.Element.prototype.drawImageElement = function (context, oImg) {
    var offsetY = 0 //oImg.height / 2
    var offsetX = 0 //oImg.width / 2
    context.save()
    context.translate(oImg.left * 2, oImg.top * 2)
    context.rotate(oImg.theta)
    context.scale(oImg.scalex, oImg.scaley)

    // 不需要边框 2020-05-22
    //this.drawBorder(context, oImg, offsetX, offsetY)
    var originalImgSize = oImg.getOriginalSize()
    // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    context.drawImage(
        oImg._oElement,
        0,
        0,
        originalImgSize.width * 2,
        originalImgSize.height * 2
    )

    if (oImg.cornervisibility) {
        this.drawCorners(context, oImg, offsetX, offsetY)
    }
    context.restore()
}

/**
 * 在给定角点坐标的情况下返回带有图像线的对象的方法
 * @method _getImageLines
 * @param oCoords {Object}图像角的坐标
 */
Canvas.Element.prototype._getImageLines = function (oCoords) {
    return {
        topline: {
            o: oCoords.tl,
            d: oCoords.tr
        },
        rightline: {
            o: oCoords.tr,
            d: oCoords.br
        },
        bottomline: {
            o: oCoords.br,
            d: oCoords.bl
        },
        leftline: {
            o: oCoords.bl,
            d: oCoords.tl
        }
    }
}

/**
 * 确定我们单击的图片的方法
 * 应用了“点内多边形”算法的一种实现
 * @method findTargetImage
 * @param e {Event}鼠标事件
 * @param悬停{Boolean}是否按下鼠标按钮
 */
Canvas.Element.prototype.findTargetImage = function (mp, hovering) {
    for (var i = this._aImages.length - 1; i >= 0; i -= 1) {
        // 遍历每个图像。 如果找到目标，则返回目标
        var iLines = this._getImageLines(this._aImages[i].oCoords)
        var xpoints = this._findCrossPoints(mp, iLines)

        if (xpoints % 2 == 1 && xpoints != 0) {
            var target = this._aImages[i]
            //重新排序数组
            if (!hovering) {
                this._aImages.splice(i, 1)
                this._aImages.push(target)
            }
            return target
        }
    }
    return false
}

/**
 * 辅助方法来确定4个图像边缘之间有多少个交叉点
 * 和水平线由在画布上单击时鼠标的位置确定
 * @method _findCrossPoints
 * @param ex {Number} x鼠标的坐标
 * @param ey {Number}鼠标的y坐标
 * @param oCoords {Object}待评估图像的坐标
 */
Canvas.Element.prototype._findCrossPoints = function (mp, oCoords) {
    var b1, b2, a1, a2, xi, yi
    var xcount = 0
    var iLine = null
    for (let lineKey in oCoords) {
        iLine = oCoords[lineKey]
        // 优化1：点下面的线。 没有交叉
        if ((iLine.o.y < mp.ey) && (iLine.d.y < mp.ey)) {
            continue
        }
        // 优化2：点上方的线。 没有交叉
        if ((iLine.o.y >= mp.ey) && (iLine.d.y >= mp.ey)) {
            continue
        }
        // 优化3：垂直线情况
        if ((iLine.o.x == iLine.d.x) && (iLine.o.x >= mp.ex)) {
            xi = iLine.o.x
            yi = mp.ey
        }
        // 计算交点
        else {
            b1 = 0 //(y2-mp.ey)/(x2-mp.ex)
            b2 = (iLine.d.y - iLine.o.y) / (iLine.d.x - iLine.o.x)
            a1 = mp.ey - b1 * mp.ex
            a2 = iLine.o.y - b2 * iLine.o.x
            xi = -(a1 - a2) / (b1 - b2)
            yi = a1 + b1 * xi
        }

        // 不计算xi <mp.ex个案例
        if (xi >= mp.ex) {
            xcount += 1
        }
        // 优化4：特定于正方形图像
        if (xcount == 2) {
            break
        }
    }

    return xcount
}

/**
 * 确定已单击四个角之一
 * @method findTargetCorner
 * @param e {Event}鼠标事件
 * @param oImg {Object}图像对象
 */
Canvas.Element.prototype.findTargetCorner = function (mp, oImg) {
    var xpoints = null
    var corners = ['tl', 'tr', 'br', 'bl']
    for (var i in oImg.oCoords) {
        xpoints = this._findCrossPoints(mp, this._getImageLines(oImg.oCoords[i].corner))
        if (xpoints % 2 == 1 && xpoints != 0) {
            return i
        }
    }
    return false
}

/**
 * 确定鼠标的坐标位置
 * @method findMousePosition
 * @param e {Event} the mouse event
 */
Canvas.Element.prototype.findMousePosition = function (e) {
    // srcElement = IE
    var parentNode = (e.srcElement) ? e.srcElement.parentNode : e.target.parentNode
    var isSafari2 = (YAHOO.env.ua.webkit != 0 && YAHOO.env.ua.webkit < 420)
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    var safariOffsetLeft = (isSafari2) ? e.target.ownerDocument.body.offsetLeft + scrollLeft : 0
    var safariOffsetTop = (isSafari2) ? e.target.ownerDocument.body.offsetTop + scrollTop : 0
    return {
        ex: e.clientX + scrollLeft - parentNode.offsetLeft - safariOffsetLeft,
        ey: e.clientY + scrollTop - parentNode.offsetTop - safariOffsetTop,
        //ex: e.clientX + scrollLeft - safariOffsetLeft,
        //ey: e.clientY + scrollTop - safariOffsetTop,
        screenX: e.screenX,
        screenY: e.screenY
    }

}

/**
 * 绘制图像边框（如果有）。 包括法线边框和宝丽来边框
 * @method drawBorder
 * @param context {Object}上下文（图层）将在其中绘制边框
 * @param oImg {Object}图像对象
 * @param offsetX {Number}从画布轴的（0,0）开始应用的水平偏移
 * @param offsetY {Number}从画布轴的（0,0）开始应用的垂直偏移
 */
Canvas.Element.prototype.drawBorder = function (context, oImg, offsetX, offsetY) {
    var outlinewidth = 2
    context.fillStyle = 'rgba(0, 0, 0, .3)'
    context.fillRect(-2 - offsetX, -2 - offsetY, oImg.width + (2 * outlinewidth), oImg.height + (2 * outlinewidth))
    context.fillStyle = '#fff'
    context.fillRect(-offsetX, -offsetY, oImg.width, oImg.height)
}

/**
 * 绘制图像角点，以帮助视觉了解UI（如果需要）
 * @method drawCorners
 * @param context {Object}上下文（图层），将在其中绘制拐角
 * @param oImg {Object}图像对象
 * @param offsetX {Number}从画布轴的（0,0）开始应用的水平偏移
 * @param offsetY {Number}从画布轴的（0,0）开始应用的垂直偏移
 */
Canvas.Element.prototype.drawCorners = function (context, oImg, offsetX, offsetY) {
    context.fillStyle = "rgba(0, 250, 0, 0.5)"
    oImg.cornersize = 30 / oImg.scalex //保持四个角点大小不变
    context.fillRect(-offsetX, -offsetY, oImg.cornersize, oImg.cornersize)
    context.fillRect(-offsetX, -offsetY, oImg.cornersize, oImg.cornersize)
    context.fillRect(oImg.width * 2 - offsetX - oImg.cornersize, -offsetY, oImg.cornersize, oImg.cornersize)
    context.fillRect(-offsetX, oImg.height * 2 - offsetY - oImg.cornersize, oImg.cornersize, oImg.cornersize)
    context.fillRect(oImg.width * 2 - offsetX - oImg.cornersize, oImg.height * 2 - offsetY - oImg.cornersize, oImg.cornersize, oImg.cornersize)
}

/**
 * 将特定的画布元素导出到图像。 在浏览器上创建和呈现。
 * 注意跨浏览器支持。
 * @method canvasTo
 * @param format {String}输出图像的格式。 jpeg或png。
 */
Canvas.Element.prototype.canvasTo = function (info, drawingType, format, allIn = true) {
    // 创建一个canvas容器
    var el = 'saveCanvas'
    if (YAHOO.util.Dom.inDocument(el)) { // 如果此容器已经存在
        if (YAHOO.lang.isString(el)) {
            var canvasEl = document.getElementById(el)
        } else {
            var canvasEl = el
        }
    } else { //如果不存在则新建
        if (YAHOO.env.ua.ie) {
            var canvasEl = excanvas(document.createElement("canvas"))
        } else {
            var canvasEl = document.createElement("canvas")
        }
    }
    canvasEl.id = el
    var saveCanvas = this._oElement.parentNode.insertBefore(canvasEl, null)

    // 创建一个2维画布
    var saveContext = saveCanvas.getContext('2d')

    var template = document.getElementById('template') // 模板图片
    var scaleRatex = template.naturalWidth / template.clientWidth
    var scaleRatey = template.naturalHeight / template.clientHeight

    // 获取制作图完成的动作
    var oImg = this._aImages[0]
    var theta = oImg.theta //制作图旋转率theta
    var top = (oImg.top - this._oElement.y) * scaleRatey //制作图顶部高度 - 开模图坐标x * 制作比率放大
    var left = (oImg.left - this._oElement.x) * scaleRatex //制作图左边宽度 - 开模图坐标y * 制作比率放大
    var scalex = oImg.scalex * scaleRatex //制作图放大率scalex
    var scaley = oImg.scaley * scaleRatey //制作图放大率scaley

    //添加文字说明
    let infoHeight = 0
    if (drawingType == 1) {
        infoHeight = 60
    }

    // 设置画布Css属性
    saveCanvas.width = template.naturalWidth
    saveCanvas.height = template.naturalHeight + infoHeight //+infoHeight文字说明区域
    saveCanvas.style.width = saveCanvas.width + 'px'
    saveCanvas.style.height = saveCanvas.height + 'px'
    saveCanvas.style.top = '-999999px'
    saveCanvas.style.left = '-999999px'
    saveCanvas.style.opacity = 1
    saveCanvas.style.filter = 'alpha(Opacity=100)'

    if (drawingType == 2) {
        var oTemplate = document.getElementById('oTemplate') // 模板图片
        // 目标图像在源图像上
        saveContext.drawImage(
            oTemplate,
            0,
            0,
            template.naturalWidth,
            template.naturalHeight
        )
        // 源图像在目标图像上
        saveContext.globalCompositeOperation = 'source-out'
    }

    // 保留模板操作动作
    saveContext.save()
    saveContext.translate(left, top)
    saveContext.rotate(theta)
    saveContext.scale(scalex, scaley)

    // 绘图 drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    //oImg._oElement.setAttribute('crossOrigin', 'anonymous')
    saveContext.drawImage(
        oImg._oElement,
        0,
        0,
        oImg.width,
        oImg.height
    )

    if (drawingType == 1) {
        // 将canvas的透明背景设置成白色
        var imageData = saveContext.getImageData(0, 0, saveCanvas.width, saveCanvas.height - infoHeight)
        var cover = 0
        for (var i = 0; i < imageData.data.length; i += 4) {
            // 当该像素是透明的，则设置成白色
            if (imageData.data[i + 3] == 0) {
                cover = cover + 1
                imageData.data[i] = 255
                imageData.data[i + 1] = 255
                imageData.data[i + 2] = 255
                imageData.data[i + 3] = 255
            }
        }
        saveContext.putImageData(imageData, 0, 0)
        saveContext.restore()

        //制图是否全覆盖
        if (allIn) {
            var coverScale = parseInt((imageData.data.length - cover) / imageData.data.length * 1000)
            if (coverScale < 999) {
                console.log('为了保证打印效果，请将您制作的图片完全覆盖整个黑色四角框')
                return false
            }
        }

        //添加文字说明
        saveContext.fillStyle = "#333333"
        saveContext.fillRect(0, template.naturalHeight, template.naturalWidth, saveCanvas.height)
        saveContext.font = '35px Verdana'
        saveContext.textAlign = 'center'
        saveContext.textBaseline = 'top'
        saveContext.fillStyle = "#FFFFFF"
        saveContext.fillText(info, template.naturalWidth / 2, template.naturalHeight + 15)
    }

    // 输出最终完成的图片base64
    var imgBase64 = ""
    if (format == 'jpeg' || format == 'png') {
        imgBase64 = saveCanvas.toDataURL('image/' + format, 1.0)
    }
    console.log('imgBase64=====', imgBase64)
    $('#showimg').attr("src", imgBase64)
    var long18 = Math.pow(10, 18)
    var int2 = Math.pow(10, 2)
    return {
        'src': oImg._oElement.currentSrc,
        'top': oImg.top * int2,
        'left': oImg.left * int2,
        'scalex': oImg.scalex * long18,
        'scaley': oImg.scaley * long18,
        'theta': oImg.theta * long18,
        'imgBase64': imgBase64
    }
}

/**
 * logo标志设计
 *
 * 将特定的画布元素导出到图像。 在浏览器上创建和呈现。
 * 支持跨浏览器，输出图像的png格式。
 * @method canvasToLogo
 */
Canvas.Element.prototype.canvasToLogo = function () {
    // 创建一个canvas容器
    var el = 'saveCanvas'
    if (YAHOO.util.Dom.inDocument(el)) { // 如果此容器已经存在
        if (YAHOO.lang.isString(el)) {
            var canvasEl = document.getElementById(el)
        } else {
            var canvasEl = el
        }
    } else { //如果不存在则新建
        if (YAHOO.env.ua.ie) {
            var canvasEl = excanvas(document.createElement("canvas"))
        } else {
            var canvasEl = document.createElement("canvas")
        }
    }
    canvasEl.id = el
    var saveCanvas = this._oElement.parentNode.insertBefore(canvasEl, null)

    // 创建一个2维画布
    var saveContext = saveCanvas.getContext('2d')

    var template = document.getElementById('template'); // 模板图片
    var scaleRatex = template.naturalWidth / template.clientWidth
    var scaleRatey = template.naturalHeight / template.clientHeight

    // 获取制作图完成的动作
    var oImg = this._aImages[0]
    var theta = oImg.theta //制作图旋转率theta
    var top = (oImg.top - this._oElement.y) * scaleRatey //制作图顶部高度 - 开模图坐标x * 制作比率放大
    var left = (oImg.left - this._oElement.x) * scaleRatex //制作图左边宽度 - 开模图坐标y * 制作比率放大
    var scalex = oImg.scalex * scaleRatex //制作图放大率scalex
    var scaley = oImg.scaley * scaleRatey //制作图放大率scaley

    // 设置画布Css属性
    saveCanvas.width = template.naturalWidth
    saveCanvas.height = template.naturalHeight
    saveCanvas.style.width = saveCanvas.width + 'px'
    saveCanvas.style.height = saveCanvas.height + 'px'
    saveCanvas.style.top = '-999999px'
    saveCanvas.style.left = '-999999px'
    saveCanvas.style.opacity = 1
    saveCanvas.style.filter = 'alpha(Opacity=100)'

    // 保留模板操作动作
    saveContext.save()
    saveContext.translate(left, top)
    saveContext.rotate(theta)
    saveContext.scale(scalex, scaley)

    // 绘图 drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    //oImg._oElement.setAttribute('crossOrigin', 'anonymous')
    saveContext.drawImage(
        oImg._oElement,
        0,
        0,
        oImg.width,
        oImg.height
    )

    // 输出最终完成的图片base64
    var imgBase64 = saveCanvas.toDataURL('image/png', 1.0)

    var long18 = Math.pow(10, 18)
    var int2 = Math.pow(10, 2)

    return {
        'src': oImg._oElement.currentSrc,
        'top': oImg.top * int2,
        'left': oImg.left * int2,
        'scalex': oImg.scalex * long18,
        'scaley': oImg.scaley * long18,
        'theta': oImg.theta * long18,
        'imgBase64': imgBase64
    }
}

/**
 * 将特定的画布元素导出到图像。 在浏览器上创建和呈现。
 * 注意跨浏览器支持。
 * @method canvasMove
 * @param coordinate, sign。
 */
Canvas.Element.prototype.canvasMove = function (coordinate, sign) {
    coordinate = coordinate.toLowerCase()
    var oImg = this._aImages[this._aImages.length - 1]
    if (coordinate == "x" || coordinate == "y") {
        if (coordinate == "x") {
            var move = 2
            if (sign == "-") {
                oImg.left = oImg.left - move
                this._oElement.coordinatex -= move
            } else {
                oImg.left = oImg.left + move
                this._oElement.coordinatex += move
            }
        } else if (coordinate == "y") {
            var move = 2
            if (sign == "-") {
                oImg.top = oImg.top - move
                this._oElement.coordinatey -= move
            } else {
                oImg.top = oImg.top + move
                this._oElement.coordinatey += move
            }
        }
    } else {
        if (coordinate == "theta") { //旋转
            var theta = Math.PI / 180 //每次1度
            if (sign == "-") {
                oImg.theta = oImg.theta - theta
            } else {
                oImg.theta = oImg.theta + theta
            }
        } else if (coordinate == "scale") { //放大缩小
            var scale = 0.01
            if (sign == "-") {
                oImg.scalex = oImg.scalex - scale
                oImg.scaley = oImg.scaley - scale
            } else {
                oImg.scalex = oImg.scalex + scale
                oImg.scaley = oImg.scaley + scale
            }
        }

        //更新最新中心坐标、左上角坐标
        this.upCoordinate()
    }
    this.renderAll(false)
}


/**
 * 将特定的画布元素导出到图像。 在浏览器上创建和呈现。
 * 注意跨浏览器支持。
 * @method canvasParam
 * @param src, top, left, scalex, scaley, theta
 */
Canvas.Element.prototype.canvasParam = function (src, top, left, scalex, scaley, theta) {
    //获取图片对象
    var oImg = this._aImages[this._aImages.length - 1]
    //设置图片地址
    //oImg._oElement.attributes.getNamedItem("src").value = src
    //设置图片坐标、拉伸、旋转参数
    var long18 = Math.pow(10, 18)
    var int2 = Math.pow(10, 2)
    oImg.top = top / int2
    oImg.left = left / int2
    oImg.scalex = scalex / long18
    oImg.scaley = scaley / long18
    oImg.theta = theta / long18
    //渲染canvas
    this.renderAll(false)
}

/**
 * 更新最新中心坐标、左上角坐标。
 * @method coordinate
 */
Canvas.Element.prototype.upCoordinate = function () {
    var oImg = this._aImages[this._aImages.length - 1]

    //半径：中心点到角距离
    var r = Math.sqrt(
        Math.pow(oImg.width * oImg.scalex / 2, 2) +
        Math.pow(oImg.height * oImg.scaley / 2, 2)
    )

    //计算顶角坐标
    var thetaStart = oImg.height / (oImg.height + oImg.width) * 95 * (Math.PI / 180)
    oImg.left = this._oElement.coordinatex - Math.cos(thetaStart + oImg.theta) * r
    oImg.top = this._oElement.coordinatey - Math.sin(thetaStart + oImg.theta) * r
}

/**
 * 在Canvas Element的生命周期中抓住“有趣的时刻”
 * @method 订阅
 * @param type {String}事件的类型。
 * @param fn {函数}处理函数
 * @param scope {Object}成为处理程序执行范围的对象。
 */
Canvas.Element.prototype.subscribe = function (type, fn, scope) {
    if (typeof this[type] == "undefined") {
        throw new Error("无效的自定义事件名称: " + type)
    }
    if (typeof fn != "function") {
        throw new Error("处理函数无效.")
    }
    this[type].scope = scope || window
    this[type].handler = fn
}

/**
 * 自定义事件初始化。
 * @method CustomEvent
 */
Canvas.CustomEvent = function (type) {
    this.type = type
    this.scope = null
    this.handler = null
    var self = this
    this.fire = function (e) {
        if (this.handler != null) {
            self.handler.call(self.scope, e)
        }
    }
}


/**
 *Img（图像）元素类
*
*@namespace canvas.Img
*@class元素
*@constructor
*画布的 @param el{HTMLElement|String}容器元素。
*/
Canvas.Img = function (el, oConfig) {
    /// this.rotateImage = new YAHOO.util.CustomEvent('rotateImage', this);
    this._initElement(el);
    this._initConfig(oConfig);
    this.setImageCoords();
};


/**
 * 表示画布的默认CSS类名的常量
 * @property Canvas.Img.CSS_CANVAS
 * @static
 * @final
 * @type String
 */
Canvas.Img.CSS_CANVAS = "canvas-img";

/**
 * 表示模块配置属性的常量
 * @property DEFAULT_CONFIG
 * @private
 * @final
 * @type Object
 */
var DEFAULT_CONFIG = {
    "TOP": {
        key: "top",
        value: 10
    },

    "LEFT": {
        key: "left",
        value: 10
    },

    "ANGLE": {
        key: "angle",
        value: 0
    },

    "SCALE-X": {
        key: "scalex",
        value: 1
    },

    "SCALE-Y": {
        key: "scaley",
        value: 1
    },
    "CORNERSIZE": {
        key: "cornersize",
        value: 25
    },
    "BORDERWIDTH": {
        key: "borderwidth",
        value: 10
    },
    "POLAROIDHEIGHT": {
        key: "polaroidheight",
        value: 40
    },
    "RANDOMPOSITION": {
        key: "randomposition",
        value: true
    }
};

/**
 * 包含画布的主元素
 * @property _oElement
 * @type object
 */
Canvas.Img.prototype._oElement = null;

/**
 * 包含配置参数的对象文本
 * @property oConfig
 * @type object
 */
Canvas.Img.prototype.top = null;
Canvas.Img.prototype.left = null;
Canvas.Img.prototype.maxwidth = null;
Canvas.Img.prototype.maxheight = null;
Canvas.Img.prototype.oCoords = null;
Canvas.Img.prototype.angle = null;
Canvas.Img.prototype.theta = null;
Canvas.Img.prototype.scalex = null;
Canvas.Img.prototype.scaley = null;
Canvas.Img.prototype.cornersize = null;
Canvas.Img.prototype.polaroidheight = null;
Canvas.Img.prototype.randomposition = null;

Canvas.Img.prototype.selected = false;
Canvas.Img.prototype.bordervisibility = false;
Canvas.Img.prototype.cornervisibility = false;

/**
 * 图像类的初始化方法,这种方法是自动的
 * 由构造函数调用。
 * @method _initElement
 * @param {HTMLElement | String} el 表示图像的元素
 */
Canvas.Img.prototype._initElement = function (el) {
    if (YAHOO.util.Dom.inDocument(el)) {
        if (YAHOO.lang.isString(el)) {
            this._oElement = document.getElementById(el);
        } else {
            this._oElement = el;
        }
        YAHOO.util.Dom.addClass(this._oElement, Canvas.Img.CSS_CANVAS);
    } else {
        // add element to the document: module.js
    }
};

/**
 *现在我们使用一个没有方法的对象文本来存储配置参数
    *它检查用户是否通过oConfig传递了任何值。否则，
    *它设置默认配置中定义的值
    *@method\u初始化配置
    *@param{Object}userConfig配置对象文本
    *包含应该为此模块设置的配置。
    *有关详细信息，请参阅配置文档。
    */
Canvas.Img.prototype._initConfig = function (oConfig) {
    var sKey;
    var canvas = document.getElementById("canvas");
    oConfig.left = oConfig.left - canvas.offsetLeft;
    oConfig.top = oConfig.top - canvas.offsetTop;

    for (sKey in DEFAULT_CONFIG) {
        var defaultKey = DEFAULT_CONFIG[sKey].key;
        if (!oConfig.hasOwnProperty(defaultKey)) { // = !(defaultKey in oConfig)
            this[defaultKey] = DEFAULT_CONFIG[sKey].value;
        } else {
            this[defaultKey] = oConfig[defaultKey];
        }
    }

    if (this.bordervisibility) {
        this.currentBorder = this.borderwidth;
    } else {
        this.currentBorder = 0;
    }

    var normalizedSize = this.getNormalizedSize(this._oElement, parseInt(oConfig.maxwidth), parseInt(oConfig.maxheight));
    this._oElement.width = normalizedSize.width;
    this._oElement.height = normalizedSize.height;
    this.width = normalizedSize.width + (2 * this.currentBorder);
    this.height = normalizedSize.height + (2 * this.currentBorder);

    // 如果用户未指定，则设置初始随机位置和角度
    if (this.randomposition) {
        this._setRandomProperties(oConfig);
    }

    this.theta = this.angle * (Math.PI / 180);

};

/**
 *根据是否设置了maxwidth和maxheight调整图像大小的方法,宽度和高度在最终图像中的比例必须与在首字母。
    *@method getNormalizedSize方法
    *@param{Object}userConfig配置对象文本
    *@param{Integer}像素中图像的最大宽度
    *@param{Integer}像素中图像的最大高度
    */
Canvas.Img.prototype.getNormalizedSize = function (oImg, maxwidth, maxheight) {
    let normalizedWidth, normalizedHeight
    if (maxheight && maxwidth && (oImg.width > oImg.height && (oImg.width / oImg.height) < (maxwidth / maxheight))) {
        // 约束高度尺寸。
        normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
    } else if (maxheight && ((oImg.height == oImg.width) || (oImg.height > oImg.width) || (oImg.height > maxheight))) {
        // 约束高度尺寸。
        normalizedWidth = Math.floor((oImg.width * maxheight) / oImg.height);
        normalizedHeight = maxheight;
    } else if (maxwidth && (maxwidth < oImg.width)) {
        // 约束宽度尺寸。
        normalizedHeight = Math.floor((oImg.height * maxwidth) / oImg.width);
        normalizedWidth = maxwidth;
    } else {
        normalizedWidth = oImg.width;
        normalizedHeight = oImg.height;
    }
    return {width: normalizedWidth, height: normalizedHeight}
},

    Canvas.Img.prototype.getOriginalSize = function () {
        return {width: this._oElement.width, height: this._oElement.height}
    };

/**
 *如果用户未指定具体的角度，则设置图像的顶部和左侧的随机具体的角度
    *@method\u setRandomProperties方法
    *@param oConfig{Object}userConfig配置对象文本
    *包含应该为此模块设置的配置。
    *有关详细信息，请参阅配置文档。
    */
Canvas.Img.prototype._setRandomProperties = function (oConfig) {
    // 如果旋转角度为空则随机
    if (oConfig.angle == null) { // use YUI.lang
        this.angle = (Math.random() * 40) - 20;
    }

    // 如果y坐标为空则随机
    if (oConfig.top == null) {
        this.top = this.height / 2 + Math.random() * 500;
    }
    // 如果x坐标为空则随机
    if (oConfig.left == null) {
        this.left = this.width / 2 + Math.random() * 700;
    }
};

Canvas.Img.prototype.setBorderVisibility = function (showBorder) {
    // 重置值
    this.width = this._oElement.width;
    this.height = this._oElement.height;

    if (showBorder) {
        this.currentBorder = this.borderwidth;
        this.width += (2 * this.currentBorder);
        this.height += (2 * this.currentBorder);
    } else {
        this.currentBorder = 0;
    }

    this.setImageCoords();
};

Canvas.Img.prototype.setCornersVisibility = function (visible) {
    this.cornervisibility = visible;
};

Canvas.Img.prototype.setPolaroidVisibility = function (showPolaroidFooter) {
    // 重置值
    this.width = this._oElement.width;
    this.height = this._oElement.height;

    if (showPolaroidFooter) {
        // 添加边框和宝丽来填充
        this.currentBorder = this.borderwidth;
        this.width += (2 * this.currentBorder);
        this.height += this.currentBorder + this.polaroidheight;
    }

    this.setImageCoords();
};

/**
 * 根据当前角度设置图像的角位置坐标
 * width and height.
 * @method setImageCoords
 */
Canvas.Img.prototype.setImageCoords = function () {
    this.left = parseInt(this.left);
    this.top = parseInt(this.top);

    this.currentWidth = parseInt(this.width) * this.scalex;
    this.currentHeight = parseInt(this.height) * this.scalex;
    this._hypotenuse = Math.sqrt(Math.pow(this.currentWidth / 2, 2) + Math.pow(this.currentHeight / 2, 2));
    this._angle = Math.atan(this.currentHeight / this.currentWidth);

    // offset added for rotate and scale actions
    var offsetX = Math.cos(this._angle + this.theta) * this._hypotenuse;
    var offsetY = Math.sin(this._angle + this.theta) * this._hypotenuse;
    var theta = this.theta;
    var sinTh = Math.sin(theta);
    var cosTh = Math.cos(theta);
    var tl = {
        //x: this.left - offsetX,
        //y: this.top - offsetY
        x: this.left,
        y: this.top
    };
    var tr = {
        x: tl.x + (this.currentWidth * cosTh),
        y: tl.y + (this.currentWidth * sinTh)
    };
    var br = {
        x: tr.x - (this.currentHeight * sinTh),
        y: tr.y + (this.currentHeight * cosTh)
    };
    var bl = {
        x: tl.x - (this.currentHeight * sinTh),
        y: tl.y + (this.currentHeight * cosTh)
    };
    // clockwise
    this.oCoords = {tl: tl, tr: tr, br: br, bl: bl};

    // set coordinates of the draggable boxes in the corners used to scale/rotate the image
    this.setCornerCoords();
};

/**
 * 它设置可拖动框用于缩放/旋转它的图像。
 * @method setCornerCoords
 */
Canvas.Img.prototype.setCornerCoords = function () {
    // 计算旋转框。
    var coords = this.oCoords;
    var theta = this.theta;
    //var cosOffset = this.cornersize * this.scalex * Math.cos(theta);
    //var sinOffset = this.cornersize * this.scalex * Math.sin(theta);
    var cosOffset = this.cornersize * this.scalex * Math.cos(theta) / 1.5;
    var sinOffset = this.cornersize * this.scalex * Math.sin(theta) / 1.5;
    coords.tl.corner = {
        tl: {
            x: coords.tl.x,
            y: coords.tl.y
        },
        tr: {
            x: coords.tl.x + cosOffset,
            y: coords.tl.y + sinOffset
        },
        bl: {
            x: coords.tl.x - sinOffset,
            y: coords.tl.y + cosOffset
        }
    };
    coords.tl.corner.br = {
        x: coords.tl.corner.tr.x - sinOffset,
        y: coords.tl.corner.tr.y + cosOffset
    };

    coords.tr.corner = {
        tl: {
            x: coords.tr.x - cosOffset,
            y: coords.tr.y - sinOffset
        },
        tr: {
            x: coords.tr.x,
            y: coords.tr.y
        },
        br: {
            x: coords.tr.x - sinOffset,
            y: coords.tr.y + cosOffset
        }
    };
    coords.tr.corner.bl = {
        x: coords.tr.corner.tl.x - sinOffset,
        y: coords.tr.corner.tl.y + cosOffset
    };

    coords.bl.corner = {
        tl: {
            x: coords.bl.x + sinOffset,
            y: coords.bl.y - cosOffset
        },
        bl: {
            x: coords.bl.x,
            y: coords.bl.y
        },
        br: {
            x: coords.bl.x + cosOffset,
            y: coords.bl.y + sinOffset
        }
    };
    coords.bl.corner.tr = {
        x: coords.bl.corner.br.x + sinOffset,
        y: coords.bl.corner.br.y - cosOffset
    };

    coords.br.corner = {
        tr: {
            x: coords.br.x + sinOffset,
            y: coords.br.y - cosOffset
        },
        bl: {
            x: coords.br.x - cosOffset,
            y: coords.br.y - sinOffset
        },
        br: {
            x: coords.br.x,
            y: coords.br.y
        }
    };
    coords.br.corner.tl = {
        x: coords.br.corner.bl.x + sinOffset,
        y: coords.br.corner.bl.y - cosOffset
    };
};
    

export default Canvas