"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fsol_1 = __importDefault(require("../routes/fsol"));
class Server {
    constructor() {
        this.paths = {
            fsol: '/fsol'
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "4400";
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express_1.default.json());
    }
    routes() {
        this.app.use(this.paths.fsol, fsol_1.default);
    }
    run() {
        this.app.listen(this.port, () => {
            console.log("Server running on", this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map