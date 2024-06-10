import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient

const getOngkir = async (req,res) =>{
    try {
        
        const ongkir = await prisma.jenis_ongkir.findMany()

        res.status(200).json({ongkir: ongkir, message: 'Ongkir Berhasil diload '});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

const getOngkirByid = async (req,res) => {
    try {
        const {idOngkir}  = req.params
        const ongkir = await prisma.jenis_ongkir.findFirst({
            where :{
                id_ongkir : parseInt(idOngkir)
            }
        })

        res.status(200).json({ongkir: ongkir, message: 'Ongkir Berhasil diload '});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const storeOngkir = async(req,res) =>{
    try {
        const {namaOngkir, hargaOngkir} = req.body
        const ongkir = await prisma.jenis_ongkir.create({
            data:{
                nama_ongkir : namaOngkir,
                harga_ongkir : parseInt(hargaOngkir),
                status : 1
            }
        })

        res.status(201).json({ongkir: ongkir, message: 'Created ongkir successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}



export {
    getOngkir,
    getOngkirByid,
    storeOngkir
}