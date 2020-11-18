//抓取页面的锚点
var $main=null;
var windowIframeName="recommendFrame";

const panel = document.createElement('div');
panel.id = 'extend_panel'
panel.innerHTML = `
<div class="left">
    <h3 style="color:black;background-color: lightblue;padding-left: 10px;">控制台</h3>
    
    
    <div class="dashboard-edit-box" style="line-height: 30px;">
        <span>打开【推荐牛人】页面，先滚动到页面底部加载简历(也可以一键加载全部)</span>
        <br/>
        学校名称：<textarea id="input_sql_control" style="width:420px; height: 60px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔">北京大学,中国人民大学,清华大学,北京交通大学,北京工业大学,北京航空航天大学,北京理工大学,北京科技大学,北京化工大学,北京邮电大学,中国农业大学,北京林业大学,北京中医药大学,北京师范大学,北京外国语大学,中国传媒大学,中央财经大学,对外经济贸易大学,北京体育大学,中央音乐学院,中央民族大学,中国政法大学,华北电力大学,南开大学,天津大学,天津医科大学,河北工业大学,太原理工大学,内蒙古大学,辽宁大学,大连理工大学,东北大学,大连海事大学,吉林大学,延边大学,东北师范大学,哈尔滨工业大学,哈尔滨工程大学,东北农业大学,东北林业大学,复旦大学,同济大学,上海交通大学,华东理工大学,东华大学,华东师范大学,上海外国语大学,上海财经大学,上海大学,第二军医大学,南京大学,苏州大学,东南大学,南京航空航天大学,南京理工大学,中国矿业大学,河海大学,江南大学,南京农业大学,中国药科大学,南京师范大学,浙江大学,安徽大学,中国科学技术大学,合肥工业大学,厦门大学,福州大学,南昌大学,山东大学,中国海洋大学,中国石油大学,郑州大学,武汉大学,华中科技大学,中国地质大学,武汉理工大学,华中农业大学,华中师范大学,中南财经政法大学,湖南大学,中南大学,湖南师范大学,国防科学技术大学,中山大学,暨南大学,华南理工大学,华南师范大学,广西大学,海南大学,四川大学,西南交通大学,电子科技大学,四川农业大学,西南财经大学,重庆大学,西南大学,贵州大学,云南大学,西藏大学,西北大学,西安交通大学,西北工业大学,西安电子科技大学,长安大学,西北农林科技大学,陕西师范大学,第四军医大学,兰州大学,青海大学,宁夏大学,新疆大学,石河子大学</textarea>
        <br/>
        年龄小于：<input id="input_2_control" type="text" style="width:40px;margin-right:8px;" value="34" />
        <input id="input_3_control" type="checkbox" checked="checked" style="width: 20px;height: 18px;line-height: 24px;text-align: center;margin: 2px;" />不包含应届生
        <span style="margin-left:8px;">学历：</span>
        <textarea id="input_5_control" style="width:120px; height: 28px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔">本科,硕士</textarea>
        <br/>
        求职岗位：<textarea id="input_4_control" style="width:420px; height: 28px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔">Java,架构师,技术经理,JavaScript,web前端,前端开发,HTML5</textarea>
        <br/>
        
        <br/>
        <button id="search_btn1_control"  style="float: left;width: 150px;height: 30px;margin-right:8px;">一键加载全部</button>
        <button id="search_btn2_control"  style="float: left;width: 150px;height: 30px;">筛选全部(Shift+q)</button>
        <br/>
        <br/>
        <button id="search_btn3_control"  style="float: left;width: 150px;height: 30px;margin-right:8px;">上一个(Shift+a)</button>
        <button id="search_btn4_control"  style="float: left;width: 150px;height: 30px;margin-right:8px;">下一个(Shift+d)</button>
        <span id="oneByOne_info_control" style="text-align: center;line-height: 30px;"></span>
        <br />
        <br />        

        <div id="result_view" style="width:420px; height: 100px;overflow-y: auto;"></div>
    </div>
    
</div>
`
document.body.appendChild(panel);

