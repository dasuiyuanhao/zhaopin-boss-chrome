[github](https://github.com/dasuiyuanhao/zhaopin-boss-chrome)
[gitee](https://gitee.com/lizhilaile/zhaopin-boss-chrome)

## 1.介绍
<h3>声明：仅供学习参考，如果出现经济损失概不负责，请勿用于商业用途！</h3>
<br/>
<font color="orange"><h3>您的Star是我继续前进的动力，如果喜欢请右上角帮忙点个Star</h3></font>
<br/>

zhaopin-boss-chrome，伯乐2号，招聘自动化工具，是Chrome扩展程序，省时间90%。模拟人的操作，自动筛选，自动打招呼，自动沟通。BOSS直聘插件，BOSS插件，[开源代码地址](https://gitee.com/lizhilaile/zhaopin-boss-chrome)。

只能在[BOSS直聘](https://www.zhipin.com)网站使用,在BOSS直聘上为您提供高效的辅助工具。

另外，智联招聘自动化工具：[开源代码地址bole-zhilian-chrome](https://gitee.com/lizhilaile/bole-zhilian-chrome)

### 技术亮点：
#### 1、使用Input.dispatchMouseEvent解决isTrusted为true的判断，触发按钮点击事件。
#### 2、解决iframe中元素的定位问题。
#### 3、实现Chrome扩展程序存储数据，例如保存和读取配置项。
#### 4、页面元素筛选，按照既定逻辑自动操作；对于自定义封装输入框，能够进行模拟输入和触发事件。


### 主要功能：
#### 1、【推荐牛人】 自定义筛选条件筛选，可保存设置。筛选条件有：年龄、学历、学校、工龄、性别、是否应届毕业生、经历岗位、求职岗位、求职期望地点、牛人状态等。
#### 2、【推荐牛人】 模拟人的操作，一键加载全部，自动进行打招呼。
#### 3、【沟通】 自定义筛选条件筛选，可保存设置。筛选条件有：消息状态、时间范围、消息内容等。
#### 4、【沟通】 模拟人的操作，自定义消息内容，一键自动发消息。
</br>
<div  align="center"> 
  <img src="https://gitee.com/lizhilaile/zhaopin-boss-chrome/raw/master/img/%E6%B2%9F%E9%80%9A%E9%A1%B5%E9%9D%A2.png"  alt="【沟通】工具" align="center" /> 
</div>
</br>
<div  align="center"> 
  <img src="https://gitee.com/lizhilaile/zhaopin-boss-chrome/raw/master/img/%E6%8E%A8%E8%8D%90%E7%89%9B%E4%BA%BA.png"  alt="【推荐牛人】工具" align="center" /> 
</div>
</br>
  

## 2.版本说明
### V2.0.3
【推荐牛人】增加筛选条件：经历岗位。

### V2.0.2
【推荐牛人】修复筛选条件“求职期望地址”为两级地址时，不能筛选的问题。

### V2.0.1
【推荐牛人】增加了工龄筛选条件。
【沟通】增加了时间范围筛选条件；放开了沟通自动沟通数量上限到10000个。
【沟通】增加消息状态筛选条件（已读、送达、盼回复、全部）。

### V2.0.0
【推荐牛人】简历筛选功能。筛选条件：学校、年龄、应届生、学历、求职岗位、性别、求职期望地点、牛人活跃状态等

【推荐牛人】自动打招呼功能。支持一键加载全部，支持自动打招呼，支持快捷键操作。增加重置筛选条件配置功能。

【沟通】自动进行发消息；对于已读的人员进行筛选，标记颜色；使用快捷键滚动到下一个、上一个。


### V1.4.1
更新适配BOSS直聘新版的样式。

### V1.4.0
增加了保存筛选项配置功能。

### V1.3.0
优化了按钮样式。增加了筛选条件"求职意向不包含"。一键加载全部的滚动时间间隔，增加了随机时间(从2s到10s之间)。

### V1.2.0
优化了样式。
增加了“打招呼后自动滚动到下一个”功能。

### V1.1.0
BOSS直聘推荐牛人页面调整了，兼容升级下

## 3.使用说明

### 3.1 安装
  您可以下载源代码，在chrome://extensions 下打开开发者模式，加载已解压的扩展程序。

  [Chrome安装扩展程序教程](https://jingyan.baidu.com/article/148a19216b72900c70c3b176.html)
### 3.2 使用
  1.设置招呼语，【工具箱】->【自定义打招呼语】，去设置自定义招呼语。
  例如：请问方便发一份您的简历过来吗？第一学历是统招的一本吗？

  2.打开【推荐牛人】页面，左下角会显示控制台(点击页面右上角隐藏按钮可以隐藏)，配置筛选条件。

  3.滚动到页面底部加载简历，也可以一键加载全部，点击筛选全部。
  
  满足筛选条件的简历：未沟通的标记橙色，已沟通的标记淡蓝色。已过滤专科学历。

  点击【打招呼】按钮，勾选了“打招呼后自动滚动到下一个”，会自动滚动到下一个满足条件的简历。

  开始体验丝滑般的沟通吧！ 

## 联系方式
### 作者：dasuiyuanhao

### 电子邮箱：dasuiyuanhao@sina.com

### 微信号：dasuiyuanhao
<div  align="center"> 
<img src="https://gitee.com/lizhilaile/blog/raw/master/images/weixin_dasuiyuanhao_800.jpg" width = "400" alt="微信二维码：dasuiyuanhao" align="center" />
</div>
</br>

## 如果您使用后节省了时间，请打赏￥31.4元(一顿外卖)，帮捧捧场，请右上角点个Star，谢谢！
<div  align="center"> 
<img src="https://gitee.com/lizhilaile/blog/raw/master/images/wodeweixinshoukuanma.png" width = "400" height = "400" alt="微信支付，微信号：dasuiyuanhao" align="center" />
</div>
</br>
<div  align="center"> 
<img src="https://gitee.com/lizhilaile/blog/raw/master/images/wodezhifubaoshoukuanma.png" width = "400" height = "400" alt="支付宝支付" align="center" />
</div>

### 声明：仅供学习参考，如果出现经济损失概不负责，请勿用于商业行为！
