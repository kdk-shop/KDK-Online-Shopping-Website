const validator=require('validator')
const isEmpty=require('../is-empty')

module.exports=function validateRegisterInput(data){

    let errors={}
    data.old_password=!isEmpty(data.old_password)? data.old_password : ''
    data.password=!isEmpty(data.password)? data.password : ''
    data.password2=!isEmpty(data.password2)? data.password2 : ''

    if(validator.isEmpty(data.old_password)){
        errors.password='Old password is required'
    }

    if(validator.isEmpty(data.password)){
        errors.password='New password is required'
    }

    if(!validator.isLength(data.password,{min: 6 , max: 30})){
        errors.password='Password must be at least 6 characters'
    }

    if(validator.isEmpty(data.password2)){
        errors.password2='Confirm password is required'
    }

    if(!validator.equals(data.password,data.password2)){
        errors.password2='Passwords must match'
    }
    
    return{
        errors,
        isValid:isEmpty(errors)
    }
}
