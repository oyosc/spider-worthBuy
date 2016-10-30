/**
 * Created by Administrator on 2016/10/29.
 */
var Sequelize = require('sequelize');

//文章信息表
module.exports = function(sequelize){
    return sequelize.define((__filename.substr(__dirname.length + 1).split("."))[0], {
            _id : {
                type : Sequelize.UUID,
                primaryKey : true,
                defaultValue : Sequelize.UUIDV1
            },
            name : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "名称"
            },
            shop : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "商城"
            },
            article_tag : {
                type : Sequelize.TEXT,
                allowNull : false,
                comment : "标签"
            },
            articleHref : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "文章链接"
            },
            articleDesc : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "文章描述"
            },
            article_unvotedwrap : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "文章不值"
            },
            article_votedwrap : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "文章值"
            },
            article_imgurl : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "文章图片链接"
            },
            article_publishTime : {
                type : Sequelize.DATE,
                allowNull : false,
                comment : "文章发布时间"
            },
            create_time : {
                type : Sequelize.DATE,
                allowNull : false,
                comment : "文章创建时间"
            }
        },
        {
            freezeTableName: true,
            timestamps: false,
            paranoid: false,
            underscored: true,
            classMethods: {
                associate : function(models){
                    this.belongsTo(models.category, {foreignKey : 'category_id', constraints : true});
                }
            }
        }
    )
}