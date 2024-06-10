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
}).array('files',5)


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
        select sv.id_sepatu,ds.idDetail_sepatu,sv.nama_sepatu, ds.warna ,ds.harga_sepatu, sv.deskripsi_sepatu, sg.gambar_sepatu, sg.url_gambar
        from sepatu_version sv
        join detail_sepatu ds on ds.sepatu_id_sepatu = sv.id_sepatu
        join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = ds.idDetail_sepatu
        group by sv.id_sepatu
        LIMIT 8;`
        res.status(200).json({data: shoes, message: "Shoes Berhasil DiLoad !"});   
    } catch (error) {
        res.status(400).json({error: error.message});
    }
    
    
}

const shoesDetailByID = async (req,res) => {
    try {
        let idSepatuVersion = req.query.id_sepatu
        let id_detail = req.query.id_detail

        const Shoes = await prisma.$queryRaw`
        select ds.sepatu_id_sepatu as id_sepatu,ds.harga_sepatu, ds.idDetail_sepatu ,sv.nama_sepatu ,sv.deskripsi_sepatu,ds.warna, sg.gambar_sepatu
        from detail_sepatu ds
        join sepatu_version sv on sv.id_sepatu = ds.sepatu_id_sepatu
        join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = ds.idDetail_sepatu
        where ds.sepatu_id_sepatu = ${idSepatuVersion} and ds.idDetail_sepatu = ${id_detail};
        `
        res.status(200).json({data: Shoes, message: "Shoes Berhasil DiLoad !"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const shoesDetailByIdVersion = async (req,res) =>{
    try {
        let idSepatuVersion = req.params.id_sepatu
        const Shoes = await prisma.$queryRaw`
        select sv.id_sepatu, sv.nama_sepatu, ds.idDetail_sepatu,ds.warna, ds.harga_sepatu, sg.gambar_sepatu
        from sepatu_version sv
        join detail_sepatu ds on ds.sepatu_id_sepatu = sv.id_sepatu
        join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = ds.idDetail_sepatu
        where ds.sepatu_id_sepatu = 1
        group by ds.idDetail_sepatu, ds.warna;`
        res.status(200).json({data: Shoes, message: "Shoes Berhasil DiLoad !"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const createShoesVersion = async (req,res) => {
 try {
    const shoesVersion = await prisma.sepatu_version.create({
        data:{
            nama_sepatu: req.body.nama_sepatu,
            brand_id_brand: parseInt(req.body.id_brand),
            kategori_id_kategori : parseInt(req.body.id_kategori),
            jenis_kelamin: parseInt(req.body.jenis_kelamin),
            deskripsi_sepatu: req.body.deskripsi_sepatu
        }
    }
        
    )
    res.status(201).json({data: shoesVersion, status: "Success Created"})
 } catch (error) {
    res.status(500).json({error: error.message})
 }
}


/* ============== TAB BAR ================*/
const getShoesByGender = async (req,res) =>{
    try {
            const idBrand = req.params.idBrand;
            const jenisKelamin = req.params.jenisKelamin;
            const shoes = await prisma.$queryRaw`
                select sv.id_sepatu,sv.nama_sepatu, ds.idDetail_sepatu, ds.harga_sepatu, sg.gambar_sepatu
                from sepatu_version sv
                join detail_sepatu ds on ds.sepatu_id_sepatu = sv.id_sepatu
                join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = ds.idDetail_sepatu
                where sv.brand_id_brand = ${idBrand} and sv.jenis_kelamin = ${jenisKelamin} 
                group by sv.id_sepatu;
            `
            res.status(200).json({data: shoes, message: "Shoes with Gender Berhasil DiLoad !"});
    } catch (error) {
            res.status(500).json({error: error.message});
    }
}

const createShoes = async (req, res) => {
    try {
        upload(req, res, async (error) => {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.messsage });
            } else if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newShoes = await prisma.detail_sepatu.create({
                data: {
                    sepatu_id_sepatu: parseInt(req.body.sepatu_id_sepatu),
                    harga_sepatu: parseInt(req.body.harga_sepatu),
                    warna: req.body.warna,
                },
            });

            const id_detail = newShoes.idDetail_sepatu
            for (const file of req.files) {
                const urlGambar = `${req.protocol}://${req.get("host")}/images/shoes/${file.filename}`
                const gambar = await prisma.sepatu_gambar.create({
                    data: {
                        detail_sepatu_idDetail_sepatu: id_detail,
                        gambar_sepatu: file.filename,
                        url_gambar: urlGambar,
                    },
                });
                console.log(gambar);
            }

            res.status(201).json({ data: newShoes, status: "success" });
        });
    } catch (error) {
        res.status(400).json({ error: error.message, errorstatus: error.status });
    }
};


const createStockDetail = async (req,res) =>{
    try{
    const stock = await prisma.stok.create({
        data:{
            detail_sepatu_idDetail_sepatu: parseInt(req.body.idDetail_sepatu),
            stock: parseInt(req.body.stock),
            ukuran_id_ukuran: parseInt(req.body.id_ukuran),

        }
    })

    res.status(201).json({data: stock, status: "Success Created"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


const updateBrand = async (req,res)=>{

}

const getShoesByIdBrand = async(req,res)=>{
    try {
        const id_brand = req.params.id_brand
        const shoes = await prisma.$queryRaw`
        select sv.id_sepatu,sv.nama_sepatu, ds.idDetail_sepatu, ds.harga_sepatu, sg.gambar_sepatu, ds.warna
        from sepatu_version sv
        join detail_sepatu ds on ds.sepatu_id_sepatu = sv.id_sepatu
        join sepatu_gambar sg on sg.detail_sepatu_idDetail_sepatu = ds.idDetail_sepatu
        where sv.brand_id_brand = ${id_brand}
        group by sv.id_sepatu;
        `
        // const Shoes  = await prisma.sepatu.findMany({
        //     where:{
        //         brand_id_brand: parseInt(req.params.id_brand)
        //     }
        // })
        res.status(200).json({data: shoes, message: "Berhasil !"});   
    } catch (error) {
        res.status(400).json({error: error.message, errorstatus: error.status});
    }
}

const getShoesByQuerynama = async (req, res) => {
    try {
        const nama_sepatu = req.query.nama_sepatu; 
        console.log(nama_sepatu);
        const Shoes = await prisma.$queryRaw` 
            select sv.id_sepatu,ds.idDetail_sepatu, ds.warna, sv.nama_sepatu 
            from sepatu_version sv
            join detail_sepatu ds on ds.sepatu_id_sepatu = sv.id_sepatu
            
            where upper(sv.nama_sepatu) like upper(CONCAT('%',${nama_sepatu},'%')) OR upper(ds.warna) like upper(CONCAT('%',${nama_sepatu},'%'))`; 
        
        res.status(200).json({data:Shoes, message:"Shoes Berhasil di Load !"}); 
    } catch (error) {
        console.error("Error:", error); // Tangani error
        res.status(500).json({error: error.message ,error: "Internal Server Error" }); // Kirim response error jika terjadi kesalahan
    }
}



export{
    indexShoes,
    createShoes,
    tesApi,
    getShoesByIdBrand,
    createShoesVersion,
    createStockDetail,
    shoesDetailByID,
    shoesDetailByIdVersion,
    getShoesByQuerynama,    
    getShoesByGender 
}