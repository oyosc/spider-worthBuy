# spider-worthBuy
##基本功能：
>1. 获取文章信息，如数据库没有会爬取数据再存到数据库中
>2. 实现邮箱推送，如有数据库记录推送，没有会定时查询数据库，有再进行推送
>3. 实现自动爬取功能，目前设置为北京时间8点整,因为临近黑色星期五，方便使用，我时间改成了在每个小时的30分钟进行自动爬取

##所用技术：node+mysql

##个人总结： </br>
整个系统完全是一时头脑发热写出来的，没有任何的架构可言，前端可以忽略不计，基本上想到啥写到啥，本来是为了打算black friday玩玩的，现在的话工作比较多，就暂时搁置了，不过基本的用途还是可以的！

##BUG：</br>
目前前端这块还有些问题，完善什么的以后闲下来再说！当首次爬取的时候需要多点一下数据才会出来，另外因为所爬取的网站有些页面不一样，所以会造成爬取不完全问题！

##使用：
>1. 配置文件： init.js
>2. 邮箱账号配置: user.txt

##使用教程
>1. git clone下，然后命令行输入npm install进行安装
>2. 安装mysql后，并配置下init.js中的相关参数
>3. 命令行输入gulp,自动构建，如果需要该程序能正常运行，请输入以下mysql语句填充category表</br>
>insert into spider.category values(UUID(), '电脑数码',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '服饰鞋包',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '运动户外',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '礼品钟表',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '个护化妆',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '家用电器',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '日用百货',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '家居家装',  '2016-11-21');</br>
>insert into spider.category values(UUID(), '图书音像',  '2016-11-21');</br>
