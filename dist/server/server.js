"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const fsol_1 = __importDefault(require("../routes/fsol"));
const simba_1 = require("../db/simba");
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
        // this.app.use(express.json());
        this.app.use(express_1.default.json({ limit: '50mb' }));
        this.app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
    }
    routes() {
        this.app.use(this.paths.fsol, fsol_1.default);
    }
    run() {
        this.app.listen(this.port, () => {
            console.log("Pumba running's on", this.port);
        });
        // SIMBA();
        let _t = (0, moment_1.default)().add(process.env.SIMBATIME, 'ms');
        console.log(`Simba iniciara a las ${_t.format("YYYY/MM/DD hh:mm:ss")}...`);
        let interval = (process.env.SIMBATIME || 120000);
        setInterval(() => { (0, simba_1.SIMBA)(); }, interval);
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map