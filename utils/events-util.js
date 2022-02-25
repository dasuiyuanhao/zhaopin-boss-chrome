/*****本工具不能触发可信的事件 */

/**
         * 1. createEvent(eventType)
         * 参数： eventType 共5种类型
         * Events : 包含所有的事件
         *         HTMLEvetns : 'abort','blur','change','error','focus',
         *                     'load','reset','resize','scroll','select',
         *                     'submit','unload'
         *         UIEvents : 'DOMActivate','DOMFocusIn','DOMFocusOut','keydown','keypress','keyup'
         *         MouseEvents : 'click','mousedown','mousemove','mouseout','mouseover','mouseup'
         *         MutationEvents : 'DOMAttrModified','DOMNodeInserted','DOMNodeRemoved','DOMCharacterDataModified',
         *                         'DOMNodeInsertedIntoDocument','DOMNodeRemovedFromDocument','DOMSubtreeModified'
         */
        /**
         * 2. 在 createEvent 后必须初始化，为大家介绍5种对应的初始化方法
         * HTMLEvents 和 通用 Events
         *         initEvent('type',bubbles,cancelable)
         * UIEvents
         *         initUIEvent('type',bubbles,cancelable,windowObject,detail)
         * MouseEvents
         *         initMouseEvent('type',bubbles,cancelable,windowObject,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget)
         * MutationEvents
         *         initMutationEvent('type',bubbles,cancelable,relatedNode,prevValue,newValue,attrName,attrChange)
         */
        /**
         * 在初始化完成后就可以随时触发需要的事件了，为大家介绍 targetObj.dispatchEvent(event)
         * 使targetObj对象的event事件触发
         * 需要注意的是在IE5.5+版本上请用fireEvent方法，还是浏览器兼容的考虑
         */

        /**
         * 
         * @param {首先创建鼠标事件对象的方法createEvent()传入MouseEvents，返回的对象的方法initMouseEvent()，接收15个信息：

type（字符串）：事件类型如“click”；

bubble（布尔值）：是否冒泡；

cancelable（布尔值）：是否可取消；

view（AbstractView）：与事件关联的视图，一般为document.defaultView；

detail（整数）：一般为0，一般只有事件处理程序使用；

screenX（整数）：事件相对于屏幕的X坐标；

screenY（整数）；

clientX（整数）：事件相对于视口的X坐标；

clientY（整数）；

ctrlKey（布尔值）：是否按下了Ctrl键，默认为false；

11. altKey（布尔值）；
12. shiftKey（布尔值）；
13. metaKey（布尔值）；
14. button（整数）：表示按下了哪个鼠标键，默认为0；
15. relatedTarget（对象）：表示与事件相关的对象。一般只有在模拟mouseover与mouseout时使用。

最后记得把event对象传给dispatchEvent()方法。

如模拟按钮的单击事件：

//模拟click事件
//获取btn
var btn = document.querySelector("#btn");
//创建event
var event = document.createEvent("MouseEvents");
//初始化event
event.initMouseEvent("click",true,true,document.defaultView,0,0,0,0,0,false,false,false,false,0,null);
//click事件绑定事件处理程序
btn.onclick = function () {
    console.log("hello");
}
//触发事件
btn.dispatchEvent(event); //hello
//取消引用
btn.onclick = null;
另外，建议使用构造函数"MouseEvent"：

var evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window
});} target 
         */


/**鼠标模拟
 * 模拟事件：鼠标模拟
 * @param el dom节点
 * @param evtType (鼠标事件 click dbclick mousedown mouseup)
 * */
 function handTriggerMouseEvent(el, evtType) {
    let doc = el.ownerDocument,
        win = doc.defaultView || doc.parentWindow,
        evtObj;
    evtObj = new MouseEvent(evtType, {
        bubbles: true,
        cancelable: true,
        detail: 1,
        button: 0,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        view: win,
        relatedTarget: el,
    });
    evtObj.relatedTarget = el;
    el.dispatchEvent(evtObj);
}

/**
 * 触发鼠标连续事件，mousedown+mouseup+click
 * @param {dom元素} target 
 * @returns 
 */
 function handTriggerMouseEventOfMore(target) {
    if (target == null) {
        return;
    }

    var evObj5 = document.createEvent("MouseEvents");
    evObj5.initEvent("mouseover", false, false);
    target.dispatchEvent(evObj5);

    var evObj4 = document.createEvent("MouseEvents");
    evObj4.initEvent("mousemove", false, false);
    target.dispatchEvent(evObj4);

    var evObj1 = document.createEvent("MouseEvents");
    evObj1.initEvent("mousedown", false, false);
    target.dispatchEvent(evObj1);

    var evObj6 = document.createEvent("MouseEvents");
    evObj6.initEvent("focusin", false, false);
    target.dispatchEvent(evObj6);

    var evObj7 = document.createEvent("MouseEvents");
    evObj7.initEvent("focus", false, false);
    target.dispatchEvent(evObj7);

    var evObj2 = document.createEvent("MouseEvents");
    evObj2.initEvent("mouseup", false, false);
    target.dispatchEvent(evObj2);

    var evObj3 = document.createEvent("MouseEvents");
    evObj3.initEvent("click", false, false);
    target.dispatchEvent(evObj3);
}


/**
 * 触发鼠标连续事件，mousedown+mouseup+click
 * @param {dom元素} target 
 * @returns 
 */
 function handTriggerPointerEventOfMouseoverAndClick(target) {
    if (target == null) {
        return;
    }

    var evObj1 = document.createEvent('MouseEvents');
    evObj1.initMouseEvent('mouseover',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    target.dispatchEvent(evObj1);

    var evObj2 = document.createEvent('MouseEvents');
    evObj2.initMouseEvent('mouseover',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    target.dispatchEvent(evObj2);

    var evObj3 = document.createEvent('MouseEvents');
    evObj3.initMouseEvent('mouseover',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    target.dispatchEvent(evObj3);

    var evObj4 = document.createEvent('MouseEvents');
    evObj4.initMouseEvent('click',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
    target.dispatchEvent(evObj4);

    // var evObj6 = new Event("click", {"bubbles":true, "cancelable":true});
    // target.dispatchEvent(evObj6);

}


/**
 * 触发事件：keydown+keyup
 */
 function handTriggerEventOfKeydownAndKeyup(target) {
    if (target == null) {
        return;
    }

    var evObj1 = new Event("keydown", {"bubbles":true, "cancelable":true});
    target.dispatchEvent(evObj1);
    

    var evObj2 = new Event("keyup", {"bubbles":true, "cancelable":true});
    target.dispatchEvent(evObj2);

}


