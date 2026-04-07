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
exports.SYNCPRODFAMS = void 0;
const node_adodb_1 = __importDefault(require("node-adodb"));
const fsol = node_adodb_1.default.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`); // abrir conexion a factusol
const SYNCPRODFAMS = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    console.time("timeexe");
    const newrows = req.body.rows; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    console.log("vamo a familiarizar!!");
    const resume = { goals: [], fails: [] };
    console.log("Filas a insertar:", newrows.length);
    try {
        console.log("Eliminando familiarizaciones...");
        try {
            for (var _g = true, newrows_1 = __asyncValues(newrows), newrows_1_1; newrows_1_1 = yield newrows_1.next(), _a = newrows_1_1.done, !_a; _g = true) {
                _c = newrows_1_1.value;
                _g = false;
                const row = _c;
                let dquery = `DELETE FROM F_EAN WHERE ARTEAN="${row.ARTEAN}";`;
                yield fsol.execute(dquery);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_g && !_a && (_b = newrows_1.return)) yield _b.call(newrows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        console.log("Familiarizando...");
        try {
            for (var _h = true, newrows_2 = __asyncValues(newrows), newrows_2_1; newrows_2_1 = yield newrows_2.next(), _d = newrows_2_1.done, !_d; _h = true) {
                _f = newrows_2_1.value;
                _h = false;
                const row = _f;
                let iquery = `INSERT INTO F_EAN(ARTEAN,EANEAN) VALUES("${row.ARTEAN}","${row.EANEAN}");`;
                yield fsol.execute(iquery);
                const res = `${row.ARTEAN} ==> Ok!!!`;
                console.log(res);
                resume.goals.push(res);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_h && !_d && (_e = newrows_2.return)) yield _e.call(newrows_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        resp.json(resume);
    }
    catch (error) {
        console.log(error);
        resp.json({ msg: error });
    }
    console.timeEnd("timeexe");
});
exports.SYNCPRODFAMS = SYNCPRODFAMS;
//# sourceMappingURL=familiarizationsCont.js.map