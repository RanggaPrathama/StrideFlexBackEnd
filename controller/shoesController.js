import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import sneaksApi from 'sneaks-api';
const prisma = new PrismaClient();

const sneaks = new sneaksApi();



const storage = multer.diskStorage({
    destination : (req,res, cb) => {
        cb(null,'images/shoes')
    },
    filename : (req,file,cb) =>{
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName)
    }
})

const upload = multer({
    storage : storage,
    fileFilter: (req, file, cb ) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg+xml'){
            cb(null,true)
        }else{
            cb(null,false)
            return cb(new Error('Invalid mimetype  '))
        }
    }
}).single('file')


const tesApi =  async (req,res) =>{   
    await sneaks.getProducts("Yeezy Cinder", 10, function(err, products){
    res.status(200).json({products: products});
})}



const indexShoes = async(req,res)=>{
    try {
        // const Shoes  = await prisma.sepatu.findMany({
        //     take: 8
        // }); 
        const shoes = await prisma.$queryRaw`
        SELECT s.id_sepatu, s.nama_sepatu, ds.harga_sepatu, s.jenis_kelamin, s.deskripsi_sepatu, s.gambar_sepatu
        FROM detail_sepatu ds
        JOIN sepatu s ON s.id_sepatu = ds.sepatu_id_sepatu
        GROUP BY s.id_sepatu, s.nama_sepatu
        LIMIT 8;
      `;
        res.status(200).json({data: shoes, message: "Shoes Berhasil DiLoad !"});   
    } catch (error) {
        res.status(400).json({error: error.message});
    }
    
    
}

const createShoes = async(req,res)=>{

    try {
        upload(req,res,async(error) => {
            if ( error instanceof Error){
                return res.status(400).json({error: error.messsage})
            }
            else if(error){
                return res.status(400).json({error: error.message})
            }

            const validasi = await prisma.sepatu.findFirst({
                where:{
                    nama_sepatu: req.body.nama_sepatu
                }
            })

            if(validasi){
                return res.status(400).json({message: 'Nama sepatu sudah terdaftar', status: 400})
            }
          
            
            const urlGambar = `${req.protocol}://${req.get('host')}/images/shoes/${req.file.filename}`
            const Shoes = await prisma.sepatu.create({
                data: {
                    nama_sepatu: req.body.nama_sepatu,
                    brand_id_brand: parseInt(req.body.id_brand)  ,
                    jenis_kelamin: parseInt(req.body.jenis_kelamin),
                    deskripsi_sepatu: req.body.deskripsi,
                    kategori_id_kategori : parseInt(req.body.id_kategori),
                    gambar_sepatu: req.file.filename,
                    url_gambar : urlGambar
                }
            })

            res.status(201).json({data: Shoes, status: 'success'})
        })
       
    } catch (error) {
        res.status(400).json({error: error.message, errorstatus: error.status});
    }
}

const updateBrand = async (req,res)=>{

}

const getShoesByIdBrand = async(req,res)=>{
    try {
        const Shoes  = await prisma.sepatu.findMany({
            where:{
                brand_id_brand: parseInt(req.params.id_brand)
            }
        })
        res.status(200).json({data: Shoes, message: "Berhasil !"});   
    } catch (error) {
        res.status(400).json({error: error.message, errorstatus: error.status});
    }
}

export{
    indexShoes,
    createShoes,
    tesApi,
    getShoesByIdBrand
}