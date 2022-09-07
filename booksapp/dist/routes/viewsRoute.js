"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booksController_1 = require("../controller/booksController");
const authorsController_1 = require("../controller/authorsController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/* GET home page. */
// res.render('index', { title: 'Express' });
router.get('/', booksController_1.getBooks);
router.get('/admin', auth_1.verifyToken, authorsController_1.adminData);
router.get('/signup', (req, res) => {
    if (req.cookies.authorized) {
        return res.redirect('/admin');
    }
    res.render('signup', { title: 'signup' });
});
router.get('/login', (req, res) => {
    if (req.cookies.authorized) {
        return res.redirect('/admin');
    }
    res.render('login', { title: 'login' });
});
// router.get('/book/:id')
router.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: "Author's Page" });
});
exports.default = router;
