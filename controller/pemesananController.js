import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const indexPemesanan = async (req,res) =>{
    try {
        const {idPesan,idUser} = req.params
        const pemesanan = await prisma.$queryRaw`
            select dp.pemesanan_id_pemesanan,dp.idDetail_pemesanan,sg.gambar_sepatu, sv.nama_sepatu, ds.harga_sepatu, ds.warna, c.quantity,u.nomor_ukuran,dp.subtotal
            from detail_pemesanan dp 
            join pemesanan p on p.id_pemesanan = dp.pemesanan_id_pemesanan
            join stok s on s.id_stok = dp.stok_id_stok
            join detail_sepatu ds on ds.idDetail_sepatu = s.detail_sepatu_idDetail_sepatu
            join sepatu_version sv on sv.id_sepatu = ds.sepatu_id_sepatu
            join ukuran u on u.id_ukuran = s.ukuran_id_ukuran
            join cart c on c.stok_id_stok = s.id_stok
            join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu =  ds.idDetail_sepatu
            where p.user_id_user = ${idUser} and p.id_pemesanan = ${idPesan}
            group by sv.id_sepatu;
        `
        res.status(200).json({data:pemesanan, message:"pemesanan successfully added"})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const pemesananStore = async (req,res) => {
   try {
    const {idUser,dataPemesanan, totalPesan} = req.body;

    if(!idUser, !dataPemesanan, !totalPesan){
        return res.status(400).json({ error: 'Invalid input data' });
    }
    const pemesanan = await prisma.pemesanan.create({
        data:{
            user_id_user : idUser,
            created_at : new Date(),
            status : 1,
            total_nilai : parseInt(totalPesan),
            detail_pemesanan : {
                create: dataPemesanan.map(item => ({
                    stok_id_stok : parseInt(item.stok_id_stok),
                    quantity :parseInt(item.quantity),
                    harga_sepatu:  parseInt(item.hargaSepatu),
                    subtotal :parseInt(item.quantity) * parseInt(item.hargaSepatu)
                }))
                
            }
        },
        include : {
            detail_pemesanan : true
        }
    })
    
    res.status(201).json({data: pemesanan, message: "Pemesanan Added"})
   } catch (error) {
    console.log(error)
     res.status(500).json({error : error.message})
   }
}

export {
    indexPemesanan,
    pemesananStore
}