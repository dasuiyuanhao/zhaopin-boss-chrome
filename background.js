const chromePluginId = "bole-zhaopin-chrome";
/**
 * 插件后台交互操作类型backgroundActionType:
 * 1为开启debugger模式，2位关闭debugger模式。
 * 101为使用Chrome DevTools Protocol调起Input.dispatchMouseEvent，模拟鼠标点击左键。
 */
 const backgroundActionType_openDebugger=1;
 const backgroundActionType_closeDebugger=2;
 const backgroundActionType_dispatchMouseEventClick=101;

var attachedTabs = {};
var version = "1.3";
var letsdo = null;
var debugIdGlobal;

let debuggerEnabled = false;

console.log('bg')


/**
 * 获取当前选项卡id
 * @param callback - 获取到id后要执行的回调函数
 * 
 * 当知道了tabId后，就使用该api进行发送消息 chrome.tabs.sendMessage(tabId, message, function(response) {...});
 */
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (callback) {
            callback(tabs.length ? tabs[0].id : null);
        }
    });
}

/**
 * 在background端监听content-script端发来的消息
 * request表示发来的消息，sendResponse是一个函数，用于对发来的消息进行回应，如 sendResponse('我已收到你的消息：'+JSON.stringify(request));
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request != null && request.chromePluginId != null && request.chromePluginId == chromePluginId) {
            console.info("content-script端发来的消息,request:" + JSON.stringify(request)
                +" sender:" + JSON.stringify(sender));
           

            /**
             * 插件后台交互操作类型backgroundActionType:
             * 1为开启debugger模式，2位关闭debugger模式。
             * 101为使用Chrome DevTools Protocol调起Input.dispatchMouseEvent，模拟鼠标点击左键。
             */
            if (request.backgroundActionType != null && request.backgroundActionType>0) {
                var debuggeeId = { tabId: sender.tab.id };

                if(request.backgroundActionType==backgroundActionType_openDebugger){
                    //开启调试
                    chrome.debugger.attach(debuggeeId, version);
                }else if(request.backgroundActionType==backgroundActionType_closeDebugger){
                    //停止调试
                    chrome.debugger.detach(debuggeeId);
                }else if(request.backgroundActionType==backgroundActionType_dispatchMouseEventClick){
                    handleDispatchMouseEventClick(request, sender, sendResponse);
                }else{
                    console.info("content-script端发来的消息,未知操作类型。request：" + JSON.stringify(request));
                }
            }else{
                console.info("content-script端发来的消息,无操作类型。request：" + JSON.stringify(request));
            }


            var response = { "chromePluginId": chromePluginId, "success": 1 }
            sendResponse(response);
        }

    }
)


function onAttach(debuggeeId) {
    if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
    }

    tabId = debuggeeId.tabId;
    chrome.browserAction.setIcon({ tabId: tabId, path: "debuggerPause.png" });
    chrome.browserAction.setTitle({ tabId: tabId, title: "pause debugger" });
    attachedTabs[tabId] = "working";
    chrome.debugger.sendCommand(
        debuggeeId, "Debugger.enable", {},
        onDebuggerEnabled.bind(null, debuggeeId));
}

/**
 * 使用Chrome DevTools Protocol调起Input.dispatchMouseEvent，模拟鼠标点击左键。
 * @param {*} request 
 * @param {*} sender 
 * @param {*} sendResponse 
 */
function handleDispatchMouseEventClick(request, sender, sendResponse){
    chrome.debugger.sendCommand({ tabId: sender.tab.id },
        // "document.querySelector('" + request.clickButtonByTrusted + "').dispatchMouseEvent",
        "Input.dispatchMouseEvent",
        { type: "mousePressed", x: request.data.xC, y: request.data.yC, button: "left", clickCount: 1 },
        function (e) { console.log('clickDown', e) });

    chrome.debugger.sendCommand({ tabId: sender.tab.id },
        // "document.querySelector('" + request.clickButtonByTrusted + "').dispatchMouseEvent",
        "Input.dispatchMouseEvent",
        // "doThingsOfTest1",
        { type: "mouseReleased", x: request.data.xC, y: request.data.yC, button: "left", clickCount: 1 },
        function (e) { console.log('clickUp', e) });

}
