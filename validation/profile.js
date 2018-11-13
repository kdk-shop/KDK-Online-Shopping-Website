const validator=require('validator')
const isEmpty=require('./is-empty')

module.exports=function validateProfileInput(data){

    let errors={}
    data.name=!isEmpty(data.name)? data.name : ''
    data.email=!isEmpty(data.email)? data.email : ''
    data.address=!isEmpty(data.address)?data.address : ''
    data.tel=!isEmpty(data.tel)?data.tel : ''
  
    if(!validator.isLength(data.name,{min: 2 , max: 30})){
        errors.name='Name must be between 2 and 30 characters!'
    }

    if(validator.isEmpty(data.name)){
        errors.name='Name field is required!'
    }

    if(validator.isEmpty(data.email)){
        errors.email='Email field is required!'
    }

    if(!validator.isEmail(data.email)){
        errors.email='Email is invalid!'
    }
    
    if(!validator.isLength(data.address,{min:1, max:199})){
        errors.address='Address must be between 1 and 200 characters!'
    }

    if(!validator.isMobilePhone(data.tel)){
        errors.tel='Phone number is invalid!'
    }
    return{
        errors,
        isValid:isEmpty(errors)
    }
}
