//抓取页面的锚点
var $main=null;
var windowIframeName="recommendFrame";

const panel = document.createElement('div');
panel.id = 'extend_panel'
panel.innerHTML = `
<div class="left">
    <div style="color:black;background-color: lightblue;cursor: pointer;" title="先设置默认打招呼语，然后打开【推荐牛人】页面，滚动到页面底部加载简历，也可以一键加载全部。">
        <label style="padding-left: 10px;font-size:14px;font-weight: bold;">控制台</label>
        <label style="float:right;padding-right:10px;font-weight: bold;" >?</label>
    </div>   
    
    <div class="dashboard-edit-box" style="line-height: 30px;">
        <div >            
            <label class="form-label" style="line-height: 52px;">学校名称：</label>
            <textarea id="input_sql_control" class="form-input" style="width:320px; height: 52px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔"></textarea>
        </div>   
        <div style="line-height: 30px;height: 30px;margin-top:10px;">
            <label class="form-label" style="line-height: 30px;">年龄小于：</label>
            <input id="input_2_control" type="text" class="form-input" value="" style="width:40px;" />

            <label class="form-label" style="line-height: 30px;margin-left:20px;">学历：</label>
            <textarea class="form-input" id="input_5_control" style="width:120px; height: 30px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔"></textarea>
        
            <button id="search_btn5_control"  style="min-width: 40px;width: 60px;height: 24px;line-height: 24px;font-size: 10px;margin-left: 20px;" class="form-btn" title="">保存配置</button>
        </div>   
        <div style="line-height: 30px;height: 30px;margin-top:10px;">
            <input class="form-input" id="input_3_control" type="checkbox" checked="checked" style="height: 30px;width: 16px;line-height: 30px;margin: 0;padding: 0;" />
            <label class="form-label" style="line-height: 30px;" for="input_3_control">不包含应届生</label>

            <input class="form-input" id="input_6_control" type="checkbox" style="height: 30px;width: 16px;line-height: 30px;margin: 0;padding: 0;margin-left:20px;" />
            <label class="form-label" style="line-height: 30px;" for="input_6_control">打招呼后自动滚动到下一个</label>
        </div>        
        
        <div style="line-height: 30px;margin-top:10px;">
            <label class="form-label">求职岗位：</label>
            <textarea id="input_4_control" class="form-input" style="width:300px; height: 28px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔"></textarea>
        </div>  
        <div style="line-height: 30px;margin-top:10px;">
            <label class="form-label">求职意向不包含：</label>
            <textarea id="input_7_control" class="form-input" style="width:258px; height: 28px;"  placeholder="例如：在职-暂不考虑。多个以英文逗号、换行分隔"></textarea>
        </div>  
        
        <div style="line-height: 30px;margin-top:10px;">
            <button id="search_btn1_control"  style="width: 130px;height: 30px;margin-right:8px;background-color: orange;" class="form-btn" title="不要使用太频繁，可能会封号">一键加载全部</button>
            <button id="search_btn2_control"  style="width: 130px;height: 30px;" class="form-btn">筛选全部(Shift+q)</button>
        </div>  
        <div style="line-height: 30px;margin-top:10px;height: 40px;">
            <button id="search_btn3_control"  style="width: 130px;height: 30px;margin-right:8px;" class="form-btn">上一个(Shift+a)</button>
            <button id="search_btn4_control"  style="width: 130px;height: 30px;margin-right:8px;" class="form-btn">下一个(Shift+d)</button>
            <span id="oneByOne_info_control" style="text-align: center;line-height: 30px;"></span>
        </div>      

        <div id="result_view" style="width:420px; height: 100px;overflow-y: auto;">
            &nbsp;
        </div>
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

/**
 * 加载默认配置 开始
 */
var defaultSetting={
    filterUniversityName:"",
};

var loadFromSaved=false;
if (window.localStorage) {
    var strOfMySetting = window.localStorage.getItem('mySetting');
    if(strOfMySetting!=null && strOfMySetting!=""){
        var mySetting=JSON.parse(strOfMySetting);

        if(mySetting!=null){
            defaultSetting=mySetting;
            loadFromSaved=true;
            printLogInfo("读取配置成功！");
        }        
    }
}
//如果读取不到本地配置，则设置默认值
if(!loadFromSaved){
    //筛选学历 211/985院校
    // defaultSetting.defaultSetting="北京大学,清华大学,中国人民大学,北京师范大学,北京航空航天大学,中国农业大学,北京理工大学,北京科技大学,北京交通大学,中国协和医科大学,中央音乐学院,北京邮电大学,北京外国语大学,北京化工大学,中国政法大学,北京语言大学,北京工业大学中央戏剧学院,中央美术学院,对外经济贸易大学,中央财经大学,北京中医药大学,北京体育大学,北京林业大学,中国传媒大学,国际关系学院,中央民族大学,石油大学,复旦大学,上海交通大学同济大学,华东师范大学,上海财经大学,华东理工大学,上海第二医科大学,上海大学,上海外国语大学,东华大学,南开大学,天津大学,天津医科大学,中央司法警官学院,华北电力大学,燕山大学,河北工业大学,太原理工大学,山西农业大学,内蒙古大学,大连理工大学,东北大学,辽宁大学,大连海事大学,沈阳农业大学,辽宁工程技术大学,吉林大学,东北师范大学,延边大学,哈尔滨工业大学,哈尔滨工程大学,东北林业大学,东北农业大学,大庆石油学院,南京大学,东南大学,中国矿业大学,南京师范大学,南京航空航天大学,南京理工大学,南京农业大学,苏州大学,中国药科大学,河海大学,江苏大学,南京信息工程大学,江南大学,浙江大学,中国科学技术大学,安徽大学合肥工业大学,厦门大学,福州大学,南昌大学,山东大学,中国海洋大学,郑州大学,武汉大学,华中科技大学,华中师范大学,中国地质大学,华中农业大学,武汉理工大学,中南财经政法大学,中南大学,湖南大学,湖南师范大学,湘潭大学,中山大学,华南理工大学,华南师范大学,暨南大学,华南农业大学,广西大学,重庆大学,西南政法大学,西南师范大学,西南农业大学,四川大学,电子科技大学,西南交通大学,西南财经大学,四川农业大学,云南大学,西安交通大学,西北工业大学,西北大学,西安电子科技大学,西北农林科技大学,陕西师范大学,长安大学,陕西科技大学,兰州大学,新疆大学,国防科学技术大学,贵州大学,西北农林科大学,石河子大学,海南大学,宁夏大学,青海大学,西藏大学,第二军医大学,第四军医大学,合肥工业大学西南大学,安徽大学,中国石油大学,同济大学,合肥工业大学,河南大学,国防科技大学,西南大学,上海交通大学,北京工业大学,辽宁大学,东北林业大学,海军军医大学,空军军医大学,成都理工大学,上海中医药大学,天津工业大学,南京邮电大学,首都师范大学,成都中医药大学,宁波大学,上海海洋大学,南京林业大学,天津中医药大学,广州中医药大学,中国科学院大学,南京中医药大学,北京工商大学,延边大学";
    //筛选学校 全国一本院校
    defaultSetting.filterUniversityName="清华大学,北京大学,北京航空航天大学,北京中医药大学,北京语言大学,北京第二外国语学院,北京工商大学,中央民族大学,中国传媒大学,首都师范大学,中国政法大学,中央财经大学,中国人民大学,北京师范大学,中国农业大学,北京外国语大学,北京科技大学,北京邮电大学,北京交通大学,北京化工大学,北京工业大学,北京林业大学,中国地质大学,中国石油大学,中国矿业大学,华北电力大学,北京理工大学,北方工业大学,南开大学,天津大学,天津医科大学,天津财经大学,中国民航大学,河北大学,燕山大学,石家庄铁道大学,山西大学,太原理工大学,中北大学,内蒙古大学,内蒙古工业大学,大连海事大学,辽宁大学,辽宁工程技术大学,大连理工大学,东北大学,沈阳农业大学,中国医科大学,东北财经大学,吉林大学,延边大学,长春理工大学,东北师范大学,哈尔滨理工大学,哈尔滨工程大学,哈尔滨工业大学,黑龙江大学,东北林业大学,东北农业大学,东北石油大学,哈尔滨商业大学,华东理工大学,同济大学,华东师范大学,东华大学,上海外国语大学,上海理工大学,华东政法大学,上海财经大学,上海对外经贸大学,上海大学,上海交通大学,复旦大学,上海海事大学,南京大学,东南大学,南京农业大学,南京工业大学,南京邮电大学,南京财经大学,南京航空航天大学,中国药科大学,河海大学,苏州大学,南京信息工程大学,江苏大学,江苏科技大学,南京理工大学,南京林业大学,南京医科大学,南京中医药大学,南京师范大学,江南大学,浙江大学,宁波诺丁汉大学,宁波大学,浙江工业大学,杭州电子科技大学,浙江理工大学,浙江工商大学,福州大学,福建师范大学,厦门大学,华侨大学,福建农林大学,中国科学技术大学,合肥工业大学,安徽大学,安徽医科大学,安徽师范大学,安徽财经大学,安徽农业大学,安徽工业大学,安徽工程大学,安徽建筑大学,安徽理工大学,南昌大学,华东交通大学,江西财经大学,江西师范大学,南昌航空大学,江西理工大学,江西农业大学,山东大学,山东财经大学,山东农业大学,山东科技大学,青岛大学,中国海洋大学,山东师范大学,山东理工大学,河南大学,郑州大学,华中科技大学,武汉大学,华中师范大学,华中农业大学,武汉理工大学,中南财经政法大学,中南民族大学,长江大学[3],武汉科技大学,湖北工业大学,武汉工程大学,湖北大学,三峡大学,湖南大学,中南大学,湖南师范大学,湖南农业大学,中南林业科技大学,长沙理工大学,湘潭大学,南华大学,湖南科技大学,湖南中医药大学,中山大学,华南师范大学,汕头大学,广州中医药大学,华南理工大学,华南农业大学,南方医科大学,广东外语外贸大学,暨南大学,南方科技大学,广东工业大学,广州大学,深圳大学,广西大学,海南大学,西南大学,西南政法大学,重庆大学,重庆医科大学,重庆交通大学,重庆邮电大学,四川大学,四川农业大学,西南交通大学,电子科技大学,西南财经大学,西南石油大学,西南科技大学,成都理工大学,四川师范大学,成都信息工程大学,贵州大学,云南大学,昆明理工大学,西北工业大学,陕西科技大学,西北农林科技大学,西安交通大学,西安建筑科技大学,西安电子科技大学,西安外国语大学,陕西师范大学,西北大学,长安大学,西安工业大学,西安石油大学,西安理工大学,西安科技大学,兰州大学,青海大学,宁夏大学,新疆大学,石河子大学";
    //年龄小于
    defaultSetting.ageLessThan= "34";
    //学历
    defaultSetting.filterEducation = "本科,硕士";
    //不包含应届生
    defaultSetting.filterYingJie=true;
    //打招呼后自动滚动到下一个
    defaultSetting.autoScrollNext=false;
    //求职岗位
    defaultSetting.filterExpects="Java,架构师,技术经理,JavaScript,web前端,前端开发,HTML5";
    //求职意向不包含
    defaultSetting.filterWillNotIn="";
}

//学校名称
$("#input_sql_control").val(defaultSetting.filterUniversityName);
//年龄小于
$("#input_2_control").val(defaultSetting.ageLessThan);
//学历
$("#input_5_control").val(defaultSetting.filterEducation);
//不包含应届生
if(defaultSetting.filterYingJie){
    $("#input_3_control").attr("checked","checked");
}
else{
    $("#input_3_control").attr("checked",false);
}
//打招呼后自动滚动到下一个
if(defaultSetting.autoScrollNext){
    $("#input_6_control").attr("checked","checked");
}
else{
    $("#input_6_control").attr("checked",false);
}
//求职岗位
$("#input_4_control").val(defaultSetting.filterExpects);
//求职意向不包含
$("#input_7_control").val(defaultSetting.filterWillNotIn);

/**
 * 加载默认配置 结束
 */

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

//保存配置
const btnSC5=document.getElementById("search_btn5_control");
btnSC5.addEventListener('click', e=>{    
    try {
        if (window.localStorage) {
            //学校名称
            var strFilterUniversityName = $.trim($("#input_sql_control").val());
            defaultSetting.filterUniversityName=strFilterUniversityName;
            //年龄小于
            defaultSetting.ageLessThan= $.trim($("#input_2_control").val());
            //学历
            defaultSetting.filterEducation = $.trim($("#input_5_control").val());
            //不包含应届生
            var filterYingJie=false;
            if($("#input_3_control").prop("checked")){
                filterYingJie=true;
            }
            defaultSetting.filterYingJie=filterYingJie;
            //打招呼后自动滚动到下一个
            var autoScrollNext=false;
            if($("#input_6_control").prop("checked")){
                autoScrollNext=true;
            }
            defaultSetting.autoScrollNext=autoScrollNext;
            //求职岗位
            defaultSetting.filterExpects=$.trim($("#input_4_control").val());
            //求职意向不包含
            defaultSetting.filterWillNotIn=$.trim($("#input_7_control").val());

            var strOfMySetting=JSON.stringify(defaultSetting);
            if(strOfMySetting==null || strOfMySetting==""){
                printLogInfo("配置参数不能为空");
                return;
            }

            window.localStorage.setItem('mySetting',strOfMySetting);
            printLogInfo("保存配置成功！");
        }
    } catch (error) {
        printLogInfo("保存异常！请检查配置");
        console.error(error);
        return;
    }
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
            setTimeout(function(){
                return scrollLoadRecommendEnd();
            }, randomNum(2000,10000));
            return;
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

    }, randomNum(2000,10000));
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
    //求职意向
    var filterWillNotIn=[];
    var input_7_val=$.trim($("#input_7_control").val());
    if(input_7_val!=''){
        //如果是带换行符
        input_7_val=input_7_val.replace(/\n/g,",");
        filterWillNotIn=input_7_val.split(",");
        if(filterWillNotIn==null){
            filterWillNotIn=[];
        }
        filterWillNotIn=trimArray(filterWillNotIn);
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

        //过滤求职意向
        if(filterWillNotIn!=null && filterWillNotIn.length>0){
            if(item.jobStatus){
                var enableFilterWill=true;
                for(var j=0;j<filterWillNotIn.length;j++){
                    var itemFWN=filterWillNotIn[j];
                    if(item.jobStatus==itemFWN){
                        enableFilterWill=false;
                        break;
                    }
                }
                if(!enableFilterWill){
                    checkResult+="求职意向不符合条件。";
                }
            }
        }
        
        item.checkResult=checkResult;
        
        /**
         * 校验通过的处理
         */
        var $li=$($recommendLiList.get(item.domIndex));
        $li.find("div.geek-info-card").css("background-color","white");
        if(checkResult==""){
            recommendData.push(item);

            //标记li元素的背景颜色            
            if($li!=null){
                //如果未沟通比较橙色
                if(item.goutong=="未沟通"){
                    $li.find("div.geek-info-card").css("background-color","orange");
                }               
                else if(item.goutong=="已沟通"){
                    $li.find("div.geek-info-card").css("background-color","lightblue");
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

//跳转到下一个，currentIndex从0开始
function selectNext(currentIndex){
    showInfoOfOneByOne();
    if (recommendData == null || recommendData.length <= 0) {
        alert("请先筛选");
        return;
    }

    if(currentIndex!=null && currentIndex>=0 ){
        var nextIdx=currentIndex + 1;
        if(recommendData.length>nextIdx){
            currentItem = recommendData[nextIdx];
        }
        else{
            console.info("已经到最后了。currentIndex="+currentIndex);
            return;
        }
    }
    else{
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
        msg="第"+(recommendData.indexOf(data)+1)+"个："+data.realName;
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
                $li.find("div.geek-info-card").css("background-color", "lightblue");

                //打招呼后自动滚动到下一个
                if($("#input_6_control").prop("checked")){
                    var itemDataGeek=$li.find(".card-inner").first().attr("data-geek");
                    var currentIndex=null;
                    if(recommendData!=null && !$.isEmptyObject(itemDataGeek)){
                        $.each(recommendData, function(i, item){
                            // console.info("打招呼之后--循环查找："+i);
                            if(itemDataGeek == item.geek){
                                currentIndex=i;
                                return true;
                            }                    　  
                        });
                        selectNext(currentIndex);
                    }            
                }                    
            }
        },1000);
        
    }
    
}

/**
 * 生成指定范围内的随机整数
 */
function randomNum(minNum,maxNum){  
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1); 
        break;
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum); 
        break;
        default: 
            return 0; 
        break;    
    } 
} 