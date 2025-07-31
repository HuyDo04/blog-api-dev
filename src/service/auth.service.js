const {User} = require("@/models")
const { where } = require("sequelize")

exports.create = async (data) => {
    const user = await User.create(data)
    return user
}

exports.getById = async (id) => {
    const user = await User.findByPk(id)    
    
    return user
}

exports.getByEmail = async (email) => {
    const user = await User.findOne({
        where: {
            email
        },
        // attributes:["email",]
    })    
    return user
}

exports.update = async (id, data) => {
    const user = await User.findByPk(id);
        
    if(!user) return null
    const newUser = await User.update(data,{
        where: {id}
    })
    return newUser
} 

exports.delete = async (id) => {
    const deleted = await User.destroy({
        where: {id}
    })
    return deleted
}
