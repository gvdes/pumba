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
const fs = require('fs');
const node_adodb_1 = __importDefault(require("node-adodb"));
const moment_1 = __importDefault(require("moment"));
const vizapi_1 = __importDefault(require("../db/vizapi"));
const SIMBA = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const hourstart = (0, moment_1.default)('08:55:00', 'hh:mm:ss');
    const hourend = (0, moment_1.default)('22:00:00', 'hh:mm:ss');
    const now = (0, moment_1.default)();
    const nday = (0, moment_1.default)().format("d");
    if ((nday != 7) && (now.isBetween(hourstart, hourend))) { // activar cuando no es temporada
        // if( now.isBetween(hourstart,hourend) ){
        console.log("Simba a iniciado...");
        try {
            const fsol = node_adodb_1.default.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);
            const workpoint = JSON.parse((process.env.WORKPOINT || ""));
            console.time('t1');
            const simbainit = `[${(0, moment_1.default)().format("YYYY/MM/DD hh:mm:ss")}]: Simba ha iniciado...`;
            console.log(`\n${simbainit}`);
            let rset = [];
            const rows = yield fsol.query(`
                SELECT
                    F_ART.CODART AS CODIGO,
                    SUM(IIF(F_STO.ALMSTO = "GEN", F_STO.ACTSTO , 0)) AS GENSTOCK,
                    SUM(IIF(F_STO.ALMSTO = "DES", F_STO.ACTSTO , 0)) AS DESSTOCK,
                    SUM(IIF(F_STO.ALMSTO = "EXH", F_STO.ACTSTO , 0)) AS EXHSTOCK,
                    SUM(IIF(F_STO.ALMSTO = "FDT", F_STO.ACTSTO , 0)) AS FDTSTOCK,
                    SUM(IIF(F_STO.ALMSTO = "GEN", F_STO.ACTSTO , 0)  + IIF(F_STO.ALMSTO = "EXH", F_STO.ACTSTO , 0) ) AS STOCK
                FROM F_ART
                    INNER JOIN F_STO ON F_STO.ARTSTO = F_ART.CODART
                GROUP BY F_ART.CODART
            `);
            if (rows.length) {
                console.log("Syncronizando ALMACENES...");
                console.log(rows.length, "filas");
                try {
                    for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                        const row = rows_1_1.value;
                        const [results] = yield vizapi_1.default.query(`
                        UPDATE product_stock STO
                            INNER JOIN products P ON P.id = STO._product
                            INNER JOIN workpoints W ON W.id = STO._workpoint
                        SET
                            STO.stock="${row.STOCK}",
                            STO.exh="${row.EXHSTOCK}",
                            STO.gen="${row.GENSTOCK}",
                            STO.fdt="${row.FDTSTOCK}",
                            STO.des="${row.DESSTOCK}"
                        WHERE
                            P.code="${row.CODIGO}" AND W.id="${workpoint.id}";
                    `);
                        if (results.changedRows > 0) {
                            rset.push({ code: row.CODIGO });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            console.log("FILAS TOTALES:", rows.length);
            console.log("UPDATEDS:", rset.length);
            console.timeEnd('t1');
            const _tend = (0, moment_1.default)();
            console.log(`[${_tend.format("hh:mm:ss")}]: Simba ha finalizado, siguiente vuelta en 10 segundos...`);
            setTimeout(() => { (0, exports.SIMBA)(); }, 10000);
        }
        catch (error) {
            console.timeEnd('t1');
            console.error(error);
            console.log("Simba tuvo un error de jecucion, nuevo intento en 10 segundos...");
            setTimeout(() => { (0, exports.SIMBA)(); }, 10000);
        }
    }
    else {
        setTimeout(() => { (0, exports.SIMBA)(); }, 300000);
    }
});
exports.SIMBA = SIMBA;
//# sourceMappingURL=simba.js.map