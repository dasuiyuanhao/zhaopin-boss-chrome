
//抓取页面的锚点
var $main = null;
var windowIframeName = "recommendFrame";

// var $document = $(window.frames[windowIframeName].document);
const panel = document.createElement('div');
panel.id = 'extend_panel'
panel.innerHTML = `
<div class="left">
    <div style="color:black;background-color: lightblue;cursor: pointer;" 
            title="伯乐2号是一款自动化工具，提高您的招聘效率，早点下班休息。请先在【关于】Tab栏注册软件。">
        <label style="padding-left: 10px;font-size:14px;font-weight: ">伯乐2号</label>
        <label style="float:right;padding-right:10px;font-weight: bold;" >?</label>
    </div>   

    <div class="dashboard-edit-box zUI-bar line md" id="tab1" style="line-height: 30px;padding: 0px 5px 0px 5px;">
            <div class="bar-box">
                <div class="nav nav_head" style="font-size: 14px;margin-left: 0px;line-height: 40px;">
                    推荐牛人
                </div>
                <div class="nav nav_head active" style="font-size: 14px;margin-left: 0px;line-height: 40px;">
                    沟通
                </div>
                <div class="nav nav_head" style="font-size: 14px;margin-left: 0px;line-height: 40px;">
                    关于
                </div>
            </div>
            <div class="content">
                <!--第一个Tab-->
                <div class="wrap">
                    <div style="line-height: 30px;height: 30px;margin-top:5px;">
                        <label class="form-label" style="line-height: 30px;">年龄</label>
                        <input id="input_ageGreatThanOrEqualTo_control" type="text" class="form-input" value="" style="width:30px;" />
                        -
                        <input id="input_ageLessThanOrEqualTo_control" type="text" class="form-input" value="" style="width:30px;" />
                
                        <label class="form-label" style="line-height: 30px;margin-left:10px;">学历</label>
                        <textarea class="form-input" id="input_5_control" style="width:100px; height: 30px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔"></textarea>
                        
                        
                        <button id="btn_save_filter"  style="min-width: 32px;width: 32px;height: 24px;line-height: 24px;font-size: 10px;margin-left: 10px;" class="form-btn" title="保存筛选条件">保存</button>
                        <button id="btn_reset_filter"  style="min-width: 32px;width: 32px;height: 24px;line-height: 24px;font-size: 10px;margin-left: 10px;background-color: orange;" class="form-btn" title="重置筛选条件">重置</button>
            
                        <a href="javascript:;" id="query_control_btn" class="query-control-btn" style="display:inline;margin-left:10px;margin-right:10px;float: right;">
                            <span class="query-control-btn-span " style="padding-right: 20px;">收起</span></a>
                    </div>  
            
                    <!--折叠部分开始-->
                    <div id="query_control" style="margin-top:5px;display:block;">
                        <div style="line-height: 30px;height: 30px;margin-top:5px;display:none;">
                            <input class="form-input" id="input_6_control" type="checkbox" style="height: 30px;width: 16px;line-height: 30px;margin: 0;padding: 0;margin-left:0px;" />
                            <label class="form-label" style="line-height: 30px;" for="input_6_control">打招呼后滚动到下一个</label>
                            
                            <label class="form-label" style="line-height: 30px;">模拟鼠标点击坐标
                            
                            X<input id="input_autoMouseEventX_control" type="text" class="form-input" value="" style="width:40px;" />
                            Y<input id="input_autoMouseEventY_control" type="text" class="form-input" value="" style="width:30px;" />
                            </label>                           
                                                
                        </div>  
                        
                        <div style="margin-top:5px;">     
                            <label class="form-label" style="line-height: 52px;">学校名称</label>
                            <textarea id="input_sql_control" class="form-input" style="width:320px; height: 52px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔"></textarea>
                        
                        </div>   
                        
                        <div style="line-height: 30px;height: 30px;margin-top:5px;">
                            <label class="form-label" style="line-height: 30px;">工龄</label>
                            <input id="input_jobAgeGreatThanOrEqualTo_control" type="text" class="form-input" value="" style="width:30px;" />
                            -
                            <input id="input_jobAgeLessThanOrEqualTo_control" type="text" class="form-input" value="" style="width:30px;" />
                            年
                            
                            <label class="form-label" style="line-height: 30px;margin-left:10px;">性别</label>
                            <select id="select_gender_control" class="form-input" style="font-size: 14px;width: 60px;">
                                <option value="">全部</option>
                                <option value="1">男</option>
                                <option value="2">女</option>
                            </select>
            
                            <input class="form-input" id="input_3_control" type="checkbox" style="height: 30px;width: 16px;line-height: 30px;margin: 0;padding: 0;" />
                            <label class="form-label" style="line-height: 30px;" for="input_3_control">不包含应届生</label>
                            
                            
                        </div>        
                        
                        <div style="line-height: 30px;margin-top:5px;">
                            <label class="form-label">求职岗位</label>
                            <textarea id="input_4_control" class="form-input" style="width:320px; height: 28px;"  placeholder="清空不做筛选，多个以英文逗号分隔，或者以换行分隔"></textarea>
                        </div>  
                        <div style="line-height: 30px;margin-top:5px;">
                            <label class="form-label">求职意向不包含</label>
                            <textarea id="input_7_control" class="form-input" style="width:278px; height: 28px;"  placeholder="例如：在职-暂不考虑。多个以英文逗号、换行分隔"></textarea>
                        </div>            
                        <div style="line-height: 30px;margin-top:5px;">
                            <label class="form-label">求职期望地点包含</label>
                            <textarea id="input_8_control" class="form-input" style="width:264px; height: 28px;"  placeholder="例如：北京,上海。多个以英文逗号、换行分隔"></textarea>
                        </div>   
                        <div style="line-height: 30px;margin-top:5px;">
                            <label class="form-label">牛人活跃状态包含</label>
                            <textarea id="input_9_control" class="form-input" style="width:264px; height: 28px;"  placeholder="例如：刚刚活跃。多个以英文逗号、换行分隔"></textarea>
                        </div> 
            
                    </div>
                    <!--折叠部分结束-->
                    
                    <div style="line-height: 30px;margin-top:5px;">
                        <button id="search_btn1_control"  style="width: 120px;height: 30px;margin-right:8px;background-color: orange;" class="form-btn" title="模拟滚动列表页面到底部">一键加载全部</button>
                        <button id="search_btn2_control"  style="width: 120px;height: 30px;;margin-right:8px;" class="form-btn">筛选全部(Shift+q)</button>
                        <button id="search_btn6_control"  style="width: 120px;height: 30px;background-color: orange;" 
                            class="form-btn" title="可以先点击一键加载全部按钮，配合使用更方便。如果自动触发点击按钮不准确，可以设置[模拟鼠标点击坐标]的X和Y值">筛选并自动打招呼</button>
                    </div>  
                    <div style="line-height: 30px;margin-top:5px;height: 30px;">
                        <button id="search_btn3_control"  style="width: 120px;height: 30px;margin-right:8px;" class="form-btn">上一个(Shift+a)</button>
                        <button id="search_btn4_control"  style="width: 120px;height: 30px;margin-right:8px;" class="form-btn">下一个(Shift+d)</button>
                        <span id="oneByOne_info_control" style="text-align: center;line-height: 30px;"></span>
                    </div>  


                </div>
                <!--第二个Tab-->
                <div class="wrap zUI-show" >

                    <div style="line-height: 30px;margin-top:5px;">
                        <input class="form-input" id="input_chat_send_next" type="checkbox" style="height: 30px;width: 16px;line-height: 30px;margin: 0;padding: 0;margin-left:0px;display:none;" />
                        <label class="form-label" style="line-height: 30px;display:none;" for="input_chat_send_next">发消息后滚动到下一个</label>

                        <label class="form-label" style="line-height: 30px;">自动发消息最大数量</label>
                        <input id="input_maxAutoSendMsgTimesOfChat" type="text" class="form-input" value="" style="width:40px;" />
            
                        <button id="btn_save_chat_setting"  style="min-width: 32px;width: 32px;height: 24px;line-height: 24px;font-size: 10px;margin-left: 10px;" class="form-btn" title="保存配置">保存</button>
                        <button id="btn_reset_chat_setting"  style="min-width: 32px;width: 32px;height: 24px;line-height: 24px;font-size: 10px;margin-left: 10px;background-color: orange;" class="form-btn" title="重置配置">重置</button>

            
                    </div>  
                    <div style="line-height: 30px;margin-top:5px;">
                        <label class="form-label" style="line-height: 30px;">消息状态</label>
                        <select id="select_msgStatusOfAutoSendMsg" class="form-input" style="width: 80px;">                            
                            <option value="1">[已读]</option>
                            <option value="2">[送达]</option>
                            <option value="3">[盼回复]</option>                         
                            <option value="">全部</option>
                        </select>

                        <label class="form-label" style="line-height: 30px;margin-left:10px;">时间范围</label>
                        <select id="select_timeRangeOfAutoSendMsg" class="form-input" style="width: 80px;">
                            <option value="">全部</option>
                            <option value="1">1天内</option>
                            <option value="2">2天内</option>
                            <option value="3">3天内</option>
                            <option value="4">1周内</option>
                            <option value="5">1月内</option>
                        </select>
                    </div>                    
                    
                    <div style="line-height: 30px;margin-top:5px;">
                        <label class="form-label">消息内容</label>
                        <textarea id="input_chat_send_msg" class="form-input" style="width:320px; height: 48px;"  placeholder="请在这儿填写自动发消息的内容"></textarea>
                    </div>
                    <div style="line-height: 30px;margin-top:5px;height: 30px;">
                        <button id="btn_chat_load_all"  style="width: 120px;height: 30px;margin-right:8px;background-color: orange;display:none;" 
                            class="form-btn" title="一键滚动加载沟通列表">一键加载全部</button>
                        <button id="btn_chat_query_yidu"  style="width: 120px;height: 30px;margin-right:8px;" 
                            class="form-btn">筛选(Shift+w)</button>
                        <button id="btn_chat_autoSendMsgForRead"  style="width: 120px;height: 30px;margin-right:8px;background-color: orange;" 
                            class="form-btn" title="筛选已读用户，进行自动发送消息">一键自动发消息</button>
                    </div>
                    <div style="line-height: 30px;margin-top:5px;height: 30px;">
                        <button id="btn_chat_prev"  style="width: 120px;height: 30px;margin-right:8px;" class="form-btn">上一个(Shift+q)</button>
                        <button id="btn_chat_next"  style="width: 120px;height: 30px;margin-right:8px;" class="form-btn">下一个(Shift+e)</button>
                        <span id="chat_oneByOne_info_control" style="text-align: center;line-height: 30px;"></span>
                    </div>              
                    
                </div>

                <!--第三个Tab-->
                <div class="wrap" >
                    
                    <div style="line-height: 30px;margin-top:5px;">
                        <label class="form-label" style="line-height: 30px;">版本号：V2.0.0</label>
            
                    </div>  

                    <div id="div_miyao_control" style="line-height: 30px;margin-top:5px;">
                        <span>招聘自动化工具，提高您的招聘效率，早点下班休息。</span>
                        </br>
                        <span>声明：仅供学习参考，如果出现经济损失概不负责，请勿用于商业行为！</span>
                        </br>
                    </div>  
                
                              
                    
                </div>
            </div>


            <div id="result_view" style="width:420px; height: 100px;overflow-y: auto;">
                &nbsp;
            </div>

        </div>
    
        
</div>
`

