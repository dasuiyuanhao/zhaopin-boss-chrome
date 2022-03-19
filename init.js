/*!
* Author: dasuiyuanhao
* Date: 2020-3-20
*/

const chromePluginId="bole-zhaopin-chrome";
const chromePluginVersion="2.0.0";


window.patch = snabbdom.init([
    snabbdom_class.default, snabbdom_style.default, snabbdom_props.default, snabbdom_eventlisteners.default
]);
window.h = snabbdom.h;

window.all_metrics = {
    tp50: 'Top 50 (ms)',
};