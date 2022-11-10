/*!
* Author: dasuiyuanhao
* Date: 2020-3-20
*/

/**【沟通】-自动发消息 */

/******************************************** */
/***
 * 1、先滚动到顶部，收集当前的列表信息，循环执行发消息；
 * (1)判断是否已经在[滚动收集到的所有的沟通列表],如果不存在，则收集起来； * 
 * (2)判断是否已经在[本次自动滚动的已发消息列表],如果不存在，则收集起来，执行第(3)步；如果已经存在则跳过继续。
 * (3)触发单个发消息；
 * 2、定时随机数的毫秒时间之后，滚动到当前列表的最后一个元素,同上循环执行发消息。如果超过3次底部的元素是重复的，则结束自动发消息。
 * 
 */

/**对于已读的自动再发一次消息 */
const btnChatAutoSendMsgTextDefault = "一键自动发消息";
const btnChatAutoSendMsgTextStop = "停止自动发消息";
var isExcutingAutoSendMsg = false;
var tryAutoSendMsgFailedTimesOfChat = 0;
var autoSendMsgEndItemOfChat = null;
var autoSendMsgTimesOfChat = 0;
//最多自动沟通次数
var maxAutoSendMsgTimesOfChat = 100;

//滚动收集到的所有的沟通列表
var allDataListOfAutoScrollMap=new HashMap();
//已发消息列表
var sendedDataListOfAutoScrollMap=new HashMap();

function stopAutoSendMsgChat() {
    isExcutingAutoSendMsg = false;
    printLogInfo("结束一键自动发消息.....");
    var $btn_chat_autoSendMsgForRead = $("#btn_chat_autoSendMsgForRead");
    $btn_chat_autoSendMsgForRead.text(btnChatAutoSendMsgTextDefault);
}

/**
 * 一键自动发消息
 */
 function autoSendMsgForRead(indexOfData) {
    if(!event.isTrusted){
        console.warn("非可信操作");
        return;
    }

    // var sendMsg= $.trim($("#input_chat_send_msg").val());
    // if(isBlank(sendMsg)){
    //     alert("请填写消息内容，不能为空。");
    //     return;
    // }
    

    var str_input_maxAutoSendMsgTimesOfChat=$.trim($("#input_maxAutoSendMsgTimesOfChat").val());
    if(isBlank(str_input_maxAutoSendMsgTimesOfChat)){
        alert("请填写自动发消息最大数量，不能为空。");
        return;
    }
    if(!isNumeric(str_input_maxAutoSendMsgTimesOfChat) || parseInt(str_input_maxAutoSendMsgTimesOfChat)<1
        || parseInt(str_input_maxAutoSendMsgTimesOfChat)>10000){
        alert("自动发消息最大数量，只能为1-10000的数字。");
        return;
    }
    maxAutoSendMsgTimesOfChat=parseInt(str_input_maxAutoSendMsgTimesOfChat);
    
    //开始自动发消息
    var rText = "开始一键自动发消息.....";
    printLogInfo(rText, true);

    
    var $btn_chat_autoSendMsgForRead = $("#btn_chat_autoSendMsgForRead");
    if (isExcutingAutoSendMsg) {
        //如果已经在执行，则停止        
        return stopAutoSendMsgChat();
    }
    $btn_chat_autoSendMsgForRead.text(btnChatAutoSendMsgTextStop);

    isExcutingAutoSendMsg = true;
    tryAutoSendMsgFailedTimesOfChat = 0;
    autoSendMsgEndItemOfChat = null;
    autoSendMsgTimesOfChat = 0;

    //自动打招呼数据列表
    autoSendedMsgDataList=[];

    //滚动收集到的所有的沟通列表
    allDataListOfAutoScrollMap=new HashMap();
    //已发消息列表
    sendedDataListOfAutoScrollMap=new HashMap();

    //开始滚动加载
    scollLoadAllChatOfAutoSendMsg();
        
}


/**
 * 一个接一个的执行，递归执行
 * @param {数据中的索引} indexOfData 
 * @returns 
 */
