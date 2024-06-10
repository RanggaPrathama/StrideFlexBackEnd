import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const getUkuranByIdDetail = async (req,res) => {
    try {
        const id_detail = req.params.id_detail
        const ukuran = await prisma.$queryRaw`
        select s.id_stok, s.stock ,ds.sepatu_id_sepatu as id_sepatu, s.ukuran_id_ukuran as id_ukuran, s.detail_sepatu_idDetail_sepatu as id_detail , u.nomor_ukuran
        from stok s
        join ukuran u on u.id_ukuran = s.ukuran_id_ukuran
        join detail_sepatu ds on ds.idDetail_sepatu = s.detail_sepatu_idDetail_sepatu
        where ds.idDetail_sepatu = ${id_detail};
        `
        res.status(200).json({data: ukuran, message: 'Ukuran Berhasil diload '});     
    } catch (error) {
        res.status(500).json({error: error.message});
    }

}

const createUkuran = async (req,res) => {
    try {
        const ukuran = await prisma.ukuran.create({
            data:{
                nomor_ukuran : parseInt(req.body.nomor_ukuran) 
            }
        })
        res.status(201).json({data: ukuran, message: 'Ukuran Berhasil dibuat '});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export{
    getUkuranByIdDetail,
    createUkuran
}