//当前视图
var current_view = 'dashboards';

const btn1TextDefault="一键加载全部";
const btn1TextStop="停止加载全部";

//查询结果
var excuteResultFailedIds=[];
//是否执行中
var isExcuting=false;
var maxExcuteNum=5000;

//全部li元素
var $recommendLiList=[];
//符合条件的数据集合
var recommendData=[];
//当前数据
var currentItem=null;


init().then(apps=>{
    var current_app = null;
    //渲染按钮的视图
    const render_view_buttons = (()=>{
        var vnode = panel.querySelector('.views');
        const render_fn = shown=>{
            return patch(vnode, h('div.views', {
                style: {
                    visibility: shown ? 'visible' : 'hidden'
                }
            }, [
                h('a.button', {
                    class: {
                        active: current_view == 'dashboards'
                    }, on: {
                        click: ()=>{
                            if(current_view == 'dashboards') return;
                            current_view = 'dashboards';
                            vnode = render_fn();
                            refresh_apps_div();
                            refresh_view();
                        }
                    }
                }, '仪表盘')
            ]));
        }
        return shown=>vnode = render_fn(shown);
    })();

    //渲染视图
    const refresh_view = (()=>{
        var metrics_buttons_vnode = panel.querySelector('.metrics-buttons');

        return function(switch_view){
            if(current_view == 'dashboards') {
                return render_all_dashboards().then(()=>{
                    render_view_buttons(true)
                    metrics_buttons_vnode = patch(metrics_buttons_vnode, h('div.metrics-buttons'));
                });

            }
        };
    })();

    refresh_view();

})

const btn = document.createElement('div');
btn.id = 'extend_toggle_button'
btn.innerText = '隐藏'
document.body.appendChild(btn);
btn.addEventListener('click', e=>{
    if(panel.style.display == 'none'){
        panel.style.display = 'block'
        btn.innerText = '隐藏'
    } else {
        panel.style.display = 'none'
        btn.innerText = '控制台'
    }
});

//去除重复
function removeRepeatData(arr){
    if(arr==null || arr.len()<1){
        return arr;
    }
    var new_arr=[];
    for(var i=0;i<arr.length;i++) {
        var items=arr[i];
        //判断元素是否存在于new_arr中，如果不存在则插入到new_arr的最后
        if($.inArray(items,new_arr)==-1) {
            new_arr.push(items);
        }
    }
}


/**筛选简历**/
//绑定快捷键
$(document).bind('keydown.shift_q', function(){
    try {
        doThings();
    } catch (error) {
        alert("筛选简历异常！");
        console.error(error);
        return;
    }
});
$(document).bind('keydown.shift_a', function(){
  selectPrev();
});
$(document).bind('keydown.shift_d', function(){
  selectNext();
});

//绑定按钮事件
const btnSC1=document.getElementById("search_btn1_control");
btnSC1.addEventListener('click', e=>{    
    try {
        scollLoadAll();
    } catch (error) {
        alert("一键加载全部异常！");
        console.error(error);
        return;
    }
});
const btnSC2=document.getElementById("search_btn2_control");
btnSC2.addEventListener('click', e=>{    
    try {
        doThings();
    } catch (error) {
        alert("筛选简历异常！");
        console.error(error);
        return;
    }
});
const btnSC3=document.getElementById("search_btn3_control");
btnSC3.addEventListener('click', e=>{
    selectPrev();
});
const btnSC4=document.getElementById("search_btn4_control");
btnSC4.addEventListener('click', e=>{
    selectNext();
});

