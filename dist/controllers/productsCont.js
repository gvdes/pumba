"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYNCPRODUCTS = void 0;
const node_adodb_1 = __importDefault(require("node-adodb"));
const fsol = node_adodb_1.default.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`); // abrir conexion a factusol
const SYNCPRODUCTS = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const body = req.body;
    const products = body.rsetprods;
    const prices = body.rsetprices;
    try {
        for (var products_1 = __asyncValues(products), products_1_1; products_1_1 = yield products_1.next(), !products_1_1.done;) {
            const product = products_1_1.value;
            console.log(product.CODART);
            const qexists = yield fsol.query(`SELECT COUNT(*) as EXISTE FROM F_ART WHERE CODART="${product.CODART}";`);
            console.log(qexists);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (products_1_1 && !products_1_1.done && (_a = products_1.return)) yield _a.call(products_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // console.log(products);
    resp.json({ msg: "Working!...", productos: products.length, prices: prices.length });
});
exports.SYNCPRODUCTS = SYNCPRODUCTS;
//# sourceMappingURL=productsCont.js.map