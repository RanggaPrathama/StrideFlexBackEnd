import  express  from "express";
import dotenv from "dotenv";
import cors from "cors";
// import router from "./routes/brandRoute.js";
import route from "./routes/indexroute.js"



dotenv.config();
const port = process.env.port;
const app = express();
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());



app.use('/images', express.static('images'));
// app.use(router);
route(app)


app.get('/', (req,res)=>{
    res.send('Hello World! Tes oi')
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});