/**滚动加载全部 */
var isExcutingScollLoad=false;
var tryScrollLoadFailedTimes=0;
var scollLoadEndItem=null;
var scollLoadTimes=0;
//最多加载次数
var maxLoadTimes=200;
function scollLoadAll(){
    var $search_btn1_control=$("#search_btn1_control");
    if(isExcutingScollLoad){
        //如果已经在执行，则停止
        isExcutingScollLoad=false;
        $search_btn1_control.text(btn1TextDefault);
        return;
    }
    $search_btn1_control.text(btn1TextStop);

    isExcutingScollLoad=true;
    tryScrollLoadFailedTimes=0;
    scollLoadEndItem=null;
    scollLoadTimes=0;
    var $result_view=$("#result_view"); 

    //开始滚动加载
    var rText="开始滚动加载简历.....";
    printLogInfo(rText,true);
    scrollLoadRecommendEnd();    
}

function stopScrollLoadRecommend(){
    isExcutingScollLoad=false;
    printLogInfo("结束滚动加载简历.....");
    var $search_btn1_control=$("#search_btn1_control");
    $search_btn1_control.text(btn1TextDefault);
}

//打印结果
function printLogInfo(rText,isClear){
    console.info(rText);
    var $result_view=$("#result_view");  
    if(isClear){
        $result_view.html("");
    }
    if($result_view.children().length>0){
        $result_view.prepend("<p>"+rText+"</p>");
    }
    else{
        $result_view.prepend("<p>"+rText+"</p>");
    }    
}

function scrollLoadRecommendEnd(){
    var result=0;
    if(!isExcutingScollLoad || tryScrollLoadFailedTimes>=3
        || scollLoadTimes>=maxLoadTimes){
        stopScrollLoadRecommend();
        return result;
    }

    var logMsgPart="滚动加载简历";     

    //找到最下面的元素
    try {     
        var $document=$(window.frames[windowIframeName].document);  
        var $recommend_card_list_li=$document.find("#main").find("ul.recommend-card-list").children("li");
        var rText=logMsgPart+",全部简历"+$recommend_card_list_li.length+"个 ";
        printLogInfo(rText);
        
        if($recommend_card_list_li==null || $recommend_card_list_li.length<1){
            printLogInfo(logMsgPart+",没有抓到页面数据，请重试!");
            stopScrollLoadRecommend();
            return result;
        }

        var $noMoreSpan=$document.find("div.loadmore").children("span");
        if($noMoreSpan!=null && $noMoreSpan.length>0){
            if($noMoreSpan.text=="没有更多了"){
                printLogInfo(logMsgPart+",没有更多了");
                stopScrollLoadRecommend();
                return result;
            }            
        }

        var $thisTimeLastLi=$($recommend_card_list_li[$recommend_card_list_li.length-1]);

        var thisTimeLast=$thisTimeLastLi.find(".card-inner").first().attr("data-geek");

        if(thisTimeLast==scollLoadEndItem){
            tryScrollLoadFailedTimes++;
            return scrollLoadRecommendEnd();
        }

        scollLoadEndItem=thisTimeLast;

        if ($thisTimeLastLi!=null && $thisTimeLastLi.length > 0) {
            var scrollTop=$thisTimeLastLi.offset().top;
            var $iframe_syncFrame = $(window.frames[windowIframeName]);
            $iframe_syncFrame.scrollTop(scrollTop-200);
        }
    } catch (error) {        
        printLogInfo(logMsgPart+",异常:");
        console.error(error);     
        stopScrollLoadRecommend();   
        return result;
    }

    result++;
    scollLoadTimes+=result;
    printLogInfo(logMsgPart+",加载第"+scollLoadTimes+"次成功");
    setTimeout(function(){
        return scrollLoadRecommendEnd();       

    }, 2000);    
}

