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
exports.SIMBA = void 0;
const node_adodb_1 = __importDefault(require("node-adodb"));
const moment_1 = __importDefault(require("moment"));
const vizapi_1 = __importDefault(require("../db/vizapi"));
const fsol = node_adodb_1.default.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);
const SIMBA = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a, e_2, _b, e_3, _c;
    const hourstart = (0, moment_1.default)('08:55:00', 'hh:mm:ss');
    const hourend = (0, moment_1.default)('21:00:00', 'hh:mm:ss');
    const now = (0, moment_1.default)();
    const nday = (0, moment_1.default)().format("d");
    if ((nday != 7) && (now.isBetween(hourstart, hourend))) {
        const workpoint = JSON.parse((process.env.WORKPOINT || ""));
        console.time('t1');
        const simbainit = `[${(0, moment_1.default)().format("YYYY/MM/DD h:mm:ss")}]: Simba ha iniciado...`;
        console.log(`\n${simbainit}`);
        let WRHGEN = [], WRHEXH = [], WRHFDT = [];
        let rset = { GEN: [], EXH: [], DES: [], FDT: [] };
        const rows = yield fsol.query('SELECT ALMSTO,ARTSTO,ACTSTO FROM F_STO ORDER BY ARTSTO;');
        console.log(rows.length);
        WRHGEN = rows.filter(r => r.ALMSTO == "GEN");
        WRHEXH = rows.filter(r => r.ALMSTO == "EXH");
        WRHFDT = rows.filter(r => r.ALMSTO == "FDT");
        // WRHDES = rows.filter( r => r.ALMSTO=="DES");
        console.log("GEN", WRHGEN.length);
        console.log("EXB", WRHEXH.length);
        console.log("FDT", WRHFDT.length);
        console.log("WORKPOINT", workpoint.id);
        if (WRHGEN.length) {
            console.log("Syncronizando Almacen GENERAL...");
            try {
                for (var WRHGEN_1 = __asyncValues(WRHGEN), WRHGEN_1_1; WRHGEN_1_1 = yield WRHGEN_1.next(), !WRHGEN_1_1.done;) {
                    const row = WRHGEN_1_1.value;
                    const [results] = yield vizapi_1.default.query(`
                    UPDATE product_stock STO
                        INNER JOIN products P ON P.id = STO._product
                        INNER JOIN workpoints W ON W.id = STO._workpoint
                    SET gen=${row.ACTSTO}
                    WHERE P.code="${row.ARTSTO}" AND W.id="${workpoint.id}";
                `);
                    if (results.changedRows > 0) {
                        rset.GEN.push({ code: row.ARTSTO });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (WRHGEN_1_1 && !WRHGEN_1_1.done && (_a = WRHGEN_1.return)) yield _a.call(WRHGEN_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (WRHEXH.length) {
            console.log("Syncronizando Almacen EXHIBICION...");
            try {
                for (var WRHEXH_1 = __asyncValues(WRHEXH), WRHEXH_1_1; WRHEXH_1_1 = yield WRHEXH_1.next(), !WRHEXH_1_1.done;) {
                    const row = WRHEXH_1_1.value;
                    const [results] = yield vizapi_1.default.query(`
                    UPDATE product_stock STO
                        INNER JOIN products P ON P.id = STO._product
                        INNER JOIN workpoints W ON W.id = STO._workpoint
                    SET exh=${row.ACTSTO}
                    WHERE P.code="${row.ARTSTO}" AND W.id="${workpoint.id}";
                `);
                    if (results.changedRows > 0) {
                        rset.EXH.push({ code: row.ARTSTO });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (WRHEXH_1_1 && !WRHEXH_1_1.done && (_b = WRHEXH_1.return)) yield _b.call(WRHEXH_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (WRHFDT.length) {
            console.log("Syncronizando Almacen FIN DE TEMPORADA...");
            try {
                for (var WRHFDT_1 = __asyncValues(WRHFDT), WRHFDT_1_1; WRHFDT_1_1 = yield WRHFDT_1.next(), !WRHFDT_1_1.done;) {
                    const row = WRHFDT_1_1.value;
                    const [results] = yield vizapi_1.default.query(`
                    UPDATE product_stock STO
                        INNER JOIN products P ON P.id = STO._product
                        INNER JOIN workpoints W ON W.id = STO._workpoint
                    SET fdt=${row.ACTSTO}
                    WHERE P.code="${row.ARTSTO}" AND W.id="${workpoint.id}";
                `);
                    if (results.changedRows > 0) {
                        rset.FDT.push({ code: row.ARTSTO });
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (WRHFDT_1_1 && !WRHFDT_1_1.done && (_c = WRHFDT_1.return)) yield _c.call(WRHFDT_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        console.log("FILAS TOTALES:", (WRHGEN.length + WRHEXH.length + WRHFDT.length));
        console.log("ALMACEN GENERAL:", WRHGEN.length, "UPDATEDS:", rset.GEN.length);
        console.log("ALMACEN EXHIBICION:", WRHEXH.length, "UPDATEDS:", rset.EXH.length);
        console.log("ALMACEN FINDETEMPO:", WRHFDT.length, "UPDATEDS:", rset.FDT.length);
        const simbaends = `[${(0, moment_1.default)().format("YYYY/MM/DD h:mm:ss")}]: Simba ha finalizado.`;
        console.timeEnd('t1');
        console.log(`${simbaends}\n`);
    }
});
exports.SIMBA = SIMBA;
//# sourceMappingURL=simba.js.map