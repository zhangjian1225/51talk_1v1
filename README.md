**模板项目开发注意事项**


# 1、模板生成、编译、压缩、启动本地服务

## 1、生成模板项目

`
npm run create p t
`

其中
p: 项目名称
t: 模板名称

例子： npm run create T_01 THI0001_卡片放大


## 2、开发模板

### 1、生成一个新模板

执行生成模板的命令后，会在./src目录下生成对应的模板文件夹，以如下命令为例：

`
npm run create T_57 TCE0001_逃脱大鲨鱼
`

运行命令后，./src目录下会生成一个名称为T_57的文件夹

### 2、开发模板录入表单

根据学术&产品人员给出的模板原型设计，在content.js中确定数据结构 (content.js文件详解)；然后在form.ejs中编写表单页面，公共的css样式与js脚本已经自动生成，表单的其他录入字段样式与js交互分别追加到 ./form/css/style.scss 、 ./form/js/form.js中

### 3、开发模板展示页面

根据学术&产品人员给出的模板原型设计在index.ejs中实现页面布局，在 ./js/index.js中编写AC相关配置（配置项说明）、页面动态渲染、事件交互、断线重连等逻辑。
    

## 3、编译模板项目

    npm start p
    其中
    p: 项目名称 

    例子： npm start T_57
    编译完成之后可以访问如下路径：
    查看课件样式：http://localhost:3000/dist/01/index.html
    查看表单样式：http://localhost:3000/dist/01/form.html

## 4、发布模板项目

    npm run publish p
    其中
    p:项目名称

    例子：npm run publish T_01 
    运行命令会在./publish下生成T_01的压缩包，压缩包名称会以T_01下package.json里的name命名


# 2、模板详细说明

## 1、目录结构
```
|-- T_01
    |-- assets
    |-- css
    |   |-- index.scss
    |-- form
    |   |-- css
    |   |   |-- style.scss
    |   |-- img
    |   |   |-- close.png
    |   |   |-- loading.jpg
    |   |   |-- preview.jpg
    |   |   |-- sound.png
    |   |-- js
    |       |-- form.js
    |       |-- jquery-2.1.1.min.js
    |       |-- vue.min.js
    |-- image
    |   |-- defaultBg.png
    |   |-- tg.png
    |-- js
    |   |-- fit.js
    |   |-- index.js
    |   |-- sdk.js
    |   |-- tracking.js
    |-- content.js
    |-- form.ejs
    |-- index.ejs
    |-- package.json
```

目录与文件说明

* assets/ 目录存放一些调试用的素材，用于content.js做一些测试的例子数据
* css/index.scss 模板展示的样式文件，开发模板展示页面（index.ejs）的所有布局样式、动画等都应该写在这个文件中
* form/ 目录存放模板录入表单（form.ejs）的相关资源，其中自己开发的部分应该写在 form/css/style.scss与form/js/form.js中；form/img/preview.jpg 是模板的预览展示，在实际的开发中一般都会被替换，做一下同名覆盖就可以了
* image/ 存放模板展示页面（index.ejs）对应的图片资源，其中tg.png是公用的，不可删除，defaultBg.png是背景图片，开发者可以做同名替换，如果想叫别的名字，在css/index.scss中相应位置同步改一下就好
* js/ 此目录存放模板展示页面（index.ejs）的相关js文件，开发者自己开发的一些控制代码或者交互逻辑代码应该放在index.js文件中，其他的js文件为公共部分，后续可能被删除或者替换等
* content.js 模板的数据结构文件
* form.ejs 模板录入表单页面
* index.ejs 模板展示页面

## 2、content.js文件说明

这个文件的内容如下：

```json
var configData = {
  bg: "",
  desc: "",
  title: "",
  tg: [{
    content: "",
    title: ""
  }],
  level: {
    high: [{
      content: "",
      title: ""
    }],
    low: [{
      content: "",
      title: ""
    }]
  },
  source: {}
};

```
详细说明：

* bg：模板背景图片
* desc：模板一级标题
* title：模板二级标题
* tg、level：这两个是教学引导文案

上面的字段名称是每个模板都有的，并且固定不变

---

* source: 这个字段对应一个对象，这个对象是开发者对应模板定义的数据结构，这个数据结构中的字段是可以根据表单做维护的，展示页面通过这个数据结构进行模板的动态渲染

## 3、SDK相关

每个模板都引入了sdk.js这个文件，这个文件会暴露一个SDK的全局对象（window.SDK）,里面实现了与AC交互的大部分方法，如下：

---
### getClassConf

#### 说明

获取配置信息,此方法在浏览器中不可用

#### 使用方法

```javascript
var conf = SDK.getClassConf();
```
#### 参数

| 参数名称 | 类型 |  说明 |
| -------| ----- | -------- |

#### 返回结果

待补充

---
### getUserType

#### 说明

获取用户类型

#### 使用方法

```javascript
var type = SDK.getUserType();
```
#### 参数