function doThings(){
    if(isExcuting){
        alert("正在玩命处理中，请稍候...");
        return;
    }
        
    var universityNames=[];
    excuteResultFailedIds=[];
    recommendData=[];
    currentItem=null;

    var $result_view=$("#result_view");
    // $result_view.text("正在玩命处理中，请等候...");
    //学校名称
    var inputSql=$.trim($("#input_sql_control").val());
    if(inputSql!=''){
        //如果是带换行符
        inputSql=inputSql.replace(/\n/g,",");
        universityNames=inputSql.split(",");
    }
    if(universityNames!=null){
        if (universityNames.length > maxExcuteNum) {
            $result_view.text("输入参数不能为超过" + maxExcuteNum + "条");
            return;
        }
    }
    
    //年龄
    var ageLessThan=null;
    var ageVal=$.trim($("#input_2_control").val());
    if(ageVal!=""){
        var reg=/[1-9]+\d*/;
        if(!reg.test(ageVal)){
            $result_view.text("输入年龄必须为正整数");
            return;
        }
        ageLessThan=parseInt(ageVal);
    }
    //过滤应届毕业生
    var filterYingJie=false;
    if($("#input_3_control").prop("checked")){
        filterYingJie=true;
    }
    //求职岗位
    var filterExpects=[];
    var input_4_val=$.trim($("#input_4_control").val());
    if(input_4_val!=''){
        //如果是带换行符
        input_4_val=input_4_val.replace(/\n/g,",");
        filterExpects=input_4_val.split(",");
        if(filterExpects==null){
            filterExpects=[];
        }
        filterExpects=trimArray(filterExpects);
    }    
    //学历
    var filterEducations=[];
    var input_5_val=$.trim($("#input_5_control").val());
    if(input_5_val!=''){
        //如果是带换行符
        input_5_val=input_5_val.replace(/\n/g,",");
        filterEducations=input_5_val.split(",");
        if(filterEducations==null){
            filterEducations=[];
        }
        filterEducations=trimArray(filterEducations);
    }
        
    // isExcuting=true;

    //找到简历列表
    // $main=$("#main").find("iframe").first();
    $main=$(window.frames[windowIframeName].document).find("#main");         
    
    // var $recommend_card_list= $main.find("ul.recommend-card-list");  //$("ul.recommend-card-list");
    var $recommend_card_list=$main.find("ul.recommend-card-list");
    console.info("简历列表:"+$recommend_card_list.length);
    if($recommend_card_list==null || $recommend_card_list.length<1){
        alert("没有抓到页面数据，请重试!");
        isExcuting=false;
        return;
    }
    
    $recommendLiList=$recommend_card_list.children("li").has("div.geek-info-card");
    var rText="全部简历"+$recommendLiList.length+"个 ";
    console.info(rText);

    var collectData=[];
    for(var i=0;i<$recommendLiList.length;i++){
        var $li=$($recommendLiList[i]);
        var item = { 
            "domIndex": i,
            "eduExpList": [],//教育经历
        };
        //标识
        item.geek=$li.find(".card-inner").first().attr("data-geek");

        //沟通情况
        item.goutong="";
        var $btn_doc=$li.find("span.btn-doc").children("button");
        if($btn_doc!=null && $btn_doc.length>0){
            if($btn_doc.hasClass("btn-continue")){
                item.goutong="已沟通";
            }
            else if($btn_doc.hasClass("btn-greet")){
                item.goutong="未沟通";                
            }
            else{
                item.goutong="";
            }
        }

        //姓名
        item.realName=$li.find("div.avatar-box").find("img").first().attr("alt");
        var $info_labels=$li.find("div.info-labels").first().find("span.label-text");
        if($info_labels){
            $info_labels.each(function(index,element){
                var $e=$(element);
                if(index==0){
                    item.age = null;
                    var age = $.trim($e.text()).replace("岁", "");
                    if ($.isNumeric(age)) {
                        item.age = parseInt(age);
                    }
                } else if(index==1){
                    item.jobAge=$.trim($e.text());
                } else if(index==2){
                    item.education=$.trim($e.text());
                } else if(index==3){
                    item.jobStatus=$.trim($e.text());
                }
            });            
        }

        //教育经历
        var $edu_exp_li_list=$li.find("ul.edu-exp-box").children("li");
        if($edu_exp_li_list && $edu_exp_li_list.length>0){
            $edu_exp_li_list.each(function(index,element){
                var $e=$(element);
                var $span= $e.children("span");
                if($span){
                    var eduExpItem={"index":index};
                    if($span.length>0){
                        eduExpItem.year= $span.first().text();
                    }
                    if($span.length>1){
                        var eduContent= $.trim($($span[1]).text());
                        if(eduContent){
                            var splitEdu=eduContent.split("·");
                            if(splitEdu && splitEdu.length>0){
                                eduExpItem.universityName= $.trim(splitEdu[0]);
                                if(splitEdu.length>1){
                                    //专业
                                    eduExpItem.eduMajor= $.trim(splitEdu[1]);
                                }
                                if(splitEdu.length>2){
                                    eduExpItem.eduDegree= $.trim(splitEdu[2]);
                                }
                            }
                        }                       
                        
                    }
                    item.eduExpList.push(eduExpItem);
                }
            }); 
        }

        //求职期望
        item.expect=null;
        var $expectSpans=$li.find("div.expect-box").children("span");
        if($expectSpans && $expectSpans.length>1){
            var expectContent=$.trim($($expectSpans.get(1)).text());
            var expectArr=expectContent.split("·");
            if(expectArr && expectArr.length>1){
                item.expect=$.trim(expectArr[1]);
            }
        }

        collectData.push(item);
    }
    
    isExcuting=false;

    //筛选符合条件的数据
    for(var i=0;i<collectData.length;i++){
        var item=collectData[i];
        if(item==null || item.geek==null){
            alert("已抓取的数据异常！");
            return;
        }
        
        var checkResult="";
        //过滤学校名称
        if(item.eduExpList && item.eduExpList.length>0
            && universityNames.length>0){
            var eduFilter=false;
            for(var j=0;j<item.eduExpList.length;j++){
                var eduItem=item.eduExpList[j];
                //符合学校条件
                if(checkStringOfLike(eduItem.universityName,universityNames)){
                    eduFilter=true;
                    break;
                }
            }
            if(!eduFilter){
                checkResult+="学校名称不符合条件。";
            }
        }
        //判断年龄
        if(ageLessThan!=null && item.age!=null ){
            if(ageLessThan<=item.age){
                checkResult+="年龄不符合条件。";
            }
        }
        //过滤应届生
        if(filterYingJie && item.jobAge.indexOf("应届生")>=0){
            checkResult+="应届生不符合条件。";
        }
        //过滤求职期望
        if(item.expect!=null && item.expect!="" 
            && filterExpects!=null && filterExpects.length>0){
            if(!checkStringOfLike(item.expect,filterExpects)){
                checkResult+="求职职位不符合条件。";
            }
        }
        //过滤学历
        if(filterEducations!=null && filterEducations.length>0){
            if(item.eduExpList && item.eduExpList.length>0){
                var eduFilter=true;
                for(var j=0;j<item.eduExpList.length;j++){
                    var eduItem=item.eduExpList[j];
                    //符合条件,只要有一个学历不在学历要求中则不满足，例如专升本不满足
                    if(!checkStringOfLike(eduItem.eduDegree,filterEducations)){
                        eduFilter=false;
                        break;
                    }
                }
                if(!eduFilter){
                    checkResult+="学历不符合条件。";
                }
            }
        }
        
        item.checkResult=checkResult;
        
        /**
         * 校验通过的处理
         */
        var $li=$($recommendLiList.get(item.domIndex));
        $li.css("background-color","white");
        if(checkResult==""){
            recommendData.push(item);

            //标记li元素的背景颜色            
            if($li!=null){
                //如果未沟通比较橙色
                if(item.goutong=="未沟通"){
                    $li.css("background-color","orange");
                }               
                else if(item.goutong=="已沟通"){
                    $li.css("background-color","lightblue");
                }   
            }

            //点击按钮，绑定事件
            var $btn_doc=$li.find("span.btn-doc").children("button");
            $btn_doc.click(btnCommunicateRefresh);
        }            
    }
    
    
    rText+="，共"+recommendData.length+"个符合条件。";
    if(recommendData.length>0){
        rText+=JSON.stringify(recommendData);
    }

    console.log(rText);
    $result_view.text(rText);
}

