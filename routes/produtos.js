const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const ProductController = require('../controllers/products-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb){
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get('/', ProductController.getProducts);

router.post('/', upload.single('productImage'), login.required, ProductController.postProducts); 

router.get('/:id_produto', ProductController.getOneProduct);

router.patch('/', login.required, ProductController.patchProduct);


router.delete('/', login.required, ProductController.deleteProduct);

module.exports = router;
