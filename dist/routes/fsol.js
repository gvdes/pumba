"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ping_1 = require("../controllers/ping");
const clientsCont_1 = require("../controllers/clientsCont");
const router = (0, express_1.Router)();
router.get('/ping', ping_1.PING);
router.post('/sync/clients', clientsCont_1.SYNC);
exports.default = router;
//# sourceMappingURL=fsol.js.map