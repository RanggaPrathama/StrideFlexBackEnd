import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const getUkuran = async (req,res) => {
    try {
        const ukuran = await prisma.ukuran.findMany()
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
    getUkuran,
    createUkuran
}