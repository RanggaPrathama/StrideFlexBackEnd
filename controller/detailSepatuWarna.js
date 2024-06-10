import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getDetailBySepatu = async (req,res) => {
    try {
        // if(!id_shoes){
        //     res.status(500).json({message:"Error No Value Id Shoes"})
    
        let id_shoes = req.params.id_shoes
        const detail = await prisma.$queryRaw ` 
        select sv.id_sepatu,ds.idDetail_sepatu, ds.warna, sg.gambar_sepatu
        from sepatu_version sv
        join detail_sepatu ds on ds.sepatu_id_sepatu = sv.id_sepatu
        join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = ds.idDetail_sepatu
        where ds.sepatu_id_sepatu = ${id_shoes}
        group by ds.idDetail_sepatu, ds.warna
        `
        // console.log(detail)

        // detail.forEach(item => {
        //     console.log(item.nama_warna)
        // });

        res.status(200).json({data : detail, status : "Data Detail berhasil diload"})    
    } catch (error) {
        res.status(500).json({error : error.message, status: "Internal Server Error"})
    }
    
    
}



const getDetailBySepatuQuery = async (req,res) => {
    try {
        // if(!id_shoes){
        //     res.status(500).json({message:"Error No Value Id Shoes"})
    
        let id_shoes = req.params.id_shoes
        const detail = await prisma.$queryRaw ` 
        select ds.idDetail_sepatu, s.nama_sepatu, s.deskripsi_sepatu, ds.harga_sepatu
        from detail_sepatu ds
        join sepatu s on s.id_sepatu = ds.sepatu_id_sepatu
        join sepatu_gambar sg on sg.sepatu_id_sepatu = s.id_sepatu 
        where s.id_sepatu = ${id_shoes} 
        group by ds.idDetail_sepatu`
        // console.log(detail)

        // detail.forEach(item => {
        //     console.log(item.nama_warna)
        // });

        res.status(200).json({data : detail, status : "Data Detail berhasil diload"})    
    } catch (error) {
        res.status(500).json({error : error.message, status: "Internal Server Error"})
    }
    
    
}



const createDetail = async (req,res) => {
    try {
        const {warna_id_warna, sepatu_id_sepatu, ukuran_id_ukuran,harga_sepatu, stok} = req.body
        const detail = await prisma.detail_sepatu.create({
            data:{
                warna_id_warna: parseInt(warna_id_warna),
                sepatu_id_sepatu: parseInt(sepatu_id_sepatu) ,
                ukuran_id_ukuran: parseInt(ukuran_id_ukuran),
                harga_sepatu : parseInt(harga_sepatu),
                stok: parseInt(stok)
            }
        })

        res.status(201).json({data : detail, status : "Success Created"})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}


export { 
    getDetailBySepatu,
    createDetail
}