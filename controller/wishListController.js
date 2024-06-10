import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

const getWishList = async  (req,res)=>{
    try {
        const id_user = req.params.id_user;
       const wishList = await prisma.$queryRaw`
       select f.id_favorit,f.user_id_user as id_user ,f.detail_sepatu_idDetail_sepatu AS idDetail_sepatu,ds.sepatu_id_sepatu as id_sepatu, sg.gambar_sepatu,ds.warna,sv.nama_sepatu,ds.harga_sepatu
       from favorite f
       join detail_sepatu ds on ds.idDetail_sepatu = f.detail_sepatu_idDetail_sepatu
       join sepatu_version sv on sv.id_sepatu = ds.sepatu_id_sepatu 
       join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = ds.idDetail_sepatu
       where f.user_id_user =  ${id_user} and f.status = 1
       group by f.id_favorit`

       res.status(200).json({data: wishList, message: "WishList Berhasil DiLoad!"});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

const addWishList =  async (req,res) =>{
    try {

        const cekWishList = await prisma.favorite.findFirst({
            where:{
                user_id_user: parseInt(req.body.id_user),
                detail_sepatu_idDetail_sepatu: parseInt(req.body.idDetail_sepatu)
            }
        })
        console.log(cekWishList);
        if(cekWishList){
            const wishList = await prisma.favorite.update({
                where:{
                   id_favorit:parseInt(cekWishList.id_favorit) 
                },
                data:{
                    status:1,
                    created_at: new Date()
                },
                
            })
            return res.status(200).json({data: wishList, status: 200, message: "Success WishList Created"})
        }else{
            const wislist = await prisma.favorite.create({
                data:{
                    user_id_user: parseInt(req.body.id_user),
                    detail_sepatu_idDetail_sepatu: parseInt(req.body.idDetail_sepatu),
                    status:1,
                    created_at: new Date(),
                }
            })
            return res.status(201).json({data: wislist, status: 201, message: "Success WishList Created"})
        }
        
    } catch (error) {
        res.status(500).json({errer: error.message})
    }
}

const removeWishList = async (req,res)=>{
    try {

        const cekWishList = await prisma.favorite.findFirst({
            where:{
                user_id_user: parseInt(req.params.id_user),
                detail_sepatu_idDetail_sepatu: parseInt(req.params.idDetail_sepatu)
            }
        })

        if(cekWishList){
            const wishList = await prisma.favorite.update({
                where:{
                    id_favorit:parseInt(cekWishList.id_favorit) 
                },
                data:{
                    status:0,
                    updated_at: new Date()
                }
            })
            return   res.status(200).json({data:wishList,status:200, message: "wishList delete successfully"})
        }else{
            return res.status(404).json({status:404, message: "wishList not found"})
        }
        
       

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export{
    addWishList,
    removeWishList,
    getWishList
}