document.body.appendChild(panel);
// var $wrap=$("iframe[name='recommendFrame']").contents().find("#wrap");
// $wrap.append(panel);



//当前视图
var current_view = 'dashboards';

const btn1TextDefault = "一键加载全部";
const btn1TextStop = "停止加载全部";

//查询结果
var excuteResultFailedIds = [];
//是否执行中
var isExcuting = false;
var maxExcuteNum = 5000;

//全部li元素
var $recommendLiList = [];
//符合条件的数据集合
var recommendData = [];
//当前数据
var currentItem = null;


init().then(apps => {
    var current_app = null;
    //渲染按钮的视图
    const render_view_buttons = (() => {
        var vnode = panel.querySelector('.views');
        const render_fn = shown => {
            return patch(vnode, h('div.views', {
                style: {
                    visibility: shown ? 'visible' : 'hidden'
                }
            }, [
                h('a.button', {
                    class: {
                        active: current_view == 'dashboards'
                    }, on: {
                        click: () => {
                            if (current_view == 'dashboards') return;
                            current_view = 'dashboards';
                            vnode = render_fn();
                            refresh_apps_div();
                            refresh_view();
                        }
                    }
                }, '仪表盘')
            ]));
        }
        return shown => vnode = render_fn(shown);
    })();

    //渲染视图
    const refresh_view = (() => {
        var metrics_buttons_vnode = panel.querySelector('.metrics-buttons');

        return function (switch_view) {
            if (current_view == 'dashboards') {
                return render_all_dashboards().then(() => {
                    render_view_buttons(true)
                    metrics_buttons_vnode = patch(metrics_buttons_vnode, h('div.metrics-buttons'));
                });

            }
        };
    })();

    refresh_view();

})

