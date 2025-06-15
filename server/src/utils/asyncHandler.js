const asyncHandler = (requestHandler) =>{
    return (req,res,next) =>{
        Promise.resolve(
            requestHandler(req,res,next)
        ).catch(
            (err) => {
                console.log(err.message)
                return  res.status(err.statusCode || 500).json({ success: false, message: err.message });
            }
        )
    }
}

export default asyncHandler

