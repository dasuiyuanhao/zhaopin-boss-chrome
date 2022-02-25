function isEmptyObject( obj ) {
    var name;
    for ( name in obj ) {
        return false;
    }
    return true;
}

/**
 * 验证是否为数字
 * @param n
 * @returns {boolean}
 */
 function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * 用于判断空，Undefined String Array Object
 */
function isBlank(str) {
    if (Object.prototype.toString.call(str) === '[object Undefined]') {//空
        return true
    } else if (
        Object.prototype.toString.call(str) === '[object String]' ||
        Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
        return str.length == 0 ? true : false
    } else if (Object.prototype.toString.call(str) === '[object Object]') {
        return JSON.stringify(str) == '{}' ? true : false
    } else {
        return true
    }

}


/**
 * 获取Html元素在页面中的绝对位置
 * @param {Html元素} element 
 * @returns 
 */
 function calcAbsoluteLocation(element) {
    if (arguments.length != 1 || element == null) {
        return null;
    }
    var offsetTop = element.offsetTop;
    var offsetLeft = element.offsetLeft;
    var offsetWidth = element.offsetWidth;
    var offsetHeight = element.offsetHeight;
    while (element = element.offsetParent) {
        offsetTop += element.offsetTop;
        offsetLeft += element.offsetLeft;
    }
    return {
        absoluteTop: offsetTop, absoluteLeft: offsetLeft,
        offsetWidth: offsetWidth, offsetHeight: offsetHeight
    };
}

function getScrollOffsets(w) {
    var w = w || window;
    if (w.pageXoffset != null) {
        return { x: w.pageXoffset, y: pageYoffset };
    }
    var d = w.document;
    if (document.compatMode == "CSS1Compat")
        return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop };
    return { x: d.body.scrollLeft, y: d.body.scrollTop };
}

function getViewPortSize(w) {
    var w = w || window;
    if (w.innerWidth != null)
        return { w: w.innerWidth, h: w.innerHeight };
    var d = w.document;
    if (document.compatMode == "CSS1Compat")
        return { w: d.documentElement.clientWidth, h: d.documentElement.clientHeight };
    return { w: d.body.clientWidth, h: d.body.clientHeight };
}

function getElementPosition(e) {
    var x = 0, y = 0;
    while (e != null) {
        x += e.offsetLeft;
        y += e.offsetTop;
        e = e.offsetParent;
    }
    return { x: x, y: y };
}

  