/*****Tab框  开始******/

zUI.tab.loadTab({
    elem: '.zUI-bar',
    clicks: [
        function (index, nav, wrap) {
            console.log(nav);
        },
        function (index, nav, wrap) {
            console.log(nav);
        },
        function (index, nav, wrap) {
            console.log(nav);
        }
    ]
});

/*****Tab框  结束******/


const btn = document.createElement('div');
btn.id = 'extend_toggle_button'
btn.innerText = '隐藏'
document.body.appendChild(btn);
btn.addEventListener('click', e => {
    if (panel.style.display == 'none') {
        panel.style.display = 'block'
        btn.innerText = '隐藏'
    } else {
        panel.style.display = 'none'
        btn.innerText = '控制台'
    }
});

//去除重复
function removeRepeatData(arr) {
    if (arr == null || arr.len() < 1) {
        return arr;
    }
    var new_arr = [];
    for (var i = 0; i < arr.length; i++) {
        var items = arr[i];
        //判断元素是否存在于new_arr中，如果不存在则插入到new_arr的最后
        if ($.inArray(items, new_arr) == -1) {
            new_arr.push(items);
        }
    }
}


/**滚动加载全部 */
var isExcutingScollLoad = false;
var tryScrollLoadFailedTimes = 0;
var scollLoadEndItem = null;
var scollLoadTimes = 0;
//最多加载次数
var maxLoadTimes = 200;
function scollLoadAll() {
    if(!event.isTrusted){
        console.warn("非可信操作");
        return;
    }

    var $search_btn1_control = $("#search_btn1_control");
    if (isExcutingScollLoad) {
        //如果已经在执行，则停止
        isExcutingScollLoad = false;
        $search_btn1_control.text(btn1TextDefault);
        return;
    }
    $search_btn1_control.text(btn1TextStop);
    

    isExcutingScollLoad = true;
    tryScrollLoadFailedTimes = 0;
    scollLoadEndItem = null;
    scollLoadTimes = 0;
    var $result_view = $("#result_view");

    //开始滚动加载
    var rText = "开始滚动加载简历.....";
    printLogInfo(rText, true);
    scrollLoadRecommendEnd();
}

