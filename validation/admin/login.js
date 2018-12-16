const validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=function validateLoginInput(data){

    let errors={}
    data.name=!isEmpty(data.name)? data.name : ''
    data.password=!isEmpty(data.password)? data.password : ''

    if(validator.isEmpty(data.name)){
        errors.name='Name field is required'
    }
    
    if(validator.isEmpty(data.password)){
        errors.password='Password field is required'
    }

    return{
        errors,
        isValid:isEmpty(errors)
    }
}
