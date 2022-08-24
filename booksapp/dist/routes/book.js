"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const booksController_1 = require("../controller/booksController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
router.get('/', booksController_1.getBooks);
router.get('/:id', booksController_1.getSingleBook);
router.post('/create', auth_1.verifyToken, booksController_1.create_books);
router.put('/update/:id', auth_1.verifyToken, booksController_1.updateBook);
router.delete('/delete/:id', auth_1.verifyToken, booksController_1.deleteBook);
exports.default = router;
