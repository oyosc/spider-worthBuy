/**
 * Created by Administrator on 2016/10/29.
 */
var Sequelize = require("sequelize");

//文章分类表
module.exports = function(sequelize){
    return sequelize.define((__filename.substr(__dirname.length+1).split("."))[0], {
        _id:{
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV1
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            comment:"分类名称"
        },
        create_time:{
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            comment: "创建时间"
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: false,
        underscored: true,
        classMethods: {
            associate : function(models){
                this.hasMany(models.article, {foreignKey : 'category_id', constraints : true})
            }
        }
    })
}