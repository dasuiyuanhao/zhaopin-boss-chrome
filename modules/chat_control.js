/*!
* Author: dasuiyuanhao
* Date: 2020-3-20
*/

/**【沟通】 */
const chatControlFailedMsg = "操作失败！请在【沟通】页面操作";
//沟通项
var $chatGeekItemList = [];
//沟通列表数据
var chatDataList = [];
//满足条件的
var resultChatDataList = [];

//再次沟通过 --再次查询时候不清空
var zaiCiGouTongDataList = [];
//当前数据
var currentChatItem = null;

//自动发消息了的列表
var autoSendedMsgDataList = [];

//绑定快捷键
$(document).bind('keydown.shift_w', function () {
    try {
        queryYidu();
    } catch (error) {
        alert(filterFailedMsg);
        console.error(chatControlFailedMsg);
        console.error(error);
        return;
    }
});
$(document).bind('keydown.shift_q', function () {
    selectPrevChat();
});
$(document).bind('keydown.shift_e', function () {
    selectNextChat();
});

const el_btnChatQueryYidu = document.getElementById("btn_chat_query_yidu");
el_btnChatQueryYidu.addEventListener('click', e => {
    try {

        queryYidu();
    } catch (error) {
        alert(chatControlFailedMsg);
        console.error(chatControlFailedMsg);
        console.error(error);
        return;
    }
});

const btnChatLoadAll = document.getElementById("btn_chat_load_all");
btnChatLoadAll.addEventListener('click', e => {
    scollLoadAllChat();
});
const el_btnChatAutoSendMsgForRead = document.getElementById("btn_chat_autoSendMsgForRead");
el_btnChatAutoSendMsgForRead.addEventListener('click', e => {
    try {
        autoSendMsgForRead();
    } catch (error) {
        alert(chatControlFailedMsg);
        console.error(chatControlFailedMsg);
        console.error(error);
        return;
    }
});

const btnChatNext = document.getElementById("btn_chat_next");
btnChatNext.addEventListener('click', e => {
    selectNextChat();
});
const btnChatPrev = document.getElementById("btn_chat_prev");
btnChatPrev.addEventListener('click', e => {
    selectPrevChat();
});

//复制      
var clipboard_xuliehao = new ClipboardJS('#btn_copy_miyao', {
    target: function () {
        return document.querySelector('#label_xuliehao');
    },
});
clipboard_xuliehao.on('success', function (e) {
    console.log(e);
    printLogInfo("复制成功！");
});
clipboard_xuliehao.on('error', function (e) {
    console.log(e);
    printLogInfo("复制失败！");
});


/**
 * 加载配置 开始
 */
var defaultChatSetting = {
    version: "2.0.0",
};

var loadFromSavedChat = false;
if (window.localStorage) {
    var strOfMyChatSetting = window.localStorage.getItem(chromePluginId + '_myChatSetting');
    if (strOfMyChatSetting != null && strOfMyChatSetting != "") {
        var myChatSetting = JSON.parse(strOfMyChatSetting);

        if (myChatSetting != null) {
            defaultChatSetting = myChatSetting;
            loadFromSavedChat = true;
            printLogInfo("读取【沟通】配置成功！");
        }
    }
}

//如果读取不到本地配置，则设置默认值
if (!loadFromSavedChat) {
    initChatSetting();
}
initChatControl();

//初始化筛选条件配置
function initChatSetting() {
    //发消息内容
    defaultChatSetting.chatSendMsg = "";
    //发消息后自动滚动到下一个
    defaultChatSetting.autoScrollNext = false;
    defaultChatSetting.maxAutoSendMsgTimesOfChat = 100;
    defaultChatSetting.msgStatus = "1"
    defaultChatSetting.timeRange = "";
    defaultChatSetting.autoReceiveResume = false;
}

