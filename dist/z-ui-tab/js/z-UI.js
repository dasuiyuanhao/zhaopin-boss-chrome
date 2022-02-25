;(function(){
    var zUI = new Object();
    zUI.util = function(){
        this.isEmpty = function(a){
            return a=== null || a==='';
        }
        this.isF = function(a){
            return typeof a === 'function';
        }
        this.nvl = function(a,b){
            return this.isEmpty(a) ? b : a;
        }
        return this;
    };
    window.zUI = zUI;
}())