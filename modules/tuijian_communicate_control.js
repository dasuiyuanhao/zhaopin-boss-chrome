/*!
* Author: dasuiyuanhao
* Date: 2020-3-20
*/

/**推荐牛人-自动打招呼 */
const btnAutoCommunicateTextDefault = "筛选并自动打招呼";
const btnAutoCommunicateTextStop = "停止自动打招呼";
var isExcutingAutoCommunicate = false;
var tryAutoCommunicateFailedTimesOfChat = 0;

//最多自动打招呼次数
var maxAutoCommunicateTimes = 500;
//收集到的所有的打招呼列表
var allDataMapOfAutoCommunicate=new HashMap();
//已打招呼列表
var operatedDataMapOfAutoCommunicate=new HashMap();
/**
 * 开始自动打招呼
 */
 function startAutoCommunicate(){
    isExcutingAutoCommunicate=true;
    printLogInfo("开始自动打招呼.....");

    allDataMapOfAutoCommunicate=new HashMap();
    operatedDataMapOfAutoCommunicate=new HashMap();

    var $btn = $("#search_btn6_control");
    $btn.text(btnAutoCommunicateTextStop);
    //开启debugger
    handOpenDebugger_backgroundAction();
}

/**
 * 停止自动打招呼
 */
function stopAutoCommunicate(){
    isExcutingAutoCommunicate=false;
    printLogInfo("停止自动打招呼....."+"共执行"+operatedDataMapOfAutoCommunicate.size()+"个");
    var $btn = $("#search_btn6_control");
    $btn.text(btnAutoCommunicateTextDefault);
    //关闭debugger
    handCloseDebugger_backgroundAction();
}

/**
 * 自动打招呼
 */
function doThingsOfAutoCommunicate(indexOfRecommendData) {
    if(!event.isTrusted){
        console.warn("非可信操作");
        return;
    }

    if(isExcutingAutoCommunicate){
        console.info("自动打招呼-正在执行中,准备停止");
        stopAutoCommunicate();
        return;
    }    

    //模拟鼠标点击坐标
    var failedMouseEventMsg="请先填写模拟鼠标点击的坐标，模拟点击位置为推荐牛人列表的左上方";    
    var val_autoMouseEventX = $.trim($("#input_autoMouseEventX_control").val());
    var val_autoMouseEventY = $.trim($("#input_autoMouseEventY_control").val());
    if(val_autoMouseEventX!=""){
        defaultSetting.autoMouseEventX = parseInt(val_autoMouseEventX);
    }
    if(val_autoMouseEventY!=""){
        defaultSetting.autoMouseEventY = parseInt(val_autoMouseEventY);
    }

    
    if (indexOfRecommendData == null || indexOfRecommendData < 0) {
        indexOfRecommendData = 0;
    }

    startAutoCommunicate();

    setTimeout(function () {
        autoCommunicateOneByOne(indexOfRecommendData);
    }, 500);
}

function autoCommunicateOneByOne(indexOfRecommendData){
    if(!isExcutingAutoCommunicate){
        stopAutoCommunicate();
        return;
    }

    if ($recommendLiList == null || $recommendLiList.length < 1) {
        alert("没有需要自动打招呼的数据");
        return;
    }

    if (recommendData == null || recommendData.length < 1) {
        alert("没有满足筛选条件的数据");
        return;
    }
    
    if (indexOfRecommendData >= recommendData.length) {
        stopAutoCommunicate();
        return;
    }

    var item = recommendData[indexOfRecommendData];
    var $li = $($recommendLiList[item.domIndex]);
    //判断是否未打过招呼

    if (item.goutong == "未沟通") {
        var $btn_doc = $li.find("span.btn-doc").find("button.btn");
        if ($btn_doc != null && $btn_doc.length > 0) {
            if ($btn_doc.hasClass("btn-greet")) {
                //滚动到这儿
                scrollTo($recommendLiList[item.domIndex]);
                showInfoOfOneByOne(item);

                // $btn_doc.click(function(e){
                //     alert("点击了打招呼按钮。"+JSON.stringify(e.originalEvent));
                // });

                //手动触发点击事件
                // handTriggerMouseEvent($btn_doc[0],"click");
                // $btn_doc.click();                
                handTriggerClickByTrusted($btn_doc[0]);

                operatedDataMapOfAutoCommunicate.put(item.geek,item);

                refreshBtnCommunicateBackground($btn_doc);

                indexOfRecommendData++;
                var ranNum = randomNum(2000, 20000);
                console.info("自动打招呼,暂停" + ranNum + "毫秒后继续执行。");
                setTimeout(function () {
                    autoCommunicateOneByOne(indexOfRecommendData);
                }, ranNum);

                return;
            }
        }
    }

    indexOfRecommendData++;
    return autoCommunicateOneByOne(indexOfRecommendData);
}

/*****测试代码 */
// $(document).ready(function(){
//     setTimeout(function(){
//         $("dl.menu-position").click(function(e){
//             console.log("点击了【职位管理】。"+JSON.stringify(e.originalEvent));
//         });
//     },2000);
// });
// $(document).ready(function(){
//     setTimeout(function(){
//         var $main = $(window.frames["recommendFrame"].document).find("#main");
//         $main.get(0).addEventListener('mouseup', function(e){
//             console.log("点击的推荐列表：",e);
//         });

//         $main.find("button.btn-greet").click(function(e){
//             console.log("点击了【打招呼】。"+JSON.stringify(e.originalEvent));
//         });
//     },10000);
// });