/**
 * 判断是否包含字符串
 */
function checkStringOfLike(str,arr){
    var result=false;
    if(!arr || arr.length<1){
        return result;
    }
    if(str==null){
        return result;
    }

    $.each(arr,function(index,item){
        if(str.indexOf(item)>=0){
            result=true;
            return true;
        }
    });

    return result;
}

function selectNext(){
    showInfoOfOneByOne();
    if (recommendData == null || recommendData.length <= 0) {
        alert("请先筛选");
        return;
    }
    if (currentItem != null) {
        var idx = recommendData.indexOf(currentItem);
        if (idx < 0) {
            alert("数据不存在");
            return;
        }
        if (idx + 1 >= recommendData.length) {
            //已经到最后了,从第一个开始
            // alert("已经到最后了");
            currentItem = recommendData[0];
        }
        else{
            currentItem = recommendData[idx + 1];
        }        
    }
    else{
        currentItem=recommendData[0];
    }
    
    console.info("找到了下一个:"+JSON.stringify(currentItem));
    //滚动到这儿
    scrollTo($recommendLiList[currentItem.domIndex]);
    showInfoOfOneByOne(currentItem);
}

function selectPrev(){
    showInfoOfOneByOne();
    if (recommendData == null || recommendData.length <= 0) {
        alert("请先筛选");
        return;
    }
    if (currentItem != null) {
        var idx = recommendData.indexOf(currentItem);
        if (idx < 0) {
            alert("数据不存在");
            return;
        }
        if (idx ==0) {
            //已经到第一个了，从倒数第一开始
            // alert("已经到第一个了");
            currentItem = recommendData[recommendData.length - 1];
        }
        else{
            currentItem = recommendData[idx - 1];
        }        
    }
    else{
        // alert("没有上一个");
        //没有上一个，从倒数第一开始
        currentItem = recommendData[recommendData.length - 1];
    }
    
    console.info("找到了上一个:"+JSON.stringify(currentItem));
    //滚动到这儿
    scrollTo($recommendLiList[currentItem.domIndex]);
    showInfoOfOneByOne(currentItem);
}

