import PrismaClient from '@prisma/client'
import multer from 'multer'
import sneaksApi from 'sneaks-api'

const sneaks = new sneaksApi()

const tesApi =  async (req,res) =>{   
    try {
    await sneaks.getProducts("Yeezy Cinder", 10, function(err, products){
    res.status(200).json({products: products});
})
    }catch (error) {
        res.status(500).json({error: error.message});
    }
}
        

export { 
    tesApi
}