function stopScrollLoadRecommend() {
    isExcutingScollLoad = false;
    printLogInfo("结束滚动加载简历.....");
    var $search_btn1_control = $("#search_btn1_control");
    $search_btn1_control.text(btn1TextDefault);

}

//打印结果
function printLogInfo(rText, isClear) {
    rText = currentDateTimeByFormatForMMDDHHmmss() + " " + rText;
    console.info(rText);
    var $result_view = $("#result_view");
    if (isClear) {
        $result_view.html("");
    }
    if ($result_view.children().length > 0) {
        $result_view.prepend("<p>" + rText + "</p>");
    }
    else {
        $result_view.prepend("<p>" + rText + "</p>");
    }
}

function scrollLoadRecommendEnd() {
    var result = 0;
    if (!isExcutingScollLoad || tryScrollLoadFailedTimes >= 3
        || scollLoadTimes >= maxLoadTimes) {
        stopScrollLoadRecommend();
        return result;
    }

    var logMsgPart = "滚动加载简历";

    //找到最下面的元素
    try {
        $document = $(window.frames[windowIframeName].document);
        var $recommend_card_list_li = $document.find("#main").find("ul.recommend-card-list").children("li");
        var rText = logMsgPart + ",全部简历" + $recommend_card_list_li.length + "个 ";
        printLogInfo(rText);

        if ($recommend_card_list_li == null || $recommend_card_list_li.length < 1) {
            printLogInfo(logMsgPart + ",没有抓到页面数据，请重试!");
            stopScrollLoadRecommend();
            return result;
        }

        var $noMoreSpan = $document.find("div.loadmore").children("span");
        if ($noMoreSpan != null && $noMoreSpan.length > 0) {
            if ($noMoreSpan.text == "没有更多了") {
                printLogInfo(logMsgPart + ",没有更多了");
                stopScrollLoadRecommend();
                return result;
            }
        }

        var $thisTimeLastLi = $($recommend_card_list_li[$recommend_card_list_li.length - 1]);

        var thisTimeLast = $thisTimeLastLi.find(".card-inner").first().attr("data-geek");

        if (thisTimeLast == scollLoadEndItem) {
            tryScrollLoadFailedTimes++;
            setTimeout(function () {
                return scrollLoadRecommendEnd();
            }, randomNum(2000, 10000));
            return;
        }

        scollLoadEndItem = thisTimeLast;

        if ($thisTimeLastLi != null && $thisTimeLastLi.length > 0) {
            var scrollTop = $thisTimeLastLi.offset().top;
            var $iframe_syncFrame = $(window.frames[windowIframeName]);
            $iframe_syncFrame.scrollTop(scrollTop - 200);
        }
    } catch (error) {
        printLogInfo(logMsgPart + ",异常:");
        console.error(error);
        stopScrollLoadRecommend();
        return result;
    }

    result++;
    scollLoadTimes += result;
    printLogInfo(logMsgPart + ",加载第" + scollLoadTimes + "次成功");
    setTimeout(function () {
        return scrollLoadRecommendEnd();

    }, randomNum(2000, 10000));
}

