import { PrismaClient } from "@prisma/client";
import multer, { MulterError } from 'multer';

const prisma = new PrismaClient()

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'images/payment')
    },
    filename : (req,file,cb) =>{
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName)
    }
})

const upload = multer({
    storage: storage,
    fileFilter : (req,file,cb) =>{
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg+xml'){
            cb(null,true)
        }else{
            cb(null,false)
            return cb(new Error('Invalid mimetype  '))
        }
    }
}).single('file')


const createPayment = async (req,res) => {
   
    upload(req,res,async(error) => {
        if(error instanceof MulterError){
           return res.status(500).json({message: error.message});
        }else if (error){
            return res.status(500).json({message: error.message});
        }

        try {
            const {atasNama, noRekening, namaBank} = req.body
            const payments = await prisma.payments.create({
                data:{
                    atas_nama : atasNama,
                    no_rekening :parseInt( noRekening),
                    nama_bank : namaBank,
                    gambar_bank : req.file.filename
                }

            })
            res.status(201).json({data: payments, status:"success payments created"})
        } catch (error) {
            res.status(500).json({error: error.message})
        }
        

    })
 
}

const getPayment = async(req,res) =>{
   try {
    const payment = await prisma.payments.findMany()

    res.status(200).json({data: payment, message: "payment berhasil diload"})
   } catch (error) {
    res.status(500).json({error: error.message})
   }
}

const getPaymentId = async(req,res) =>{
    try {
        const {idPayment} = req.params
        const payment = await prisma.payments.findFirst({
            where:{
                id_payment :parseInt(idPayment) 
            }
        }
        )
          res.status(200).json({data: payment, message: "payment berhasil diload"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
    


export{
    getPayment,
    createPayment,
    getPaymentId
}