| 参数名称 | 类型 |  说明 |
| -------| ----- | -------- |

#### 返回结果

| 结果类型 |   说明 |
| ------- |------- |
| string | stu: 学生；tea：老师; cc/CRIT/tutor:助教；anonymous：匿名用户；unKnow：未知类型 |

---
### bindSyncEvt

#### 说明

事件同步方法，使用此方法可以使老师端与学生端同步触发自定义的dom事件，用来实现类似老师端点击按钮触发一些事件，学生端也同步触发这些事件，以达到交互课件的效果。

#### 使用方法

```javascript

//这段代码会触发$("[data-syncresult='test']")的testClick事件
//老师端和学生端都会触发
SDK.bindSyncEvt({
    index: "test",
    eventType: 'click',
    method: 'event', 
    syncName: 'testClick',
    otherInfor:{
    },
    recoveryMode:'1'
});

```
#### 参数

option:

| 参数名称 | 类型 | 必填 |  说明 |
| -------| ----- | ---- | -------- |
| index | string | 是  | dom元素的data-syncactions值|
| eventType | string | 是 | 事件类型 |
| method | string | 是 | 目前只有两个值 event/drag |
| syncName | string | 是 | dom的自定义事件名称 |
| otherInfor | object | 否 | 记录界面状态数据，用于断线或者其他情况的切面恢复 |
| recoveryMode | string | 否 | 目前可选值只有'1',表示需要断线恢复 |


#### 返回结果

| 结果类型 |   说明 |
| ------- |------- |

---
### setEventLock

#### 说明

异步锁，当老师端与学生存在异步交互时，在异步执行结束时调用setEventLock方法，才会执行下一个操作。

#### 使用方法

```javascript

SDK.setEventLock();

```
#### 参数

| 参数名称 | 类型 | 必填 |  说明 |
| -------| ----- | ---- | -------- |



#### 返回结果

| 结果类型 |   说明 |
| ------- |------- |

---

### recover

#### 说明

这是一个接口，模板需要实现这个方法，利用传入的数据实现页面的断线恢复逻辑，当AC在断线中恢复的时候会自动调用这个方法

#### 使用方法

```javascript

SDK.recover = function(otherInfo){
    //断线恢复逻辑
};

```
---
### memberChange

#### 说明

这是一个接口，有些模板的游戏化互动需要监听另一端是否掉线，如果对端掉线，则本端要有一些逻辑处理，以防止老师端与学生端出现教学不同步、界面差异等问题。实现这个方法，利用传入的数据实现对端掉线后本端的逻辑控制。

#### 使用方法

```javascript

SDK.memberChange = function(message){
    //
};

```

#### 参数说明

message：

```
{
    role: "stu",
    state: "out",
    uid: 400938
}
```
role：用户角色
state： 用户状态，in:登入；out:登出
uid: 用户唯一ID

---
### syncData

#### 说明

同步缓存数据，这是一个对象，当你在一端给这个对象添加了属性，则另一端也会添加这个属性；此属性的同步依赖bindSyncEvt方法。

此对象主要为了存储模板的状态切面数据，以便在断线重连（recover）的时候进行页面恢复，recover的参数就是这个对象

#### 使用方法

```javascript

//老师端
SDK.syncData.test = "test";
SDK.bindSyncEvt({
    ......
});

//这样学生端就可以获取到这个值
 
```
---

### jQuery组件

除了以上方法，为了方便老师端与学生端的事件同步交互，封装了以下jQuery组件

#### syncbind 

一个用SDK方法实现点击同步的方法如下：

```javascript
$('.dice').on('click touchstart', function (e) {
    if (e.type == "touchstart") {
        e.preventDefault()
    }
    e.stopPropagation();
    SDK.bindSyncEvt({ 
        index: $(e.currentTarget).data('syncactions'),
        eventType: 'click',
        method: 'event', 
        syncName: 'diceClick'
    });
})
$('.dice').on('diceClick', function (e,message) {
    // TODO
});

```

使用syncbind组件代码如下：
```javascript

$('.dice').syncbind('click touchstart',function(dom,next){
    next();
},function(){
    // TODO
});

```
---


## 4、控制器相关配置



# 3、命名规范

图片命名连接符使用 _ （不强制），如 source_left.png

类名连接符使用 - （不强制）， 如 sound-bg.css

图片文件严格按照以下规范命名：

* 背景图片：bg.jpg/bg.png、bg_default.jpg ...

* 可替换图片：source_left.png、source_right.png ...

* 固定图片：tmp_sound.png、tmp_sound_bg.png ...


# 4、开发要点

    1：dom 结构尽量避免深层嵌套
    2：如果 dom 需要用到 js 来渲染结构，如无必要，不要通过定时器来渲染

# 5、腾讯文档

* 模板重要问题记录：https://docs.qq.com/sheet/DS01EbWRSTGlycVNN?opendocxfrom=admin&tab=z0tel3