//初始化筛选条件面板
function initChatControl() {
    $("#input_chat_send_msg").val(defaultChatSetting.chatSendMsg);
    $("#input_maxAutoSendMsgTimesOfChat").val(defaultChatSetting.maxAutoSendMsgTimesOfChat);
    //自动接收简历
    if(defaultChatSetting.autoReceiveResume) {
        $("#input_autoReceiveResume_control").prop("checked", "checked");
    }
    else {
        $("#input_autoReceiveResume_control").prop("checked", false);
    }
    //消息状态    
    if (defaultChatSetting.msgStatus == null) {
        //默认筛选已读
        defaultChatSetting.msgStatus = "1";
    }
    $("#select_msgStatusOfAutoSendMsg").val(defaultChatSetting.msgStatus);

    //时间范围
    if (defaultChatSetting.timeRange != null) {
        $("#select_timeRangeOfAutoSendMsg").val(defaultChatSetting.timeRange);
    }
    else {
        $("#select_timeRangeOfAutoSendMsg").val("");
    }

    //打招呼后自动滚动到下一个
    if (defaultChatSetting.autoScrollNext) {
        $("#input_chat_send_next").prop("checked", "checked");
    }
    else {
        $("#input_chat_send_next").prop("checked", false);
    }

}


//保存筛选条件
const btnSaveChatSetting = document.getElementById("btn_save_chat_setting");
btnSaveChatSetting.addEventListener('click', e => {
    try {
        if (window.localStorage) {

            //
            defaultChatSetting.chatSendMsg = $.trim($("#input_chat_send_msg").val());
            defaultChatSetting.maxAutoSendMsgTimesOfChat = $.trim($("#input_maxAutoSendMsgTimesOfChat").val());
            defaultChatSetting.autoReceiveResume = false;
            if ($("#input_autoReceiveResume_control").prop("checked")) {
                defaultChatSetting.autoReceiveResume = true;
            }

            defaultChatSetting.timeRange = $("#select_timeRangeOfAutoSendMsg").val();
            defaultChatSetting.msgStatus = $("#select_msgStatusOfAutoSendMsg").val();

            //打招呼后自动滚动到下一个
            var autoScrollNext = false;
            if ($("#input_chat_send_next").prop("checked")) {
                autoScrollNext = true;
            }
            defaultChatSetting.autoScrollNext = autoScrollNext;

            var strOfMySetting = JSON.stringify(defaultChatSetting);
            if (strOfMySetting == null || strOfMySetting == "") {
                printLogInfo("配置参数不能为空");
                return;
            }

            window.localStorage.setItem(chromePluginId + '_myChatSetting', strOfMySetting);
            printLogInfo("保存【沟通】配置成功！");
        }
    } catch (error) {
        printLogInfo("保存异常！请检查配置");
        console.error(error);
        return;
    }
});

//重置筛选条件
const btnResetChatSetting = document.getElementById("btn_reset_chat_setting");
btnResetChatSetting.addEventListener('click', e => {
    try {
        if (confirm("重置筛选条件将清空自定义内容，确定重置？")) {
            initChatSetting();

            initChatControl();

            if (window.localStorage) {
                var strOfMySetting = JSON.stringify(defaultChatSetting);
                if (strOfMySetting == null || strOfMySetting == "") {
                    printLogInfo("配置参数不能为空");
                    return;
                }

                window.localStorage.setItem(chromePluginId + '_myChatSetting', strOfMySetting);
                printLogInfo("重置【沟通】配置成功！");
            }
        }        
    } catch (error) {
        printLogInfo("保存【沟通】的配置异常！请重试");
        console.error(error);
        return;
    }
});


/**
 * 加载配置 结束
 */

/***业务逻辑 */

function resetQueryResult() {
    //沟通项
    $chatGeekItemList = [];
    chatDataList = [];
    filterChatDataList = [];
    resultChatDataList = [];
    currentChatItem = null;
}

