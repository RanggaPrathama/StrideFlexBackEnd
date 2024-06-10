import { PrismaClient } from '@prisma/client'
import multer, { MulterError } from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient()
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'images/brand')
    },
    filename : (req,file,cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null,uniqueName)
    }
}
  
)

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb ) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg+xml'){
            cb(null,true)
        }else{
            cb(null,false)
            return cb(new Error('Invalid mimetype  '))
        }
    }
}).single('file');


const indexBrand = async (req,res) => {
    try {
        // const Brand = await prisma.brand.findMany();
        const Brand = await prisma.$queryRaw`
        select b.id_brand, b.nama_brand, b.gambar_brand, CAST(COUNT(ds.sepatu_id_sepatu) AS CHAR) AS total_sepatu
        FROM brand b
        LEFT JOIN sepatu_version sv ON b.id_brand = sv.brand_id_brand
        LEFT JOIN detail_sepatu ds ON sv.id_sepatu = ds.sepatu_id_sepatu
        GROUP BY b.id_brand, b.nama_brand;
        `
        res.status(200).json({data: Brand, message: 'Brand Berhasil diload '}); 
        //res.render('brand',{brand : Brand});    
    } catch (error) {
        res.status(500).json({message: error.message});
    }
   
}

const storeBrand = async (req, res) => {
    
    try {        
        upload(req, res, async (error) => {
            if (error instanceof MulterError) {
                return res.status(400).json({ message: error.message, status: error.status});
            } else if (error) {
                return res.status(500).json({ message: error.message, status: error.status});
            }

            try {
                // const cekImage = `/images/${req.file.filename}`;
                // console.log(cekImage)
                // if(cekImage){
                //     fs.unlinkSync(cekImage);
                //     return res.status(400).json({ message: 'Gambar sudah terdaftar', status: 400});
                // }
                const cekNamebrand = await prisma.brand.findFirst({
                    where: {
                        nama_brand: req.body.nama_brand
                    }
                })
                if (cekNamebrand) {
                    return res.status(400).json({ message: 'Nama Brand sudah terdaftar', status: 400});
                }

                const url = `${req.protocol}://${req.get('host')}/images/brand/${req.file.filename}`;
                console.log(url);
                const brand = await prisma.brand.create({
                    data: {
                        nama_brand: req.body.nama_brand,
                        gambar_brand: req.file.filename,
                        url_gambar : url
                    }
                });
                res.status(201).json({ brand: brand, message: 'Brand created successfully' });
            } catch (error) {
                return res.status(500).json({ message: error.message, status: error.status});
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: error.status});
    }
}


export {
    indexBrand,
    storeBrand
} ;