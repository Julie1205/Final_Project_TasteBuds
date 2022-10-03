require("dotenv").config();
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET } = process.env;

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
})

const deleteImage = async (req, res) => {
    const { public_id } = req.body;

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        if(result.result === "ok") {
            res.status(201).json( { status: 201, data: result } )
        }
        else {
            res.status(400).json( { status: 400, data: public_id, message: "Unable to delete image" } )
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json( { status: 500, message: "Unable to delete image" } );
    }
};

module.exports = { deleteImage };