/**滚动加载全部 */
const btnChatLoadAllTextDefault = "一键加载全部";
const btnChatLoadAllTextStop = "停止加载全部";
var isExcutingScollLoadOfChat = false;
var tryScrollLoadFailedTimesOfChat = 0;
var scollLoadEndItemOfChat = null;
var scollLoadTimesOfChat = 0;
//最多加载次数
var maxLoadTimesOfChat = 200;
function scollLoadAllChat() {
    var $btn_chat_load_all = $("#btn_chat_load_all");
    if (isExcutingScollLoadOfChat) {
        //如果已经在执行，则停止
        isExcutingScollLoadOfChat = false;
        $btn_chat_load_all.text(btnChatLoadAllTextDefault);
        return;
    }
    $btn_chat_load_all.text(btnChatLoadAllTextStop);

    isExcutingScollLoadOfChat = true;
    tryScrollLoadFailedTimesOfChat = 0;
    scollLoadEndItemOfChat = null;
    scollLoadTimesOfChat = 0;

    //开始滚动加载
    var rText = "开始滚动加载沟通列表.....";
    printLogInfo(rText, true);
    scrollLoadOfChat();
}

function stopScrollLoadRecommendOfChat() {
    isExcutingScollLoadOfChat = false;
    printLogInfo("结束滚动加载沟通列表.....");
    var $btn_chat_load_all = $("#btn_chat_load_all");
    $btn_chat_load_all.text(btnChatLoadAllTextDefault);
}

function scrollLoadOfChat() {
    var result = 0;
    if (!isExcutingScollLoadOfChat || tryScrollLoadFailedTimesOfChat >= 3
        || scollLoadTimesOfChat >= maxLoadTimesOfChat) {
        stopScrollLoadRecommendOfChat();
        return result;
    }

    var logMsgPart = "滚动加载沟通列表";

    //找到最下面的元素
    try {
        let $chatContainer = $("div.chat-container").find("div.user-list");
        $chatGeekItemList = $chatContainer.find("div.geek-item-wrap");

        var rText = logMsgPart + ",全部沟通" + $chatGeekItemList.length + "个 ";
        printLogInfo(rText);

        if ($chatGeekItemList == null || $chatGeekItemList.length < 1) {
            printLogInfo(logMsgPart + ",没有抓到页面数据，请重试!");
            stopScrollLoadRecommend();
            return result;
        }

        var $thisTimeLastLi = $($chatGeekItemList[$chatGeekItemList.length - 1]);
        var $warp = $thisTimeLastLi.find("div.geek-item-warp");
        var thisTimeLast = findUidOfChat($warp);


        if (thisTimeLast == scollLoadEndItemOfChat) {

            tryScrollLoadFailedTimesOfChat++;
            setTimeout(function () {
                return scrollLoadOfChat();
            }, randomNum(500, 2000));
            return;
        }

        scollLoadEndItemOfChat = thisTimeLast;

        //滚到最后一个
        if ($chatGeekItemList != null && $chatGeekItemList.length > 0) {
            scrollToChatItem($($chatGeekItemList.get($chatGeekItemList.length - 1)));
        }

    } catch (error) {
        printLogInfo(logMsgPart + ",异常:");
        console.error(error);
        stopScrollLoadRecommendOfChat();
        return result;
    }

    result++;
    scollLoadTimesOfChat += result;
    printLogInfo(logMsgPart + ",加载第" + scollLoadTimesOfChat + "次成功");
    setTimeout(function () {
        return scrollLoadOfChat();

    }, randomNum(1000, 5000));
}

