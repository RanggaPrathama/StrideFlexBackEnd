import routerBrand from "./brandRoute.js"
import routerShoes from "./shoesRoute.js"
import routerKategori from "./kategoriRoute.js"
import routerColor from "./colorRoute.js"
import routerDetail from "./detailRoute.js"
import routerUkuran from './ukuranRoute.js'
import routeAuth from "./authRoute.js"
import routerCart from "./cartRoute.js"
import routerWishList from "./wishListRoute.js"
import routeUser from "./userRoute.js"
import routePemesanan from "./pemesananRoute.js"
import routerOngkir from "./ongkirRoute.js"
import routePayment from "./paymetRoute.js"
import routerPembayaran from "./pembayaranRoute.js"


const route = function(app){
    app.use('/brand', routerBrand)
    app.use('/shoes', routerShoes)
    app.use('/kategori',routerKategori)
    app.use('/color', routerColor)
    app.use('/detail', routerDetail)
    app.use('/ukuran',routerUkuran)
    app.use(routeAuth)
    app.use(routerCart)
    app.use(routerWishList)
    app.use(routeUser)
    app.use(routePemesanan)
    app.use(routerOngkir)
    app.use(routePayment)
    app.use(routerPembayaran)
}

export default route;