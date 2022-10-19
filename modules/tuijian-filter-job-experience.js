/*!
* Author: dasuiyuanhao
* Date: 2022-10-19
*/

/**
 * 筛选工作经历
 * 获取工作内容，如果未获取到，则按照满足筛选条件处理
 * 注意:内容是数组
 * 注意会自动点击查看详细信息
 */
async function autoFilterJobExperienceOfJobContent(checkResult,data,filterWorkExpJobContentLike) {
    try{
        return await filterJobExperienceOfJobContent(checkResult,data,filterWorkExpJobContentLike);
    }catch(e){
        console.error("筛选工作经历-工作内容异常，",e)
        printLogInfo("筛选工作经历-工作内容异常，已忽略并继续执行")
        closeDialogOfNiuRen()
        return ""
    }         
}


async function filterJobExperienceOfJobContent(checkResult,data,filterWorkExpJobContentLike) {
    if(checkResult==null){
        checkResult="";
    }   

    //只有填写了工作内容才做筛选，防止浪费点击次数
    if(filterWorkExpJobContentLike==null || filterWorkExpJobContentLike.length<1){
        return checkResult;
    }

    if(filterWorkExpJobContentLike==null){
        filterWorkExpJobContentLike=[]
    }
   
    let $li = $($recommendLiList.get(data.domIndex));
    if($li==null && $li.length<1){
        return checkResult;
    }
    //点击该行，等待3秒
    $li.find("div.col-2").click();
    let out = await sleep(3);

    //获取工作经历，数组
    let $dialogBody = $main.find("div.dialog-body")
    if($dialogBody==null || $dialogBody.length<1){
        printLogInfo("未获取到工作经历信息")
        closeDialogOfNiuRen();

        //关闭权益已用尽弹框
        closeDialogOfNonRights();

        return checkResult
    }
    let $h3List=$dialogBody.find("h3.title")
    if($h3List==null || $h3List.length<1){
        printLogInfo("未获取到工作经历信息")
        closeDialogOfNiuRen();
        return checkResult
    }
    let $h3=null;
    for(let i=0;i<$h3List.length;i++){
        let $item=$($h3List[i]);
        if($item!=null){
            if($.trim($item.text())=="工作经历"){
                $h3=$item
                break;
            }
        }
    }
    if($h3==null || $h3.length<1){
        printLogInfo("未获取到工作经历信息")
        closeDialogOfNiuRen();
        return checkResult
    }
    let $historyItems=$h3.parent().find("div.history-list").children("div.history-item")
    if($historyItems==null || $historyItems.length<1){
        printLogInfo("未获取到工作经历信息")
        closeDialogOfNiuRen();
        return checkResult
    }

    let historyDatas=[]
    
    for(let i=0;i<$historyItems.length;i++){
        let $item=$($historyItems[i]);
        if($item==null){
            continue;
        }
        var jobItem={"realName":data.realName};
        
        jobItem.jobName=$.trim($item.children("h4.name").text());
        jobItem.jobContent=$.trim($item.children("div.item-text").text());        
        historyDatas.push(jobItem);
        //只收集最近3份工作
        if(historyDatas.length>2){
            break;
        }
    }
    //历史工作记录
    data.workHistoryList=historyDatas;
    console.info("工作经历信息，"+data.realName+"："+JSON.stringify(historyDatas))

    //遍历数据，分别判断筛选条件，只要有一个符合筛选条件，则跳出循环，返回成功
    
    let r_filterWorkExpJobContentLike=false;
   

    for(let i=0;i<historyDatas.length;i++){
        let item=historyDatas[i];


        if(item.jobContent!=null && filterWorkExpJobContentLike.length>0
            && !r_filterWorkExpJobContentLike){
            if (checkStringOfLike(item.jobContent, filterWorkExpJobContentLike)) {
                r_filterWorkExpJobContentLike = true;
                break;
            }
        }
    }
    
    if(filterWorkExpJobContentLike!=null && filterWorkExpJobContentLike.length>0 && !r_filterWorkExpJobContentLike){
        let cr=" 工作内容不满足，"+data.realName+"。";
        checkResult+=cr;
        printLogInfo(cr)
    }
    
    closeDialogOfNiuRen();
    return checkResult;
}

function closeDialogOfNiuRen(){
    let $d = $main.find("div.dialog-header")
    if($d!=null && $d.length>0){
        let $close = $d.find("span.resume-custom-close")
        if($close!=null && $close.length>0){
            $close.click();
        }
    }
}

/**
 * 过滤工作经历
 * 工作岗位、工作时间、公司名称
 */