//筛选满足条件的聊天
function queryYidu() {
    resetQueryResult();

    
    //消息状态
    var filterMsgStatusVal = $("#select_msgStatusOfAutoSendMsg").val();
    var filterMsgStatus = "";
    if (filterMsgStatusVal == "") {
        filterMsgStatus = "";
    } else if (filterMsgStatusVal == "1") {
        filterMsgStatus = "[已读]";
    } else if (filterMsgStatusVal == "2") {
        filterMsgStatus = "[送达]";
    } else if (filterMsgStatusVal == "3") {
        filterMsgStatus = "[盼回复]";
    }

    //时间范围
    var timeRange = $("#select_timeRangeOfAutoSendMsg").val();
    var timeGreatThanOrEqualTo = null;
    if (timeRange == "1") {
        timeGreatThanOrEqualTo = moment(new Date()).subtract(0, 'days').format('YYYY-MM-DD');
    } else if (timeRange == "2") {
        timeGreatThanOrEqualTo = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
    } else if (timeRange == "3") {
        timeGreatThanOrEqualTo = moment(new Date()).subtract(2, 'days').format('YYYY-MM-DD');
    }
    else if (timeRange == "4") {
        timeGreatThanOrEqualTo = moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD');
    }
    else if (timeRange == "5") {
        timeGreatThanOrEqualTo = moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD');
    }
    if (timeGreatThanOrEqualTo != null) {
        timeGreatThanOrEqualTo = new Date(timeGreatThanOrEqualTo);
    }
    // var timeLessThanOrEqualTo=moment().format('YYYY-MM-DD');

    //开始遍历沟通列表
    let $chatContainer = $("div.chat-container").find("div.user-list");
    $chatGeekItemList = $chatContainer.find("div.geek-item-wrap");

    for (var i = 0; i < $chatGeekItemList.length; i++) {
        let $item = $($chatGeekItemList[i]);

        var itemData = { "domIndex": i };
        var $warp = $item.children("div.geek-item");
        itemData.currentuid = findUidOfChat($warp);


        itemData.time = $.trim($warp.find("span.time").text());
        itemData.realName = $.trim($warp.find("span.geek-name").text());
        //消息状态
        itemData.msgStatus = "";
        let $msgGraySpan = $warp.find("p.gray").children("span.status");
        if ($msgGraySpan != null && $msgGraySpan.length > 0) {
            let text_msgStatusSpan = $.trim($($msgGraySpan[0]).text());
            if (text_msgStatusSpan != null && text_msgStatusSpan != "" && text_msgStatusSpan.indexOf('[') == 0) {
                itemData.msgStatus = text_msgStatusSpan;
            }
        }

        // itemData.pushText=$warp.find("span.push-text").text();

        chatDataList.push(itemData);
    }

    let pMsg = "沟通列表共" + chatDataList.length + "个。" + JSON.stringify(chatDataList);
    console.info(pMsg);

    //过滤
    for (let i = 0; i < chatDataList.length; i++) {
        let checkResult = "";
        let item = chatDataList[i];

        //过滤阅读状态
        if (item.msgStatus == null) {
            checkResult += "消息状态不符合条件。";
        } else if (filterMsgStatus != null && filterMsgStatus != "") {
            if (item.msgStatus != filterMsgStatus) {
                checkResult += "消息状态不符合条件。";
            }
        }

        //时间区间
        if (item.time != null && item.time != "") {
            if (item.time.indexOf(':') < 0) {
                let time = null;
                if (item.time == "昨天") {
                    time = new Date(moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'));
                } else if (item.time.indexOf('日') >= 0) {
                    var strTimeR = item.time.replace('年', '-').replace('月', '-').replace('日', '');
                    if (item.time.indexOf('年') >= 0) {
                        time = new Date(strTimeR);
                    } else {
                        time = new Date("" + (new Date()).getFullYear() + "-" + strTimeR);
                    }
                }

                if (timeGreatThanOrEqualTo != null) {
                    if (time < timeGreatThanOrEqualTo) {
                        checkResult += "沟通时间不符合条件-时间区间。";
                    }
                }
            }
        }

        /**
         * 校验通过的处理
         */
        var $item = $($chatGeekItemList.get(item.domIndex));
        if (checkResult == "") {
            resultChatDataList.push(item);

            //标记li元素的背景颜色            
            if ($item != null) {
                //如果未沟通设置橙色
                refreshChatItemRemark($item, "未沟通");
            }

            //  //点击按钮，绑定事件
            //  var $btn_doc = $li.find("span.btn-doc").children("button");
            //  $btn_doc.click(btnCommunicateRefresh);
        }
        else {
            refreshChatItemRemark($item, "");
        }
    }


    pMsg = "沟通列表共" + chatDataList.length + "个，满足条件的" + resultChatDataList.length + "个"//+JSON.stringify(resultChatDataList);
    printLogInfo(pMsg);


}

function findUidOfChat($warp) {
    let currentuid = $warp.attr("data-id");
    // let el_text_class = $warp.find("div.text").attr("class").toString();
    // if (el_text_class != null) {
    //     let classNameList = el_text_class.split(" ");
    //     if (classNameList != null && classNameList.length > 0) {
    //         $.each(classNameList, function (idx, obj) {
    //             if (!isBlank(obj) && obj.indexOf("uid-") >= 0) {
    //                 currentuid = obj.substring(obj.indexOf("uid-") + 4);
    //                 return true;
    //             }
    //         });
    //     }
    // }
    return currentuid;
}


//标记背景颜色
function refreshChatItemRemark($item, goutong) {
    //如果未沟通设置橙色
    if (goutong == "未沟通") {
        $item.css("background-color", "orange");
    }
    else if (goutong == "已沟通") {
        $item.css("background-color", "lightblue");
    }
    else {
        $item.css("background-color", "white");
    }
}



//跳转到下一个，currentIndex从0开始
function selectNextChat(currentIndex) {
    showChatInfoOfOneByOne();
    if (resultChatDataList == null || resultChatDataList.length <= 0) {
        alert(chatControlFailedMsg + "。并且先点击筛选按钮后，沟通列表有满足条件的人员。");
        return;
    }

    if (currentIndex != null && currentIndex >= 0) {
        var nextIdx = currentIndex + 1;
        if (resultChatDataList.length > nextIdx) {
            currentChatItem = resultChatDataList[nextIdx];
        }
        else {
            console.info("已经到最后了。currentIndex=" + currentIndex);
            return;
        }
    }
    else {
        if (currentChatItem != null) {
            var idx = resultChatDataList.indexOf(currentChatItem);
            if (idx < 0) {
                alert("数据不存在");
                return;
            }
            if (idx + 1 >= resultChatDataList.length) {
                //已经到最后了,从第一个开始
                // alert("已经到最后了");
                currentChatItem = resultChatDataList[0];
                // scrollToTopOfChat();             
            }
            else {
                currentChatItem = resultChatDataList[idx + 1];
            }
        }
        else {
            currentChatItem = resultChatDataList[0];
            // scrollToTopOfChat();  
        }
    }

    console.info("找到了下一个:" + JSON.stringify(currentChatItem));
    //滚动到这儿
    scrollToChatItem($chatGeekItemList[currentChatItem.domIndex]);
    showChatInfoOfOneByOne(currentChatItem);
}

function selectPrevChat() {
    showChatInfoOfOneByOne();
    if (resultChatDataList == null || resultChatDataList.length <= 0) {
        alert(chatControlFailedMsg + "。并且先点击筛选按钮后，沟通列表有满足条件的人员。");
        return;
    }
    if (currentChatItem != null) {
        var idx = resultChatDataList.indexOf(currentChatItem);
        if (idx < 0) {
            alert("数据不存在");
            return;
        }
        if (idx == 0) {
            //已经到第一个了，从倒数第一开始
            // alert("已经到第一个了");
            currentChatItem = resultChatDataList[resultChatDataList.length - 1];
        }
        else {
            currentChatItem = resultChatDataList[idx - 1];
        }
    }
    else {
        // alert("没有上一个");
        //没有上一个，从倒数第一开始
        currentChatItem = resultChatDataList[resultChatDataList.length - 1];
    }

    console.info("找到了上一个:" + JSON.stringify(currentChatItem));
    //滚动到这儿
    scrollToChatItem($chatGeekItemList[currentChatItem.domIndex]);
    showChatInfoOfOneByOne(currentChatItem);
}

function showChatInfoOfOneByOne(data) {
    var msg = "";
    if (data != null) {
        msg = "第" + (resultChatDataList.indexOf(data) + 1) + "个：" + data.realName;
    }

    var $span_oneByOne = $("#chat_oneByOne_info_control");
    $span_oneByOne.text(msg);
}

//滚动到指定位置
function scrollToChatItem(element, speed) {
    try {
        if (element == null) {
            return;
        }

        if (!speed) {
            speed = 300;
        }

        if (!element) {
            $("div.geek-list-scroll-wrap").scrollTop(0);
        } else {
            var $e = $(element);
            if ($e.length > 0) {

                // var scrollTop = $e.offset().top-$("div.geek-list-scroll-wrap").offset().top;
                var scrollTop = $e.offset().top - $("div.geek-list-inner-container").offset().top;
                let $divScoll = $("div.geek-list-scroll-wrap");
                $divScoll.scrollTop(scrollTop);

                // $($chatGeekItemList[resultChatDataList[3].domIndex]).offset().top-$("div.geek-list-scroll-wrap").offset().top;

            }
        }
    } catch (error) {
        console.error(error);
        alert("滚动到指定位置,异常了");
    }
}


//滚动到顶部
function scrollToTopOfChat() {
    $("div.geek-list-scroll-wrap").scrollTop(0);
}

const miyaoOperateFailedMsg = "请在BOSS直聘【沟通】页面操作";
function handleMiyao() {
    $("#div_miyao_control").toggle();

    let $label_name = $("#header").find("div.label-name");
    if ($label_name == null || $label_name.length < 1) {
        alert(miyaoOperateFailedMsg);
        return;
    }

    let installedTag = calcXuliehao();
    if (installedTag == null || installedTag == "") {
        alert(miyaoOperateFailedMsg);
        return;
    }
    let now = "" + moment(new Date()).unix();
    installedTag += "_" + Base64.encode(now);
    $("#label_xuliehao").text(installedTag);

}

function handleSaveMiyao() {
    let valSaveMiyao = $.trim($("#input_miyao").val());
    if (valSaveMiyao == null || valSaveMiyao == "") {
        alert("请填写授权秘钥");
        return;
    }
    if (!window.localStorage) {
        alert("浏览器不兼容");
    }
    let installedTag = calcXuliehao();
    if (installedTag == null || installedTag == "") {
        alert(miyaoOperateFailedMsg);
        return;
    }

    let o = JSON.parse(Base64.decode(valSaveMiyao));
    if (o != null && o.data != null && o.data.sn != null && o.data.sn != "") {
        //校验安装标识
        let splitSN = o.data.sn.split("_");
        if (splitSN != null && splitSN.length >= 3) {
            if (installedTag == (splitSN[0] + "_" + splitSN[1])) {

            }
            else {
                alert("注册码的安装标识格式错误");
                return;
            }
        }
        else {
            alert("注册码的安装标识格式错误");
            return;
        }
    }
    else {
        alert("注册码格式错误");
        return;
    }

    //存储
    let objStorageM = null;
    let storageKey = chromePluginId + '_m';
    let valStorageM = window.localStorage.getItem(storageKey);
    if (valStorageM != null && valStorageM != "") {
        objStorageM = JSON.parse(Base64.decode(valStorageM));
    }
    if (objStorageM == null) {
        objStorageM = {
            "installedTag": installedTag,
            "miyaoList": []
        };
    }
    if (objStorageM.miyaoList == null) {
        objStorageM.miyaoList = [];
    }
    let isExist = false;
    $.each(objStorageM.miyaoList, function (index, item) {
        if (item.installedTag == installedTag) {
            item.code = valSaveMiyao;
            isExist = true;
            return true;
        }
    })
    if (!isExist) {
        var miyaoItem = {
            "installedTag": installedTag,
            "code": valSaveMiyao
        }
        objStorageM.miyaoList.push(miyaoItem);
    }
    let storageVal = Base64.encode(JSON.stringify(objStorageM));

    window.localStorage.setItem(storageKey, storageVal);
    printLogInfo("保存注册码成功");
    $("#input_miyao").val("");
    $("#div_miyao_control").hide(500);
}

function calcXuliehao() {
    let $label_name = $("#header").find("div.top-profile-logout").find("div.label-name");
    if ($label_name == null || $label_name.length < 1) {
        return null;
    }
    let currentName = $.trim($label_name.text());
    if (currentName == null || currentName == "") {
        return null;
    }
    let content = {
        "currentName": currentName
    }
    return calcVersionVal() + "_" + md5(JSON.stringify(content));
}