function doThings() {
    if(!event.isTrusted){
        console.warn("非可信操作");
        return;
    }

    if (isExcuting) {
        alert("正在玩命处理中，请稍候...");
        return;
    }

    var universityNames = [];
    excuteResultFailedIds = [];
    recommendData = [];
    currentItem = null;

    var $result_view = $("#result_view");
    // $result_view.text("正在玩命处理中，请等候...");
    //学校名称
    var inputSql = $.trim($("#input_sql_control").val());
    if (inputSql != '') {
        //如果是带换行符
        inputSql = inputSql.replace(/\n/g, ",");
        universityNames = inputSql.split(",");
    }
    if (universityNames != null) {
        if (universityNames.length > maxExcuteNum) {
            $result_view.text("输入参数不能为超过" + maxExcuteNum + "条");
            return;
        }
    }

    //年龄
    var ageGreatThanOrEqualTo = null;
    var ageVal1 = $.trim($("#input_ageGreatThanOrEqualTo_control").val());
    if (ageVal1 != "") {
        var reg = /[1-9]+\d*/;
        if (!reg.test(ageVal1)) {
            $result_view.text("输入年龄必须为正整数");
            return;
        }
        ageGreatThanOrEqualTo = parseInt(ageVal1);
    }
    var ageLessThanOrEqualTo = null;
    var ageVal2 = $.trim($("#input_ageLessThanOrEqualTo_control").val());
    if (ageVal2 != "") {
        var reg = /[1-9]+\d*/;
        if (!reg.test(ageVal2)) {
            $result_view.text("输入年龄必须为正整数");
            return;
        }
        ageLessThanOrEqualTo = parseInt(ageVal2);
    }
    //过滤应届毕业生
    var filterYingJie = false;
    if ($("#input_3_control").prop("checked")) {
        filterYingJie = true;
    }

    //年龄
    var jobAgeGreatThanOrEqualTo = null;
    var jobAgeVal1 = $.trim($("#input_jobAgeGreatThanOrEqualTo_control").val());
    if (jobAgeVal1 != "") {
        var reg = /[1-9]+\d*/;
        if (!reg.test(jobAgeVal1)) {
            $result_view.text("输入工作年龄必须为正整数");
            return;
        }
        jobAgeGreatThanOrEqualTo = parseInt(jobAgeVal1);
    }
    var jobAgeLessThanOrEqualTo = null;
    var jobAgeVal2 = $.trim($("#input_jobAgeLessThanOrEqualTo_control").val());
    if (jobAgeVal2 != "") {
        var reg = /[1-9]+\d*/;
        if (!reg.test(jobAgeVal2)) {
            $result_view.text("输入工作年龄必须为正整数");
            return;
        }
        jobAgeLessThanOrEqualTo = parseInt(jobAgeVal2);
    }

    //过滤性别
    var filterGender = $("#select_gender_control").val();

    //求职岗位
    var filterExpects = [];
    var input_4_val = $.trim($("#input_4_control").val());
    if (input_4_val != '') {
        //如果是带换行符
        input_4_val = input_4_val.replace(/\n/g, ",");
        filterExpects = input_4_val.split(",");
        if (filterExpects == null) {
            filterExpects = [];
        }
        filterExpects = trimArray(filterExpects);
    }
    //学历
    var filterEducations = [];
    var input_5_val = $.trim($("#input_5_control").val());
    if (input_5_val != '') {
        //如果是带换行符
        input_5_val = input_5_val.replace(/\n/g, ",");
        filterEducations = input_5_val.split(",");
        if (filterEducations == null) {
            filterEducations = [];
        }
        filterEducations = trimArray(filterEducations);
    }
    //求职意向
    var filterWillNotIn = [];
    var input_7_val = $.trim($("#input_7_control").val());
    if (input_7_val != '') {
        //如果是带换行符
        input_7_val = input_7_val.replace(/\n/g, ",");
        filterWillNotIn = input_7_val.split(",");
        if (filterWillNotIn == null) {
            filterWillNotIn = [];
        }
        filterWillNotIn = trimArray(filterWillNotIn);
    }

    //求职期望地点
    var filterExpectPlace = [];
    var input_8_val = $.trim($("#input_8_control").val());
    if (input_8_val != '') {
        //如果是带换行符
        input_8_val = input_8_val.replace(/\n/g, ",");
        filterExpectPlace = input_8_val.split(",");
        if (filterExpectPlace == null) {
            filterExpectPlace = [];
        }
        filterExpectPlace = trimArray(filterExpectPlace);
    }

    //牛人活跃状态包含
    var filterActiveStatus = [];
    var input_9_val = $.trim($("#input_9_control").val());
    if (input_9_val != '') {
        //如果是带换行符
        input_9_val = input_9_val.replace(/\n/g, ",");
        filterActiveStatus = input_9_val.split(",");
        if (filterActiveStatus == null) {
            filterActiveStatus = [];
        }
        filterActiveStatus = trimArray(filterActiveStatus);
    }

    // isExcuting=true;

    //找到简历列表
    // $main=$("#main").find("iframe").first();
    $main = $(window.frames[windowIframeName].document).find("#main");

    // var $recommend_card_list= $main.find("ul.recommend-card-list");  //$("ul.recommend-card-list");
    var $recommend_card_list = $main.find("ul.recommend-card-list");
    console.info("简历列表:" + $recommend_card_list.length);
    if ($recommend_card_list == null || $recommend_card_list.length < 1) {
        alert("没有抓到页面数据，请重试!");
        isExcuting = false;
        return;
    }

    $recommendLiList = $recommend_card_list.children("li").has("div.geek-info-card");
    var rText = "全部简历" + $recommendLiList.length + "个 ";
    console.info(rText);

    var collectData = [];
    for (var i = 0; i < $recommendLiList.length; i++) {
        var $li = $($recommendLiList[i]);
        var item = {
            "domIndex": i,
            "eduExpList": [],//教育经历
        };
        //标识
        item.geek = $li.find(".card-inner").first().attr("data-geek");

        //沟通情况
        item.goutong = "";
        var $btn_doc = $li.find("span.btn-doc").children("button");
        if ($btn_doc != null && $btn_doc.length > 0) {
            if ($btn_doc.hasClass("btn-continue")) {
                item.goutong = "已沟通";
            }
            else if ($btn_doc.hasClass("btn-greet")) {
                item.goutong = "未沟通";
            }
            else {
                item.goutong = "";
            }
        }

        //姓名
        var $avatarBox = $li.find("div.avatar-box");
        item.realName = $avatarBox.find("img").first().attr("alt");

        //牛人活跃状态
        var $niuRenActiveStatus = $li.find("div.candidate-list-content").find("span.label-text");
        item.activeStatus = "";
        if ($niuRenActiveStatus != null && $niuRenActiveStatus.length > 0) {
            item.activeStatus = $niuRenActiveStatus.text();
        }

        //性别。0为未知，1为男，2为女。
        //class="iboss-icon_man" class="iboss-icon_women"
        item.gender = "0";
        if ($avatarBox.find("i.iboss-icon_man").length > 0) {
            item.gender = "1";
        }
        else if ($avatarBox.find("i.iboss-icon_women").length > 0) {
            item.gender = "2";
        }

        //年龄、工作年限、学历、就职状态
        var $info_labels = $li.find("div.info-labels").first().find("span.label-text");
        if ($info_labels) {
            $info_labels.each(function (index, element) {
                var $e = $(element);
                if (index == 0) {
                    item.age = null;
                    var age = $.trim($e.text()).replace("岁", "");
                    if ($.isNumeric(age)) {
                        item.age = parseInt(age);
                    }
                } else if (index == 1) {
                    item.jobAge = $.trim($e.text());
                } else if (index == 2) {
                    item.education = $.trim($e.text());
                } else if (index == 3) {
                    item.jobStatus = $.trim($e.text());
                }
            });
        }


        //教育经历
        var $edu_exp_li_list = $li.find("ul.edu-exp-box").children("li");
        if ($edu_exp_li_list && $edu_exp_li_list.length > 0) {
            $edu_exp_li_list.each(function (index, element) {
                var $e = $(element);
                var $span = $e.children("span");
                if ($span) {
                    var eduExpItem = { "index": index };
                    if ($span.length > 0) {
                        eduExpItem.year = $span.first().text();
                    }
                    if ($span.length > 1) {
                        var eduContent = $.trim($($span[1]).text());
                        if (eduContent) {
                            var splitEdu = eduContent.split("·");
                            if (splitEdu && splitEdu.length > 0) {
                                eduExpItem.universityName = $.trim(splitEdu[0]);
                                if (splitEdu.length > 1) {
                                    //专业
                                    eduExpItem.eduMajor = $.trim(splitEdu[1]);
                                }
                                if (splitEdu.length > 2) {
                                    eduExpItem.eduDegree = $.trim(splitEdu[2]);
                                }
                            }
                        }

                    }
                    item.eduExpList.push(eduExpItem);
                }
            });
        }

        //求职期望
        item.expect = null;
        var $expectSpans = $li.find("div.expect-box").children("span");
        if ($expectSpans && $expectSpans.length > 1) {
            var expectContent = $.trim($($expectSpans.get(1)).text());
            var expectArr = expectContent.split("·");
            if (expectArr && expectArr.length > 1) {
                //有的是两级地址，例如：福州·福清市
                if(expectArr.length>2){
                    item.expectPlace = $.trim(expectArr[1]);
                    item.expect = $.trim(expectArr[2]);
                }
                else{
                    item.expectPlace = $.trim(expectArr[0]);
                    item.expect = $.trim(expectArr[1]);
                }
                
            }
        }

        collectData.push(item);
    }

    isExcuting = false;

    //筛选符合条件的数据
    for (var i = 0; i < collectData.length; i++) {
        var item = collectData[i];
        if (item == null || item.geek == null) {
            alert("已抓取的数据异常！");
            return;
        }

        var checkResult = "";
        //过滤学校名称
        if (item.eduExpList && item.eduExpList.length > 0
            && universityNames.length > 0) {
            var eduFilter = false;
            for (var j = 0; j < item.eduExpList.length; j++) {
                var eduItem = item.eduExpList[j];
                //符合学校条件
                if (checkStringOfLike(eduItem.universityName, universityNames)) {
                    eduFilter = true;
                    break;
                }
            }
            if (!eduFilter) {
                checkResult += "学校名称不符合条件。";
            }
        }
        //判断年龄
        if (ageGreatThanOrEqualTo != null && item.age != null) {
            if (ageGreatThanOrEqualTo > item.age) {
                checkResult += "年龄太小不符合条件。";
            }
        }
        if (ageLessThanOrEqualTo != null && item.age != null) {
            if (ageLessThanOrEqualTo < item.age) {
                checkResult += "年龄太大不符合条件。";
            }
        }

        //过滤应届生
        if (filterYingJie && item.jobAge.indexOf("应届生") >= 0) {
            checkResult += "应届生不符合条件。";
        }

        //判断工龄
        var jobAge=null;
        try {
            if(item.jobAge!=null){
                let arrJA=item.jobAge.split("年");
                if(arrJA!=null && arrJA.length>0){
                    jobAge=parseInt(arrJA[0]);
                }
            }       
        } catch (error) {
            console.error("截取年龄异常:"+JSON.stringify(item),error);
        }
         
        if (jobAgeGreatThanOrEqualTo != null && jobAge) {
            if (jobAgeGreatThanOrEqualTo > jobAge) {
                checkResult += "工龄太小不符合条件。";
            }
        }
        if (jobAgeLessThanOrEqualTo != null && jobAge != null) {
            if (jobAgeLessThanOrEqualTo < jobAge) {
                checkResult += "工龄太大不符合条件。";
            }
        }

        //过滤性别
        if (filterGender != null && filterGender != ""
            && item.gender != filterGender) {
            checkResult += "性别不符合条件。";
        }

        //过滤求职期望
        if (item.expect != null && item.expect != ""
            && filterExpects != null && filterExpects.length > 0) {
            if (!checkStringOfLike(item.expect, filterExpects)) {
                checkResult += "求职职位不符合条件。";
            }
        }
        //过滤学历
        if (filterEducations != null && filterEducations.length > 0) {
            if (item.eduExpList && item.eduExpList.length > 0) {
                var eduFilter = true;
                for (var j = 0; j < item.eduExpList.length; j++) {
                    var eduItem = item.eduExpList[j];
                    //符合条件,只要有一个学历不在学历要求中则不满足，例如专升本不满足
                    if (!checkStringOfLike(eduItem.eduDegree, filterEducations)) {
                        eduFilter = false;
                        break;
                    }
                }
                if (!eduFilter) {
                    checkResult += "学历不符合条件。";
                }
            }
        }

        //过滤求职意向
        if (filterWillNotIn != null && filterWillNotIn.length > 0) {
            if (item.jobStatus) {
                var enableFilterWill = true;
                for (var j = 0; j < filterWillNotIn.length; j++) {
                    var itemFWN = filterWillNotIn[j];
                    if (item.jobStatus == itemFWN) {
                        enableFilterWill = false;
                        break;
                    }
                }
                if (!enableFilterWill) {
                    checkResult += "求职意向不符合条件。";
                }
            }
        }

        //过滤求职期望地点
        if (item.expectPlace != null && item.expectPlace != ""
            && filterExpectPlace != null && filterExpectPlace.length > 0) {
            if (!checkStringOfLike(item.expectPlace, filterExpectPlace)) {
                checkResult += "求职期望地点不符合条件。";
            }
        }

        //过滤牛人活跃状态
        if (item.activeStatus != null && item.activeStatus != ""
            && filterActiveStatus != null && filterActiveStatus.length > 0) {
            if (!checkStringOfLike(item.activeStatus, filterActiveStatus)) {
                checkResult += "求职期望地点不符合条件。";
            }
        }


        item.checkResult = checkResult;

        /**
         * 校验通过的处理
         */
        var $li = $($recommendLiList.get(item.domIndex));
        $li.find("div.geek-info-card").css("background-color", "white");
        if (checkResult == "") {
            recommendData.push(item);

            //标记li元素的背景颜色            
            if ($li != null) {
                //如果未沟通比较橙色
                if (item.goutong == "未沟通") {
                    $li.find("div.geek-info-card").css("background-color", "orange");
                }
                else if (item.goutong == "已沟通") {
                    $li.find("div.geek-info-card").css("background-color", "lightblue");
                }
            }

            // //点击按钮，绑定事件
            var $btn_doc = $li.find("span.btn-doc").children("button");
            $btn_doc.unbind("click",btnCommunicateRefresh);
            $btn_doc.bind("click",btnCommunicateRefresh);
        }
        else{
            if($li!=null){
                
            }
        }
    }


    rText += "，共" + recommendData.length + "个符合条件。";
    if (recommendData.length > 0) {
        console.log(rText+JSON.stringify(recommendData));
    }
    
    $result_view.text(rText);

    //如果有筛选结果，则跳转到第一个
    if (recommendData.length > 0) {
        selectNext();
    }

}

