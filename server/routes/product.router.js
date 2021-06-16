const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const fs = require('fs')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const path = require('path');
const baseURLImage = 'https://apolloenglish.herokuapp.com/uploads';
router.get('/listproducts', async (req, res, next) => {
	try {
		let listProducts = await Product.find({});
		res.json(listProducts);
	} catch(e) {
		console.log(e)
	}
})


// SET STORAGE
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, Date.now()+'-'+file.originalname) 
	}
})

var upload = multer({storage: storage})

router.post('/create', upload.single('imageProduct'), async (req, res) => {
	try {
		console.log(req.file)

		const { name, author, description, price, link } = req.body;

		const imgProductUrl = `${baseURLImage}/${req.file.filename}`;
		
		let product =  new Product({
			name: name,
			author: author,
			description: description,
			price: price,
			link: link,
			imageUrl: imgProductUrl
		});
		await product.save();
		res.send(product)
		
		// console.log(path.join(path.normalize(`${__dirname}/../uploads/${req.file.filename}`).replace('\\', '/')))
		// res.sendFile(path.join(path.normalize(`${__dirname}/../uploads/${req.file.filename}`).replace('\\', '/')));
	} catch(e) {
		console.log(e)
	}
})

// router.get('/:productID', (req, res, next) => {
// 	fs.readFile('/path/to/an/image/directory/' + pic, function (err, content) {
//         if (err) {
//             res.writeHead(400, {'Content-type':'text/html'})
//             console.log(err);
//             res.end("No such image");    
//         } else {
//             //specify the content type in the response will be an image
//             res.writeHead(200,{'Content-type':'image/jpg'});
//             res.end(content);
//         }
//     });
// })

router.put('/:productId', upload.single('imageProduct') ,async (req, res) => {
	try {
		let product = await Product.findById(req.params.productId);
		if(!product) {
			res.send("Can't find Product");
		} else {
			const { name, author, description, price, link } = req.body;
			product.name = name;
			product.author = author;
			product.description = description;
			product.price = price;
			product.link = link;
			if(req.file) {
				let imgProductUrl = `${baseURLImage}/${req.file.filename}`;
				product.imageUrl = imgProductUrl;
			} 
			await product.save();
			res.send(product);
		}
	} catch(e) {
		console.log(e)
	}	
})

router.delete('/:productId', async (req, res) => {
	try {
		let product = await Product.findByIdAndDelete(req.params.productId);
		res.send({ message: "Delete Success!"})
	} catch(e) {
		res.send({ message: e})
	}
})


router.get('/:productId', async (req, res) => {
	try {
		let productId = req.params.productId;
		let product = await Product.findById(productId);
		res.send(product);
	} catch(e) {
		console.log(e)
	}
})

module.exports = router;