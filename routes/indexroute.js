import routerBrand from "./brandRoute.js"
import routerShoes from "./shoesRoute.js"
import routerKategori from "./kategoriRoute.js"
import routerColor from "./colorRoute.js"
import routerDetail from "./detailRoute.js"
import routerUkuran from './ukuranRoute.js'

const route = function(app){
    app.use('/brand', routerBrand)
    app.use('/shoes', routerShoes)
    app.use('/kategori',routerKategori)
    app.use('/color', routerColor)
    app.use('/detail', routerDetail)
    app.use('/ukuran',routerUkuran)
}

export default route;