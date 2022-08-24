"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorController_1 = require("../controller/authorController");
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
/* GET users listing. */
router.get('/logout', authorController_1.logoutAuthor);
router.get('/', authorController_1.getAuthors);
router.get('/:id', authorController_1.getSingleAuthor);
router.post('/signup', authorController_1.createAuthor);
router.post('/login', authorController_1.loginAuthor);
router.put('/update', auth_1.verifyToken, authorController_1.updateAuthor);
router.delete('/delete', auth_1.verifyToken, authorController_1.deleteAccount);
exports.default = router;
