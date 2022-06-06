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
exports.SYNCAGENTS = void 0;
const node_adodb_1 = __importDefault(require("node-adodb"));
const moment_1 = __importDefault(require("moment"));
const fsol = node_adodb_1.default.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`); // abrir conexion a factusol
// interface IClientExists { exists:Boolean, code:String|null, client:Object|null, resume:String|null } // interface de la respuesta de la existencia o no de clientes
const SYNCAGENTS = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a, e_2, _b;
    const lsAgentes = req.body.rset_agentes; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    const lsDependientes = req.body.rset_dependientes; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    const destino = JSON.parse(process.env.WORKPOINT || "uknown");
    let resume = { destino, goals: [], fails: [] };
    if (lsAgentes.length || lsDependientes.length) {
        console.log("Sincronizando Agentes/Dependientes...", lsAgentes.length);
        try {
            for (var lsAgentes_1 = __asyncValues(lsAgentes), lsAgentes_1_1; lsAgentes_1_1 = yield lsAgentes_1.next(), !lsAgentes_1_1.done;) {
                const agent = lsAgentes_1_1.value;
                agent.FALAGE = (0, moment_1.default)(agent.FALAGE).format("YYYY/MM/DD");
                agent.FFOAGE = (0, moment_1.default)(agent.FFOAGE).format("YYYY/MM/DD");
                agent.FCCAGE = (0, moment_1.default)(agent.FCCAGE).format("YYYY/MM/DD");
                agent.FFCAGE = (0, moment_1.default)(agent.FFCAGE).format("YYYY/MM/DD");
                let clResume = `${agent.CODAGE}::${agent.NOMAGE}::${agent.FALAGE}`;
                let agvalues = JSON.stringify(Object.values(agent));
                let agents_rows = agvalues.substring(1, agvalues.length - 1);
                let q_age_del = `DELETE FROM F_AGE WHERE CODAGE=${agent.CODAGE};`;
                let q_age_ins = `INSERT INTO F_AGE (CODAGE,TEMAGE,ZONAGE,IMPAGE,COMAGE,TCOAGE,IVAAGE,IRPAGE,PIRAGE,FALAGE,FAXAGE,EMAAGE,WEBAGE,PAIAGE,PCOAGE,TEPAGE,CLAAGE,DNIAGE,RUTAGE,CUWAGE,CAWAGE,SUWAGE,MEWAGE,CPOAGE,PROAGE,ENTAGE,OFIAGE,DCOAGE,CUEAGE,BANAGE,LISAGE,CONAGE,DOMAGE,NOMAGE,NOCAGE,MEMAGE,OBSAGE,FORAGE,LFOAGE,FFOAGE,OFOAGE,UREAGE,CURAGE,URLAGE,CATAGE,FCCAGE,FFCAGE,PUNAGE,CVEAGE,CREAGE,PURAGE,JEQAGE,CSAAGE,AGJAGE,DMWAGE,FOTAGE,POBAGE,CTPAGE) VALUES (${agents_rows});`;
                let q_dep_del = `DELETE FROM T_DEP WHERE CODDEP=${agent.CODAGE};`;
                try {
                    const agdel = yield fsol.execute(q_age_del);
                    const depdel = yield fsol.execute(q_dep_del);
                    const agins = yield fsol.execute(q_age_ins);
                    clResume += ` ==> Done!!`;
                    console.log(clResume);
                    resume.goals.push(clResume);
                }
                catch (error) {
                    resume.fails.push(error);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (lsAgentes_1_1 && !lsAgentes_1_1.done && (_a = lsAgentes_1.return)) yield _a.call(lsAgentes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    if (lsDependientes.length) {
        console.log("Sincronizando Dependientes...", lsDependientes.length);
        try {
            for (var lsDependientes_1 = __asyncValues(lsDependientes), lsDependientes_1_1; lsDependientes_1_1 = yield lsDependientes_1.next(), !lsDependientes_1_1.done;) {
                const dep = lsDependientes_1_1.value;
                let clResume = `${dep.CODDEP}::${dep.NOMDEP}::${dep.CLADEP}`;
                let depvalues = JSON.stringify(Object.values(dep));
                let dep_rows = depvalues.substring(1, depvalues.length - 1);
                let q_dep_ins = `INSERT INTO T_DEP (CODDEP,NOMDEP,PERDEP,IMADEP,CLADEP,CCLDEP,ESTDEP,AGEDEP,IDIDEP) VALUES (${dep_rows});`;
                try {
                    const depins = yield fsol.execute(q_dep_ins);
                    clResume += ` ==> Done!!`;
                    console.log(clResume);
                    resume.goals.push(clResume);
                }
                catch (error) {
                    resume.fails.push(error);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (lsDependientes_1_1 && !lsDependientes_1_1.done && (_b = lsDependientes_1.return)) yield _b.call(lsDependientes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    resp.json(resume);
});
exports.SYNCAGENTS = SYNCAGENTS;
//# sourceMappingURL=agentsCont.js.map