/**
 * 判断是否包含字符串
 */
function checkStringOfLike(str, arr) {
    var result = false;
    if (!arr || arr.length < 1) {
        return result;
    }
    if (str == null) {
        return result;
    }

    $.each(arr, function (index, item) {
        if (str.indexOf(item) >= 0) {
            result = true;
            return true;
        }
    });

    return result;
}

//跳转到下一个，currentIndex从0开始
function selectNext(currentIndex) {
    showInfoOfOneByOne();
    if (recommendData == null || recommendData.length <= 0) {
        alert("请先筛选");
        return;
    }

    if (currentIndex != null && currentIndex >= 0) {
        var nextIdx = currentIndex + 1;
        if (recommendData.length > nextIdx) {
            currentItem = recommendData[nextIdx];
        }
        else {
            console.info("已经到最后了。currentIndex=" + currentIndex);
            return;
        }
    }
    else {
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
            else {
                currentItem = recommendData[idx + 1];
            }
        }
        else {
            currentItem = recommendData[0];
        }
    }

    console.info("找到了下一个:" + JSON.stringify(currentItem));
    //滚动到这儿
    scrollTo($recommendLiList[currentItem.domIndex]);
    showInfoOfOneByOne(currentItem);
}


function selectPrev() {
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
        if (idx == 0) {
            //已经到第一个了，从倒数第一开始
            // alert("已经到第一个了");
            currentItem = recommendData[recommendData.length - 1];
        }
        else {
            currentItem = recommendData[idx - 1];
        }
    }
    else {
        // alert("没有上一个");
        //没有上一个，从倒数第一开始
        currentItem = recommendData[recommendData.length - 1];
    }

    console.info("找到了上一个:" + JSON.stringify(currentItem));
    //滚动到这儿
    scrollTo($recommendLiList[currentItem.domIndex]);
    showInfoOfOneByOne(currentItem);
}