function autoSendMsgOneByOne(indexOfData){

    var result = 0;
    if (!isExcutingAutoSendMsg || tryAutoSendMsgFailedTimesOfChat >= 3 ) {
        stopAutoSendMsgChat();
        return result;
    }

    var logMsgPart = "滚动加载沟通列表";
    
    if(autoSendMsgTimesOfChat >= maxAutoSendMsgTimesOfChat){
        printLogInfo("为规避风险，最多自动执行"+maxAutoSendMsgTimesOfChat+"个");
        return stopAutoSendMsgChat();
    }

    if (indexOfData == null || indexOfData < 0) {
        indexOfData = 0;
    }

    if (indexOfData >= resultChatDataList.length) {
        // stopAutoSendMsgChat();
        return scollEndOfAutoSendMsg(result);
    }

    var itemData = resultChatDataList[indexOfData];

    if(itemData.currentuid==null || $.trim(itemData.currentuid)==""){
        printLogInfo("为规避风险itemData.currentuid为空时，停止执行");
        return stopAutoSendMsgChat();
    }

    //判断是否已经收集
    if(!allDataListOfAutoScrollMap.containsKey(itemData.currentuid)){
        allDataListOfAutoScrollMap.put(itemData.currentuid,itemData);
    }
    //判断是否已经发送消息
    if(!sendedDataListOfAutoScrollMap.containsKey(itemData.currentuid)){
        sendedDataListOfAutoScrollMap.put(itemData.currentuid,itemData);
        console.info("一键发送消息，未发送消息,itemData.currentuid="+itemData.currentuid+"。");
    }
    else{
        console.info("一键发送消息，已经发送消息,itemData.currentuid="+itemData.currentuid+"。");

        var ranNum = randomNum(500, 2000);
        console.info("自动发消息,暂停" + ranNum + "毫秒后准备发消息。");
        setTimeout(function () {autoSendMsgOneByOne();},ranNum);
        return;
    }

    var $li = $($chatGeekItemList[itemData.domIndex]);

    if($li==null || $li.length<1){
        // stopAutoSendMsgChat();
        return scollEndOfAutoSendMsg(result);
    }

    // //滚到这个
    // selectNextChat(indexOfData-1);

    //选中聊天框
    $li.click();

    var ranNum = randomNum(500, 3000);
    console.info("自动发消息,暂停" + ranNum + "毫秒后准备发消息。");
    setTimeout(function () {

        //自动点击接收简历
        try{
            let autoReceiveResume = false;
            if ($("#input_autoReceiveResume_control").prop("checked")) {
                autoReceiveResume = true;
            }
            if(autoReceiveResume){
                //查找接受简历的按钮
                let $btAgree=$("div.notice-list").find("a.link-agree")
                if($btAgree!=null && $btAgree.length>0){
                    // $btAgree.trigger("click");
                    //开启debugger
                    handOpenDebugger_backgroundAction();
                    handTriggerDirectClickByTrusted($btAgree[0])
                    //关闭debugger
                    handCloseDebugger_backgroundAction();
                }
            }
        }catch(e){
            console.error("自动点击接收简历异常，",e)
        }        

        //将要发送的消息内容
        var sendMsg=$("#input_chat_send_msg").val();
        if(!isBlank(sendMsg)){
            sendChatMsg(sendMsg,itemData);
            //加入到再次沟通列表里
            let existZaici=false;
            $.each(zaiCiGouTongDataList,function(index,zItem){
                if(zItem.currentuid==itemData.currentuid){
                    zaiCiGouTong=true;
                    return true;
                }
            });
            if(!existZaici){
                zaiCiGouTongDataList.push(itemData);
            }
            
            //更新背景颜色
            refreshChatItemRemark($li,"已沟通");

            //加入本次列表
            autoSendedMsgDataList.push(itemData);
            showChatInfoOfOneByOne(itemData);
            var diJiGe=resultChatDataList.indexOf(itemData) + 1
            printLogInfo("自动发消息给第"+diJiGe+"个"+itemData.realName+"成功。自动发消息共"+sendedDataListOfAutoScrollMap.size()+"个。")
        }        

        autoSendMsgTimesOfChat++;
        indexOfData++;
        ranNum = randomNum(300, 2000);
        console.info("自动发消息,暂停" + ranNum + "毫秒后操作下一个。");
        setTimeout(function () {
            autoSendMsgOneByOne(indexOfData);

        }, ranNum);

    }, ranNum);
    

}

//发消息
function sendChatMsg(msg,itemData) {
    if(isBlank(msg)){
        console.info("发消息，内容不能为空。"+JSON.stringify(itemData));
        return;
    }

    var $bosschat_input=$("div.boss-chat-editor-input");
    if($bosschat_input.length>0){
        $bosschat_input.html(msg);
        handTriggerEventOfKeydownAndKeyup($bosschat_input[0]);

        var $btn_send = $("div.submit");
        // $btn_send.removeClass("btn-disabled");        
        $btn_send.click();
    }
}

// //发送消息后
// function handleAfterSendMsg(){
//     //发消息后自动滚动到下一个
//     if ($("#input_chat_send_next").prop("checked")) {
//         return;
//     }

//     var itemDataGeek = $("div.geek-active");
//     var currentIndex = null;
//     if (recommendData != null && !$.isEmptyObject(itemDataGeek)) {
//         $.each(recommendData, function (i, item) {
//             // console.info("打招呼之后--循环查找："+i);
//             if (itemDataGeek == item.geek) {
//                 currentIndex = i;
//                 return true;
//             }
//         });
//         selectNext(currentIndex);
//     }

