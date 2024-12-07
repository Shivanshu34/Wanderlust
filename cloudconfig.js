const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const timestamp = Math.floor(Date.now() / 1000);
        const fileName = file?.originalname?.split('.')[0] || 'default';
        return {
            folder: 'wanderlust_DEV',
            public_id: `${timestamp}-${fileName}`,
            allowed_formats: ['png', 'jpg', 'jpeg'],
        };
    },
});

module.exports={
    cloudinary,
    storage,
};