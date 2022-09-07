"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorsController_1 = require("../controller/authorsController");
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
/* GET users listing. */
router.get('/authors', authorsController_1.getAuthors);
router.get('/logout', authorsController_1.logoutAuthor);
router.get('/', authorsController_1.getAuthors);
router.get('/:id', authorsController_1.getSingleAuthor);
router.post('/signup', authorsController_1.createAuthor);
router.post('/login', authorsController_1.loginAuthor);
router.put('/update', auth_1.verifyToken, authorsController_1.updateAuthor);
router.delete('/delete', auth_1.verifyToken, authorsController_1.deleteAccount);
exports.default = router;
