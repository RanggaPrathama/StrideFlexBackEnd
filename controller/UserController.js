import { PrismaClient } from "@prisma/client";
import multer, { MulterError } from 'multer';



const prisma = new PrismaClient()

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'images/profile')
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


const getUserProfile = async (req,res) =>{
    try {
        const user = await prisma.user.findFirst({
            where:{
                id_user: parseInt(req.params.idUser)
            }
        })
        if(!user) return res.status(404).json({message: 'User not found'})
        
        res.status(200).json({data: user})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const updateProfile = async (req, res) => {
    try {
        upload(req, res, async (error) => {
            if (error instanceof MulterError) {
                return res.status(400).json({ message: error.message, status: error.status });
            } else if (error) {
                return res.status(500).json({ message: error.message, status: error.status });
            }

            try {
                const User = await prisma.user.findFirst({
                    where: {
                        id_user: parseInt(req.params.idUser)
                    }
                });

                if (!User) return res.status(404).json({ message: 'User not found' });

               
                const dataToUpdate = {};

                if (req.file) {
                    const urlProfile = `${req.protocol}://${req.get('host')}/images/profile/${req.file.filename}`;
                    dataToUpdate.gambar_profile = req.file.filename;
                    dataToUpdate.urlProfile = urlProfile;
                }

                if (req.body.phoneNumber) {
                    dataToUpdate.phoneNumber = req.body.phoneNumber;
                }

                const updatedUser = await prisma.user.update({
                    where: {
                        id_user: User.id_user
                    },
                    data: dataToUpdate
                });

                res.status(200).json({ data: updatedUser, message: 'Profile updated successfully' });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createAddress = async (req,res) =>{
    try {
        const address = await prisma.alamat_user.findMany()
        const {alamat} = req.body
        if(address.length < 1){
           const createAddress = await prisma.alamat_user.create({
            data :{
                'user_id_user' : parseInt(req.params.idUser),
                'alamat' : alamat,
                'status' : 1
            }
           })
           return res.status(201).json({data: createAddress, message: 'Address created successfully'})
        }else{
            const createAddress = await prisma.alamat_user.create({
                data :{
                    'user_id_user' : parseInt(req.params.idUser),
                    'alamat' : alamat,
                    'status' : 0
                }
               })
               return res.status(201).json({data: createAddress, message: 'Address created successfully'})
        }
    } catch (error) {
        res.status(500).json({error: error.message})        
    }
}

const getAddressAktif = async (req,res) =>{
   try {
    const alamat = await prisma.alamat_user.findFirst({
        where:{
            'user_id_user' : parseInt(req.params.idUser),
            'status' : 1
        }
    })
    res.status(200).json({data:alamat, message:"Address Berhasil terload"})
   } catch (error) {
    res.status(500).json({error:error.message})
   }

      
}

const getAddressNonAktif = async (req,res) =>{
    try {
     const alamat = await prisma.alamat_user.findMany({
         where:{
             'user_id_user' : parseInt(req.params.idUser),
             'status' : 0
         }
     })
     res.status(200).json({data:alamat, message:"Address Berhasil terload"})
    } catch (error) {
     res.status(500).json({error:error.message})
    }
 
       
 }
 

 const updateAddressAktif = async(req, res) => {
    try {
        const idUser = parseInt(req.params.idUser) 
        const idAlamat = parseInt(req.params.idAlamat)
        const cekAktif = await prisma.alamat_user.findFirst({
            where:{
                'user_id_user': idUser,
                'status' : 1
            }
        })

        if(cekAktif){
          const ubahStatus =  await prisma.alamat_user.update({
                where:{
                    'id_alamat': cekAktif.id_alamat
                },
                data:{
                    'status' : 0
                }
            })
        }
            const newAddressAktif = await prisma.alamat_user.update({
                where:{
                    'id_alamat' : idAlamat,
                },
                data:{
                    'status': 1
                }
            })

            res.status(201).json({data:newAddressAktif, message:"Address updated successfully"})
        
    } catch (error) {
        res.status(500).json({error:error.message})
    }
 }

 const deleteAddress = async ( req,res) =>{
    try {
        const idAlamat = parseInt(req.params.idAlamat)
        const address = await prisma.alamat_user.delete({
            where:{
                'id_alamat' : idAlamat
            }
        })
        res.status(200).json({data:address, message:"Address deleted successfully"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
 }

export {
    updateProfile,
    getUserProfile,
    createAddress,
    getAddressAktif,
    getAddressNonAktif,
    updateAddressAktif,
    deleteAddress 
};