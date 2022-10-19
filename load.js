/*!
* Author: dasuiyuanhao
* Date: 2020-3-20
*/

function init(){
    console.info("开始加载......")

    return new Promise((resolve, reject)=>{
        //找到页面元素
        const left_doc = ()=>
            document.getElementById('main');
    
        // async.waterfall([
        //     cb=>{
        //         async.until(
        //             ()=> left_doc() != null
        //             , cb=>console.log('waiting for 页面加载') || setTimeout(cb, 1000)
        //             , ()=>{
        //                 //left_doc().querySelector('#systemName3 a').click()

        //                 cb(null, null)
        //             }
        //         )
        //     }, (app_list, cb)=>{
        //             //加载数据
        //             // loadData();
        //             console.info("加载成功")
        //         }

        // ], (e, r)=>e ? reject(e) : resolve(r))

        console.info("加载成功......")
    })
}