function filterJobExperience(checkResult,data,filterWorkExp,filterWorkExpUnitNameLike,filterWorkExpTimeGreatThanOrEqualTo) {
    if(checkResult==null){
        checkResult="";
    }
    //如果没有填写筛选条件，则直接返回成功
    if((filterWorkExp==null || filterWorkExp.length<1)
        && (filterWorkExpUnitNameLike==null || filterWorkExpUnitNameLike.length<1)
        && (filterWorkExpTimeGreatThanOrEqualTo==null || filterWorkExpTimeGreatThanOrEqualTo<0)){
        return checkResult;
    }
    if(data.workExpList==null || data.workExpList<1){
        checkResult+="工作经历为空。"
        return checkResult;
    }
    
    if(filterWorkExpUnitNameLike==null){
        filterWorkExpUnitNameLike=[]
    }
    if(filterWorkExp==null){
        filterWorkExp=[]
    }

    //过滤经历岗位
    if (filterWorkExp.length > 0) {
        let resultOfWorkExp = false;
        for (let j = 0; j < data.workExpList.length; j++) {
            let itemWorkExp = data.workExpList[j];
            //只要有一段经历做过，则符合条件
            if (checkStringOfLike(itemWorkExp.name, filterWorkExp)) {
                resultOfWorkExp = true;
                break;
            }
        }
        if (!resultOfWorkExp) {
            checkResult += "经历岗位不符合条件。";
            return checkResult;
        }
    }
    
    if (filterWorkExpUnitNameLike.length > 0) {
        let r_filterWorkExpUnitNameLike=false;
        for (let j = 0; j < data.workExpList.length; j++) {
            let itemWorkExp = data.workExpList[j];
            //只要有一段经历满足，则符合条件
            if (checkStringOfLike(itemWorkExp.company, filterWorkExpUnitNameLike)) {
                r_filterWorkExpUnitNameLike = true;
                break;
            }
        }
        if (!r_filterWorkExpUnitNameLike) {
            checkResult += "经历单位名称不符合条件。";
            return checkResult;
        }
    }


    //工作经历时长按照平均值计算  
    //2019.12 - 至今
    if(filterWorkExpTimeGreatThanOrEqualTo!=null && filterWorkExpTimeGreatThanOrEqualTo>=0){
        try{
            let r_filterWorkExpTimeGreatThanOrEqualTo=false;   
            let totalDiffMonth=0;
            let calcDiffMonthCount=0;
            
            for (let j = 0; j < data.workExpList.length; j++) {
                //只统计最近3个工作经历
                if(j>2){
                    break;
                }

                let jobItem = data.workExpList[j];
                
                let timeArr=jobItem.date.split("-")
                timeArr=trimArray(timeArr);
                if(timeArr!=null || timeArr.length>1){
                    let startDate=timeArr[0]
                    startDate=startDate.replaceAll("\.","-")
                    if(startDate!=""){
                        startDate=new Date(startDate)
                        jobItem.startDate=startDate;

                        let endDate=timeArr[1]
                        if(endDate=="至今"){
                            endDate=new Date();
                        }else{
                            endDate=endDate.replaceAll("\.","-")
                            if(endDate!=""){
                                endDate=new Date(endDate)
                            }
                        }
                        jobItem.endDate=endDate;
                        jobItem.diffMonth=null;
                        if(startDate!=null && endDate!=null){
                            //比较两个时间，计算出相差月数
                            jobItem.diffMonth=moment(endDate).diff(moment(startDate),'month');
                            totalDiffMonth+=jobItem.diffMonth;
                            calcDiffMonthCount+=1;
                        }
                    }
                    
                }
            }
            //结束工作经历循环
            if(calcDiffMonthCount>0 && totalDiffMonth>0 
                && filterWorkExpTimeGreatThanOrEqualTo!=null ){
                if ((totalDiffMonth/calcDiffMonthCount)>=filterWorkExpTimeGreatThanOrEqualTo) {
                    r_filterWorkExpTimeGreatThanOrEqualTo = true;
                }
            }
        
            if(filterWorkExpTimeGreatThanOrEqualTo!=null && !r_filterWorkExpTimeGreatThanOrEqualTo){
                let cr=" 最近3份工作的平均月数不满足，"+data.realName+"。";
                checkResult+=cr;
                printLogInfo(cr)
            }
            
        }catch(e){
            console.error("筛选工作经历，处理"+data.realName+"工作时间异常，",e)
            printLogInfo("筛选工作经历工作时间异常，"+data.realName+"，已忽略并继续执行")
        }
        
    }
    
    return checkResult;
}