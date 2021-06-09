var Canvas = window.Canvas || {}
/**
 * 画布元素类
 */
Canvas.Element = function () {}

/**
 * 空白区域点击。包含鼠标位置的对象文本（无图像
 * @property _groupSelector
 * @type object
 */
Canvas.Element.prototype._groupSelector = null

/**
 * 包含画布所有图形的数组元素
 * @property _aImages
 * @type object
 */
Canvas.Element.prototype._aImages = null

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
Canvas.Element.prototype.init = function (el, oConfig) {}

/**
 * Canvas类的初始化方法
 * 由构造函数调用，并为设置所有DOM引用预先存在的标记，如果不是，则创建所需的标记已经存在。
 * @method _initElement
 * @param el {HTMLElement | String} el表示画布的元素
 */
Canvas.Element.prototype._initElement = function (el) {}

export default Canvas
