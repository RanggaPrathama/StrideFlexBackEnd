import { PrismaClient } from "@prisma/client";
import multer, { MulterError } from 'multer';

const prisma = new PrismaClient()

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'images/buktiBayar')
    },
    filename : (req,file,cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName)
    }
}
  
)

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb ) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg+xml'){
            cb(null,true)
        }else{
            cb(null,false)
            return cb(new Error('Invalid mimetype  '))
        }
    }
}).single('file');


const pembayaranIndex= async(req,res)=> {
    try {
        const {idPembayaran} = req.params
        const pembayaran = await prisma.pembayaran.findFirst({
            where:{
                'id_pembayaran' : parseInt(idPembayaran),
            }
        })
        res.status(200).json({data: pembayaran, message: "Pembayaran berhasil diload"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const pembayaranStore = async(req,res) =>{
    try {
        const {idPayment, idPemesanan, idOngkir, totalBayar } = req.body

        //  const now = new Date();
        //  const date = new Date(now + "UTC")
        // const tzOffset = 7 * 60; 
        // const created_at = new Date(now.getTime() + tzOffset * 60000);

        const pembayaran = await prisma.pembayaran.create({
            data:{
                pemesanan_id_pemesanan : parseInt(idPemesanan),
                payment_id_payment : parseInt(idPayment),
                ongkir_id_ongkir : parseInt(idOngkir),
                total_pembayaran: parseInt(totalBayar) ,
                status : 0,
                created_at: new Date(),
            }
        
        })
       res.status(201).json({data: pembayaran, message:"Pembayaran successfully"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const updatePembayaran = async( req,res) =>{
    try {
        upload(req,res, async(error) =>{
            if (error instanceof MulterError) {
                return res.status(400).json({ message: error.message, status: error.status});
            } else if (error) {
                return res.status(500).json({ message: error.message, status: error.status});
            }
        
            try {
                const {idPembayaran} = req.params
                const now = new Date();
                //const tzOffset = 7 * 60; // offset untuk WIB (UTC+7)
               // const updated_at = new Date(now.getTime() + tzOffset * 60000);
    
                const pembayaran = await prisma.pembayaran.findFirst({
                    where:{
                        id_pembayaran : parseInt(idPembayaran)
                    }
                })
    
                if(!pembayaran){
                    return res.status(404).json({error: "Pembayaran not found"})
                }
    
                const updatePembayaran = await prisma.pembayaran.update({
                    where:{
                       id_pembayaran : parseInt(pembayaran.id_pembayaran )
                    },
                    data:{
                        bukti_pembayaran: req.file.filename,
                        status: 2,
                        updated_at : now
                    }
                })
                res.status(201).json({data: updatePembayaran, message:"Pembayaran has been Successfully "})
            } catch (error) {
                res.status(500).json({error:error.message})
            }


        } )
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const pembayaranExpired = async(req,res) => {
    try {
        const {idPembayaran} = req.params
        const pembayaran = await prisma.pembayaran.findFirst({
            where:{
                id_pembayaran: parseInt(idPembayaran)
            }
        })
        if(!pembayaran){
            return res.status(404).json({error: "Pembayaran not found"})
        }
        const updatepembayaran = await prisma.pembayaran.update({
            where:{
                id_pembayaran:parseInt(pembayaran.id_pembayaran)
            },
            data:{
                status: 3,
                updated_at: new Date()
            }
        })
       
        res.status(201).json({data: updatepembayaran, message:"Pembayaran Expired "})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const pembayaranVerified = async(req,res) => {
    try {
        const {idPembayaran} = req.params
        const pembayaran = await prisma.pembayaran.findFirst({
            where:{
                id_pembayaran: parseInt(idPembayaran)
            }
        })
        if(!pembayaran){
            return res.status(404).json({error: "Pembayaran not found"})
        }
        const updatepembayaran = await prisma.pembayaran.update({
            where:{
                id_pembayaran:parseInt(pembayaran.id_pembayaran)
            },
            data:{
                status: 1,
                updated_at: new Date()
            }
        })
       
        res.status(201).json({data: updatepembayaran, message:"Pembayaran Verified Success "})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const orderStatus = async (req, res) => {
    try {
        const { idUser, status } = req.query;
       // console.log(`Received idUser: ${idUser}, status: ${status}`); 

        const parsedIdUser = parseInt(idUser);
        const parsedStatus = parseInt(status);
       // console.log(`Parsed idUser: ${parsedIdUser}, Parsed status: ${parsedStatus}`); 

        const order = await prisma.$queryRaw`
        select p.id_pembayaran, p.status
        from pembayaran p 
        join pemesanan pem on pem.id_pemesanan = p.pemesanan_id_pemesanan
        where pem.user_id_user = ${parsedIdUser} and p.status = ${parsedStatus}
        order by p.created_at DESC
        ; 
        `;
        
        
       // console.log(`Order data: ${JSON.stringify(order)}`); 

        res.status(200).json({ data: order, message: "Order successfully loaded" });
    } catch (error) {
        console.error(`Error: ${error.message}`); 
        res.status(500).json({ error: error.message });
    }
}


const orderItem = async (req, res) => {
    try {
        const {idPembayaran} = req.params
        const item = await prisma.$queryRaw`
        select p.id_pembayaran, pem.user_id_user,p.status, sg.gambar_sepatu, sv.nama_sepatu, dps.warna, dp.quantity,u.nomor_ukuran, dp.subtotal
        from pembayaran p
        join pemesanan pem on pem.id_pemesanan = p.pemesanan_id_pemesanan
        join detail_pemesanan dp on dp.pemesanan_id_pemesanan = pem.id_pemesanan
        join stok s on s.id_stok = dp.stok_id_stok
        join detail_sepatu dps on dps.idDetail_sepatu = s.detail_sepatu_idDetail_sepatu
        join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = dps.idDetail_sepatu
        join ukuran u on u.id_ukuran = s.ukuran_id_ukuran
        join sepatu_version sv on sv.id_sepatu = dps.sepatu_id_sepatu
        where p.id_pembayaran = ${parseInt(idPembayaran)}
        group by sv.id_sepatu;
        `
        res.status(200).json({data:item, message:"item loaded successfully"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export {
    pembayaranIndex,
    pembayaranStore,
    updatePembayaran,
    orderItem,
    orderStatus,
    pembayaranExpired,
    pembayaranVerified 
}