function showInfoOfOneByOne(data) {
    var msg = "";
    if (data != null) {
        msg = "第" + (recommendData.indexOf(data) + 1) + "个：" + data.realName;
    }

    var $span_oneByOne = $("#oneByOne_info_control");
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
                var scrollTop = $e.offset().top;
                $iframe_syncFrame.scrollTop(scrollTop - 200);
            }
        }
    } catch (error) {
        console.error(error);
        alert("滚动到指定位置,异常了");
    }
}

//数组去除空
function trimArray(data) {
    if (data == null || data.length < 1) {
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
function btnCommunicateRefresh(e) {
    var $btn_doc = $(this);
    refreshBtnCommunicateBackground($btn_doc);

    // //打招呼后自动滚动到下一个
    // if ($("#input_6_control").prop("checked")) {
    //     var itemDataGeek = $li.find(".card-inner").first().attr("data-geek");
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
    // }
}

//刷新背景颜色
function refreshBtnCommunicateBackground($btn_doc){
    if ($btn_doc != null && $btn_doc.length > 0) {
        var $li = $btn_doc.parents("li");
        // // 直接置为淡蓝色
        // $li.css("background-color","lightblue");    

        setTimeout(function () {
            if ($btn_doc.hasClass("btn-continue")) {
                $li.find("div.geek-info-card").css("background-color", "lightblue");
            } else if($btn_doc.hasClass("btn-greet")){
                $li.find("div.geek-info-card").css("background-color", "orange");
            }
            else{
                $li.find("div.geek-info-card").css("background-color", "white");
            }
        }, 500);

    }
}

/**
 * 生成指定范围内的随机整数
 */
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum);
            break;
        default:
            return 0;
            break;
    }
}


/********做下测试 */
var pressed = false;
var cx, cy;
var n = 0;
var nowDownEvent, nowUpEvent;
window.addEventListener('click', onClickEvent);
document.addEventListener('mousemove', mouseMove)

function mouseMove(e) {
    cx = e.clientX;
    cy = e.clientY;
}
function onClickEvent(e) { n++; console.log(e, n); }