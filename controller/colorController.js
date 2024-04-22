import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient()

const getColor = async (req,res) => {
    try {
        const color = await prisma.warna.findMany()
        res.status(200).json({color: color, message: "color Berhasil diload"});
    } catch (error) {
        res.status(400).json({error: error.message, errorstatus: error.status});
    }

}

const createColor = async (req,res) =>{
    try {
        const color = await prisma.warna.create({
            data: {
                nama_warna: req.body.nama_warna,
                tag_warna: req.body.tag_warna
            }
        })
        res.status(201).json({color: color, message: 'Created color successfully'});
    } catch (error) {
        res.status(400).json({error: error.message, errorstatus: error.status});
    }
}

export { 
    getColor,
    createColor
}