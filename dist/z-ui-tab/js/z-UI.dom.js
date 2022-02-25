;(function(){
    var dom = new Object();
    dom.removeEvent=function(elem,type,fn){
        if(window.removeEventListener){
            elem.removeEventListener(type, fn);
        }else if(window.detachEvent){
            elem.detachEvent('on' + type, fn);
        }
    }
    dom.createElem=function(opt){
        var element = opt.name,clazz=opt.clazz,id=opt.id,text=opt.text;
        var d = document.createElement(element);
        if(clazz){
            d.setAttribute('class',clazz);
        }
        if(id){
            d.setAttribute('id',id);
        }
        if(text){
            d.appendChild(document.createTextNode(text));
        }
        return d;
    }
    dom.addClass=function(node,clazz){
        if(node instanceof NodeList){
            for(var i=0;i<node.length;i++){
                dom.addClassOne(node[i],clazz);
            }
        }else{
            dom.addClassOne(node,clazz);
        }
    }
    dom.addClassOne=function(node,clazz){
        var classs = node.className.trim();
        var cs = classs ? classs.split(' ') : [];
        var as = clazz.split(' ');
        for (var x in as) {
            if(cs.indexOf(as[x])=== -1){
                classs += ' '+as[x];
            }
        }
        node.className=classs;
    }
    dom.hasClass=function(node,clazz){
        var classs = node.className;
        var cs = classs ? classs.split(' ') : [];
        return cs.indexOf(clazz)!== -1;
    }
    dom.removeClass=function(node,clazz){
        if(node instanceof NodeList){
            for(var i=0;i<node.length;i++){
                dom.removeClassOne(node[i],clazz);
            }
        }else{
            dom.removeClassOne(node,clazz);
        }
    }
    dom.removeClassOne=function(node,clazz){
        var classs = node.className;
        var cs = classs ? classs.split(' ') : [];
        var i;
        var rc = clazz.split(' ');
        for (var x in rc) {
            if((i=cs.indexOf(rc[x]))!== -1){
                delete cs[i];
            }
        }
        node.className=cs.join(' ').trim();
    }
    dom.remove=function(node){
        if(node !== null)
            node.parentNode.removeChild(node);
    }
    dom.empty=function(node){
        node.innerHTML='';
    }
    dom.is=function(node,tagName){
        var n= node.tagName.toUpperCase();
        return tagName.toUpperCase() === n;
    }
    dom.get=function(select){
        return document.querySelector(select);
    }
    dom.getW=function(node){
        return node.style.width || node.offsetWidth;
    }
    dom.getH=function(node){
        return node.style.height || node.offsetHeight;
    }
    dom.makeSVG=function(opt) {
        var tag=opt.name,id=opt.id,clazz=opt.clazz;
        var ns = 'http://www.w3.org/2000/svg';
        var el= document.createElementNS(ns, tag);
        el.setAttribute("class",clazz);
        el.setAttribute("id",id);
        return el;
    }
    zUI.dom=dom;
}());