const app = require('./app');
const { connectMongoDB } = require('./configuration/database');
const cloudinary = require('cloudinary');
connectMongoDB();

cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

app.listen(process.env.PORT , ()=>{
    console.log(`Server is Connected on http://localhost:${process.env.PORT}`)
})