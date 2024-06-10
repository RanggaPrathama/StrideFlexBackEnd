import  { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()


const indexCart = async (req,res) => {
    try {
        
        let id_user = req.params.id_user
        const cart = await prisma.$queryRaw`
        select  c.id_cart,c.stok_id_stok, c.user_id_user,c.quantity, b.nama_brand,sv.nama_sepatu,ds.harga_sepatu,ds.warna, sg.gambar_sepatu, u.nomor_ukuran
        from cart c
        join stok s on s.id_stok = c.stok_id_stok
        join ukuran u on s.ukuran_id_ukuran = u.id_ukuran
        join detail_sepatu ds on ds.idDetail_sepatu = s.detail_sepatu_idDetail_sepatu
        join sepatu_version sv on sv.id_sepatu = ds.sepatu_id_sepatu
        join brand b on b.id_brand = sv.brand_id_brand
        join sepatu_gambar sg on ds.idDetail_sepatu = sg.detail_sepatu_idDetail_sepatu
        where c.user_id_user = ${id_user} AND c.status = 1
        group by c.id_cart, c.stok_id_stok;
        `

        res.status(200).json({data: cart, message: "Cart Berhasil DiLoad !"});
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


const createCart = async (req, res) => {
    try {
        // const stok = await prisma.$queryRaw`
        //     SELECT s.id_stok
        //     FROM stok s
        //     WHERE s.ukuran_id_ukuran = ${parseInt(req.body.id_ukuran)}
        //     AND s.detail_sepatu_idDetail_sepatu = ${parseInt(req.body.id_detail)}
        // `;

        // if (!stok || !stok.length) {
        //     return res.status(500).json({ message: 'Internal Server Error' });
        // }

        const cart = await prisma.cart.findFirst({
            where: {
                stok_id_stok: parseInt(req.body.id_stok),
                user_id_user: parseInt(req.body.id_user),
                status:1
            },
        });

        if (cart) {
            const updatedCart = await prisma.cart.update({
                where: { id_cart: cart.id_cart },
                data: { quantity: cart.quantity + 1 },
            });
            return res.status(200).json({ data: updatedCart, status: 'Success Updated' });
        } else {
            const newCart = await prisma.cart.create({
                data: {
                    user_id_user: parseInt(req.body.id_user),
                    stok_id_stok: parseInt(req.body.id_stok),
                    quantity: parseInt(1),
                },
            });
            return res.status(201).json({ data: newCart, status: 'Success Created' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const updateQuantity = async(req, res) => {
   try {
    const cart = await prisma.cart.update({
        where:{
            id_cart: parseInt(req.query.id_cart),
            user_id_user: parseInt(req.query.id_user) 
        },
        data:{
            quantity: parseInt(req.body.quantity)
        }
    } 
    )

    res.status(201).json({data: cart, message: "Cart Berhasil DiUpdate!"});
   } catch (error) {
        res.status(500).json({error : error.message});
   }
}

const deleteCart = async(req,res) =>{
    try {
        const cart = await prisma.cart.update({
            where:{
                id_cart: parseInt(req.query.id_cart),
                user_id_user: parseInt(req.query.id_user)
            },
            data:{
                status: 0,
                updated_at: new Date()
            }
        }   
        )
        res.status(201).json({data: cart, message: "Cart Berhasil DiHapus!"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


export{
    indexCart,
    createCart,
    updateQuantity,
    deleteCart
}