module.exports = func => (req, res, next)=>
    Promise.resolve(func(req, res, next)).catch(next)
//func() is the function refers the async function in controller
//if product is created then it resolved using promise.resolve
//if any error occurs it comes to func() and catch(next) throws the error msg back to postman