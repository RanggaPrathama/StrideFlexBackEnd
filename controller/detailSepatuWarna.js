import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getDetailBySepatu = async (req,res) => {
    try {
        let id_shoes = req.params.id_shoes
        const detail = await prisma.$queryRaw ` 
        SELECT de.idDetail_sepatu, s.nama_sepatu, s.deskripsi_sepatu, de.harga_sepatu, w.nama_warna, u.nomor_ukuran
        FROM detail_sepatu de
        JOIN sepatu s ON s.id_sepatu = de.sepatu_id_sepatu
        JOIN warna w ON w.id_warna = de.warna_id_warna
        JOIN ukuran u ON u.id_ukuran = de.ukuran_id_ukuran
        WHERE s.id_sepatu = ${id_shoes}`
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