function showInfoOfOneByOne(data){
    var msg="";
    if(data!=null){
        msg="第"+(recommendData.indexOf(data)+1)+"个姓名："+data.realName;
    }

    var $span_oneByOne=$("#oneByOne_info_control");
    $span_oneByOne.text(msg);
}

//滚动到指定位置
function scrollTo(element, speed) {
    try {
        if (element == null) {
            return;
        }

        if (!speed) {
            speed = 300;
        }

        var $iframe_syncFrame = $(window.frames[windowIframeName]);
        // $iframe_syncFrame.scrollTop(-10000);
        if (!element) {
            // $("html,body").animate({ scrollTop: 0 }, speed);
            // $iframe_syncFrame.animate({ scrollTop: 0 });
            $iframe_syncFrame.scrollTop(0);
        } else {
            var $e = $(element);
            if ($e.length > 0) {
                // $("html,body").animate({ scrollTop: $e.offset().top-200 + "px" }, speed);
                var scrollTop=$e.offset().top;
                $iframe_syncFrame.scrollTop(scrollTop-200);
            }
        }
    } catch (error) {
        console.error(error);
        alert("滚动到指定位置,异常了");
    }
}

//数组去除空
function trimArray(data){
    if(data==null || data.length<1){
        return data;
    }
    for (var i = data.length - 1; i >= 0; i--) {
        var item = $.trim(data[i]);
        if (item == null || item == "") {
            data.splice(i, 1);
        }
    }
    return data;
}

//打招呼之后切换背景颜色
function btnCommunicateRefresh(e){
    var $btn_doc=$(this);
    if($btn_doc!=null && $btn_doc.length>0){
        var $li = $btn_doc.parents("li");
        // // 直接置为淡蓝色
        // $li.css("background-color","lightblue");    
        
        setTimeout(function(){
            if ($btn_doc.hasClass("btn-continue")) {
                $li.css("background-color", "lightblue");
            }
        },1000);
        
    }
    
}