const mongoose = require('mongoose');
const User = mongoose.model('User');

function index(req, res, next) {
    User.find({ role: 0 })
        .select('-password -saltSecret')
        .then(resp => {
            res.json({ status: true, data: resp, error: null });
        }).catch(err => {
            next(err);
        });
}

function store(req, res, next) {
    const { fullName, email, password } = req.body;

    var userData = {
        fullName,
        email,
        password
    };

    User.create(userData)
        .then(resp => {
            res.json({ status: true, error: null });
        }).catch(err => {
            next(err);
        });
}

function show(req, res, next) {
    User.findById(req.params.id)
        .then(resp => {
            res.json({ status: true, data: resp, error: null });
        })
        .catch(error => {
            next(err);
        });
}

function update(req, res, next) {
    const { fullName, email, password } = req.body;

    var userData = {
        fullName,
        email,
        password
    };

    if (!!password && password.replace(/\s/g,"") == "") {
        delete userData.password;
    }

    User.updateOne(
        { _id: mongoose.Types.ObjectId(req.params.id) },
        { $set: userData })
        .exec()
        .then(resp => {
            res.json({ status: true, error: null });
        }).catch(err => {
            next(err);
        });
}

function destroy(req, res, next) {
    User.findByIdAndDelete(req.params.userId)
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
    store,
    show,
    update,
    destroy
}
