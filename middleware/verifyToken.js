import jwt from 'jsonwebtoken'


const verifyToken = async (req,res, next)=>{
    // const authHeaader = req.headers['authorization'];
    // const token = authHeaader.split(' ')[1]
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log(token)
    if(!token) return res.status(401).json({ error: 'Token tidak ditemukan' });
    jwt.verify(token, process.env.SECRET_KEY , (err, user)=>{

        if(err) return res.status(403).json({ error: err.message });
        // const currentTime = Math.floor(Date.now() / 1000)
        // if(user.exp <= currentTime) return res.status(401).json({error : "Token Kadaluwarsa"})
        req.user = user
        next()
    })

}

export { 
    verifyToken
}