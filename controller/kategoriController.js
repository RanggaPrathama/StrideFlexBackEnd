import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const  getKategori = async (req,res) => {
    try {
        const kategori = await prisma.kategori_sepatu.findMany()
        res.status(200).json({data: kategori, message: 'Kategori Berhasil diload '});
    } catch (error) {
        res.status(500).json({error: error.message});
    }

    
}

const createKategori = async (req,res) =>{
    try {
        const kategori = await prisma.kategori_sepatu.create({
            data: {
                nama_kategori: req.body.nama_kategori
            }
        })
        res.status(200).json({data: kategori, message: 'Kategori Berhasil dibuat '});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


export {
    getKategori,
    createKategori
}