//     //选中聊天框
//     $li.click();

// }

/************************************** */
/**
 * 一键自动发消息--自动滚动代码
 */
var tryScrollLoadFailedTimesOfAutoSendMsg = 0;
var scollLoadEndItemOfAutoSendMsg = null;
var scollLoadTimesOfAutoSendMsg = 0;
//最多加载次数
var maxLoadTimesOfAutoSendMsg = 100;
function scollLoadAllChatOfAutoSendMsg() {
    tryScrollLoadFailedTimesOfAutoSendMsg = 0;
    scollLoadEndItemOfAutoSendMsg = null;
    scollLoadTimesOfAutoSendMsg = 0;

    //开始滚动加载
    //先滚动到顶部
    scrollToTopOfChat();

    var rText = "一键自动发消息-开始滚动加载沟通列表.....";
    printLogInfo(rText);
    tryScrollLoadOfAutoSendMsg();
}

function stopScrollLoadRecommendOfAutoSendMsg() {
    isExcutingAutoSendMsg = false;
    printLogInfo("一键自动发消息-结束滚动加载沟通列表.....");

    stopAutoSendMsgChat();
}

//尝试滚动加载-发消息
function tryScrollLoadOfAutoSendMsg() {
    var result = 0;
    if (!isExcutingAutoSendMsg || tryScrollLoadFailedTimesOfAutoSendMsg >= 3
        || scollLoadTimesOfAutoSendMsg >= maxLoadTimesOfAutoSendMsg) {
        stopScrollLoadRecommendOfAutoSendMsg();
        return result;
    }

    var logMsgPart = "一键自动发消息-滚动加载沟通列表";


    //重新获取下已读
    queryYidu();
    if ($chatGeekItemList == null || $chatGeekItemList.length < 1) {
        printLogInfo("没有需要自动再发一次消息的数据");
        tryScrollLoadFailedTimesOfAutoSendMsg++;
        setTimeout(function () {
            return tryScrollLoadOfAutoSendMsg();
        }, randomNum(200, 1000));
        return;
    }

    if (resultChatDataList == null || resultChatDataList.length < 1) {
        printLogInfo("沟通列表没有需要发送消息");
        tryScrollLoadFailedTimesOfAutoSendMsg++;
        setTimeout(function () {
            return tryScrollLoadOfAutoSendMsg();
        }, randomNum(200, 1000));
        return ;
    }

    autoSendMsgOneByOne(0);


}

//滚动到底部
function scollEndOfAutoSendMsg(result){    
    var logMsgPart="滚动到底部";
    //找到最下面的元素
    try {
        let $chatContainer = $("div.chat-content-container");
        $chatGeekItemList=$chatContainer.find("div.geek-item");
        
        var rText = logMsgPart + ",全部沟通" + $chatGeekItemList.length + "个 ";
        printLogInfo(rText);

        if ($chatGeekItemList == null || $chatGeekItemList.length < 1) {
            printLogInfo(logMsgPart + ",没有抓到页面数据，请重试!");
            stopScrollLoadRecommendOfAutoSendMsg();
            return result;
        }

        var $thisTimeLastLi = $($chatGeekItemList[$chatGeekItemList.length - 1]);
        var $warp=$thisTimeLastLi.find("div.geek-item-warp");
        var thisTimeLast = findUidOfChat($warp);


        if (thisTimeLast == scollLoadEndItemOfAutoSendMsg) {
            
            tryScrollLoadFailedTimesOfAutoSendMsg++;
            setTimeout(function () {
                return tryScrollLoadOfAutoSendMsg();
            }, randomNum(500, 2000));
            return;
        }

        scollLoadEndItemOfAutoSendMsg = thisTimeLast;

        //滚到最后一个
        if($chatGeekItemList!=null && $chatGeekItemList.length>0){            
            printLogInfo("沟通列表滚动到底部，滚动到第"+$chatGeekItemList.length+"个");
            scrollToChatItem($($chatGeekItemList.get($chatGeekItemList.length-1)));
            
        }

    } catch (error) {
        printLogInfo(logMsgPart + ",异常:");
        console.error(error);
        stopScrollLoadRecommendOfAutoSendMsg();
        return result;
    }

    result++;
    scollLoadTimesOfAutoSendMsg += result;
    printLogInfo(logMsgPart + ",加载第" + scollLoadTimesOfAutoSendMsg + "次成功");
    setTimeout(function () {
        return tryScrollLoadOfAutoSendMsg();

    }, randomNum(1000, 5000));
}


