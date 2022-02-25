;(function(){
    zUI.tab = {
        loadTab:function(set){
            var dom = zUI.dom;
            var elem = set.elem||'';
            var type = set.type||'1';
            var $obj = document.querySelectorAll(elem);
            var clicks = set.clicks||[];
            var loadOne = function(tab){
                var navs = tab.querySelectorAll('.bar-box .nav');
                var wraps = tab.querySelectorAll('.content .wrap');

                for(var i=0;i<navs.length;i++){
                    var nav = navs[i];
                    var wrap = wraps.length > i ? wraps[i]:null;
                    var disable = dom.hasClass(nav,'disable');
                    if(!disable){
                        //闭包
                        nav.onclick = function(wp,nv,ind){
                            return function(e){
                                dom.removeClass(wraps,'zUI-show');
                                dom.removeClass(navs,'active');
                                dom.addClass(nv,'active');
                                if(wp != null){
                                    dom.addClass(wp,'zUI-show');
                                }
                                var myClick = clicks.length > ind ? clicks[ind]:null;
                                if(typeof myClick === 'function'){
                                    try{
                                        myClick(ind,nv,wp);
                                    }catch (e) {
                                        console.error(e);
                                    }
                                }
                            }
                        }(wrap,nav,i);
                    }

                }
            }
            for(var i=0;i<$obj.length;i++){
                loadOne($obj[i]);
            }
        },
        switchTab: function (elem,index) {
            var dom = zUI.dom;
            var obj = document.querySelectorAll(elem);
            for (var i = 0; i < obj.length; i++) {
                if(dom.hasClass(obj[i],'zUI-bar')){
                    var navs = obj[i].querySelectorAll('.bar-box .nav');
                    var wraps = obj[i].querySelectorAll('.content .wrap');
                    var nav = navs.length > index ? navs[index] : null;
                    var wrap = wraps.length > index ? wraps[index]:null;
                    if(nav != null){
                        dom.removeClass(wraps,'zUI-show');
                        dom.removeClass(navs,'active');
                        dom.addClass(nav,'active');
                        if(wrap != null){
                            dom.addClass(wrap,'zUI-show');
                        }
                    }

                }
            }
        }
    }
}());