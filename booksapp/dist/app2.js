"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// catch error
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// resolve path
const path_1 = __importDefault(require("path"));
// for catching cookies
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// for showing response status on the console
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = require("./middleware/auth");
// Router import
const viewsRoute_1 = __importDefault(require("./routes/viewsRoute"));
const book_1 = __importDefault(require("./routes/book"));
const authors_1 = __importDefault(require("./routes/authors"));
mongoose_1.default.connect('mongodb://localhost:27017/booksapp').then();
// {force:true}
// db.sync().then(()=>{
//   console.log('Database Connected Successfully');
// }).catch(error=>{
//   console.log(error);
// })
// Live reload for eje template 
const livereload_1 = __importDefault(require("livereload"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const liveReloadServer = livereload_1.default.createServer();
liveReloadServer.watch(path_1.default.join(__dirname, "..", "public"));
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
const app = (0, express_1.default)();
app.use((0, connect_livereload_1.default)());
// view engine setup
app.set("views", path_1.default.join(__dirname, "..", "views"));
app.set("view engine", "ejs");
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join("public")));
// base route
app.get('*', auth_1.checkUser);
app.use("/", viewsRoute_1.default);
app.use("/books", book_1.default);
app.use("/author", authors_1.default);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
