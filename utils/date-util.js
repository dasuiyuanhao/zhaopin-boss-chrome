/**
 * 日期格式化
 * @param date
 * @returns {string}
 */
 function formatDateTime(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
}

/**
 * 日期格式化
 * MM-DD HH:mm:ss
 * @param date
 * @returns {string}
 */
 function formatDateTimeForMMDDHHmmss(date) {
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return m + '-' + d+' '+h+':'+minute+':'+second;
}

/**
 * 日期格式化
 * @param inputTime
 * @returns {string}
 */
 function formatDateTimeByTime(inputTime) {
    var date = new Date(inputTime);
    return formatDateTime(date)
}

/**
 * 获取当前时间
 * @returns 
 */
function currentTime(){
    return new Date().getTime();
}

/**
 * 获取格式化好的当前时间
 * @returns 
 */
 function currentDateTimeByFormat(){
    return formatDateTime(new Date());
}

/**
 * 获取格式化好的当前时间
 * MM-DD HH:mm:ss
 * @returns 
 */
 function currentDateTimeByFormatForMMDDHHmmss(){
    return formatDateTimeForMMDDHHmmss(new Date());
}
