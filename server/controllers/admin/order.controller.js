const mongoose = require('mongoose');
const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const nodemailer = require("nodemailer");

function index(req, res, next) {
    Order.find({}).then(resp => {
        res.json({ status: true, data: resp, error: null });
    }).catch(err => {
        next(err);
    });
}

function show(req, res, next) {
    Order.findById(req.params.orderId)
        .then(resp => {
            res.json({ status: true, data: resp, error: null });
        })
        .catch(error => {
            next(err);
        });
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user:  "apolloenglish15@gmail.com",
      pass: "Anhtruyen1502"
    }
});

function confirm(req, res, next) {
    const userId = req.params.userId;
    Order.updateOne(
        { _id: mongoose.Types.ObjectId(req.params.orderId) },
        { $set: { status: process.env.STATUS_SUCCESS } })
    .exec()
    .then(resp => {
        User.findById(userId)
        .then(user => {
            Order.findById(req.params.orderId)
            .then(order => {
                
                let productContents = ``;
                for(i = 0; i < order.products.length; i++){
                    let product = order.products[i].product;
                    productContents += `${product.name} Link: ` + product.link + `<br>`;
                }
                console.log(productContents);
                let mailOptions = {
                    from: '"APOLLO ENGLISH"<example.gimail.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "TRUNG TÂM APOLLO ENGLISH XIN CHÀO", // Subject line
                    html: `
                    <h1>Xin chào ${user.fullName}</h1><br>
                    Cám ơn bạn vì đã quan tâm đến khóa học của chúng tôi.<br>
                    Chúng tôi xin gửi bạn khóa học.<br> 
                    Để tải khóa học về vui lòng truy cập vào đường link: <br>`
                    + productContents + 
                    `<h3>Xin chân thành cám ơn!!</h3> `
                };
                transporter.sendMail(mailOptions).then(resp => {
                    res.json({ status: true, error: null });
                }).catch(e => {
                    res.json(e);
                })
            })
            
        })
        .catch(err => {
            next(err);
        });

    }).catch(err => {
        next(err);
    });
}


function destroy(req, res, next) {
    Order.findByIdAndDelete(req.params.orderId)
        .then(resp => {
            if (!!resp) {
                res.json({ status: true, error: null });
            } else {
                res.json({ status: false, error: resp });
            }
        }).catch(err => {
            next(err);
        })
}

module.exports = {
    index,
    show,
    confirm,
    destroy
}
