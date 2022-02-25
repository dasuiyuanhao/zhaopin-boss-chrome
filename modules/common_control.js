
/**
 * 插件后台交互操作类型backgroundActionType:
 * 1为开启debugger模式，2位关闭debugger模式。
 * 101为使用Chrome DevTools Protocol调起Input.dispatchMouseEvent，模拟鼠标点击左键。
 */
const backgroundActionType_openDebugger=1;
const backgroundActionType_closeDebugger=2;
const backgroundActionType_dispatchMouseEventClick=101;

//获取消息体
function getChromeBackgroundActionMessage(backgroundActionType,data){
    var message={
        "chromePluginId":chromePluginId,
        "backgroundActionType":backgroundActionType,
        "data":data
    };
    return message;
}


/**
 * 开启debugger模式
 */
 function handOpenDebugger_backgroundAction(){
    chrome.runtime.sendMessage(
        getChromeBackgroundActionMessage(backgroundActionType_openDebugger,null),
        function(response) {return;}
    )
}

/**
 * 关闭debugger模式
 */
 function handCloseDebugger_backgroundAction(){
    chrome.runtime.sendMessage(
        getChromeBackgroundActionMessage(backgroundActionType_closeDebugger,null),
        function(response) {return;}
    )
}

/**
 * 模拟操作鼠标点击
 * @param {*} target 
 */
function handTriggerClickByTrusted(target){
    var $target=$(target);
    //乾坤大挪移-移动到窗口左上角
    $target.css({"position": "fixed","left":"0px","top":"0px","z-index":"2001"});

    /**  
     * {"x":1147,"y":-802,"width":100,"height":34,"top":-802,"right":1247,"bottom":-768,"left":1147}  
     */
    var containerLoc=$("iframe[name='recommendFrame']").get(0).getBoundingClientRect();
    var absLoc=$target.get(0).getBoundingClientRect();
    //屏幕左上部分，以及按钮本身的偏移。
    var data={
        "xC":absLoc.width/2+containerLoc.x,
        "yC":absLoc.height/2+containerLoc.y
    };
    if(defaultSetting.autoMouseEventX!=null && defaultSetting.autoMouseEventX!=""){
        data.xC=defaultSetting.autoMouseEventX;
    }
    if(defaultSetting.autoMouseEventY!=null && defaultSetting.autoMouseEventY!=""){
        data.yC=defaultSetting.autoMouseEventY;
    }

    printLogInfo("触发点击事件的参数。data="+JSON.stringify(data))

    chrome.runtime.sendMessage(
        getChromeBackgroundActionMessage(backgroundActionType_dispatchMouseEventClick,data),
        function(response) {
            if(response==null || response.chromePluginId==null || response.chromePluginId!=chromePluginId){
                console.info("background执行回调有问题")
                return;
            }
            else{
                console.info("background执行回调成功")
            }

            //乾坤大挪移-还原
            $target.css({"position": "","left":"","top":"","z-index":""});
        }
    )    

}


