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
exports.SYNC = void 0;
const node_adodb_1 = __importDefault(require("node-adodb"));
const moment_1 = __importDefault(require("moment"));
const fsol = node_adodb_1.default.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`); // abrir conexion a factusol
const SYNC = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const lsClients = req.body.rows; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    console.log("Clientes recibidos:", lsClients.length); // arraives under the route such a json
    const destino = JSON.parse(process.env.WORKPOINT || "uknown");
    let resume = { destino, actualizados: [], creados: [], erroneos: [] };
    try {
        for (var lsClients_1 = __asyncValues(lsClients), lsClients_1_1; lsClients_1_1 = yield lsClients_1.next(), !lsClients_1_1.done;) {
            const client = lsClients_1_1.value;
            console.log("Buscando: ", client.CODCLI);
            // FORMATEAR LAS FECHAS para 
            let clResume = `${client.CODCLI} ${client.NOFCLI}`;
            client.FALCLI = (0, moment_1.default)(client.FALCLI).format("YYYY/MM/DD");
            client.FNACLI = (0, moment_1.default)(client.FNACLI).format("YYYY/MM/DD");
            client.FUMCLI = (0, moment_1.default)(client.FUMCLI).format("YYYY/MM/DD");
            client.MFECLI = (0, moment_1.default)(client.MFECLI).format("YYYY/MM/DD");
            let values = JSON.stringify(Object.values(client));
            let valuesvals = values.substring(1, values.length - 1);
            let clexists = yield fsol.query(`SELECT * FROM F_CLI WHERE CODCLI=${client.CODCLI}`);
            let dquery = `DELETE FROM F_CLI WHERE CODCLI=${client.CODCLI};`;
            let iquery = `INSERT INTO F_CLI (CODCLI,CCOCLI,NIFCLI,NOFCLI,NOCCLI,DOMCLI,POBCLI,CPOCLI,PROCLI,TELCLI,FAXCLI,PCOCLI,AGECLI,BANCLI,ENTCLI,OFICLI,DCOCLI,CUECLI,FPACLI,FINCLI,PPACLI,TARCLI,DP1CLI,DP2CLI,DP3CLI,TCLCLI,DT1CLI,DT2CLI,DT3CLI,TESCLI,CPRCLI,TPOCLI,PORCLI,IVACLI,TIVCLI,REQCLI,FALCLI,EMACLI,WEBCLI,MEMCLI,OBSCLI,HORCLI,VDECLI,VHACLI,CRFCLI,NVCCLI,NFCCLI,NICCLI,MONCLI,PAICLI,DOCCLI,DBACLI,PBACLI,SWFCLI,CO1CLI,CO2CLI,CO3CLI,CO4CLI,CO5CLI,IM1CLI,IM2CLI,IM3CLI,IM4CLI,IM5CLI,RUTCLI,SWICLI,GIRCLI,CUWCLI,CAWCLI,SUWCLI,MEWCLI,ESTCLI,AR1CLI,AR2CLI,AR3CLI,AR4CLI,AR5CLI,FELCLI,TRACLI,NCFCLI,FNACLI,FOTCLI,SKYCLI,NO1CLI,TF1CLI,EM1CLI,NO2CLI,TF2CLI,EM2CLI,NO3CLI,TF3CLI,EM3CLI,NO4CLI,TF4CLI,EM4CLI,NO5CLI,TF5CLI,EM5CLI,RETCLI,CTMCLI,MNPCLI,IFICLI,IMPCLI,NCACLI,CAMCLI,CO6CLI,IM6CLI,AR6CLI,CO7CLI,IM7CLI,AR7CLI,CO8CLI,IM8CLI,AR8CLI,CO9CLI,IM9CLI,AR9CLI,CO10CLI,IM10CLI,AR10CLI,CO11CLI,IM11CLI,AR11CLI,CO12CLI,IM12CLI,AR12CLI,ME1CLI,ME2CLI,ME3CLI,ME4CLI,ME5CLI,ME6CLI,ME7CLI,ME8CLI,ME9CLI,ME10CLI,ME11CLI,ME12CLI,CASCLI,EMOCLI,PRECLI,DTCCLI,EPETCLI,ERECCLI,ECLICLI,EPAGCLI,FUMCLI,PGCCLI,RESCLI,RFICLI,PRACLI,ACTCLI,ECOCLI,ECNCLI,EADCLI,TWICLI,A1KCLI,MOVCLI,CPFCLI,RCCCLI,MUTCLI,MRECLI,MFECLI,ACO1CLI,ADO1CLI,ACP1CLI,APO1CLI,APR1CLI,APA1CLI,ACO2CLI,ADO2CLI,ACP2CLI,APO2CLI,APR2CLI,APA2CLI,ACO3CLI,ADO3CLI,ACP3CLI,APO3CLI,APR3CLI,APA3CLI,IEUCLI,ACO4CLI,ADO4CLI,ACP4CLI,APO4CLI,APR4CLI,APA4CLI,BTRCLI,CFECLI,COPCLI,MDFCLI,APDCLI,PECCLI,MDACLI,TRECLI,CVICLI,FAVCLI,FCBCLI,ITGCLI,FEFCLI,ATVCLI,DECCLI,SDCCLI,CROCLI) VALUES (${valuesvals});`;
            if (clexists.length) {
                try {
                    const del = yield fsol.execute(dquery);
                    const ins = yield fsol.execute(iquery);
                    clResume += ` ==> Actualizado!!`;
                    console.log(clResume);
                    resume.actualizados.push(clResume);
                }
                catch (error) {
                    console.log(error);
                    resume.erroneos.push({ clResume, error });
                }
            }
            else {
                try {
                    const ins = yield fsol.execute(iquery);
                    clResume += ` ==> Creado !!`;
                    console.log(clResume);
                    resume.creados.push(clResume);
                }
                catch (error) {
                    console.log(error);
                    resume.erroneos.push({ clResume, error });
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (lsClients_1_1 && !lsClients_1_1.done && (_a = lsClients_1.return)) yield _a.call(lsClients_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    resp.json(resume);
});
exports.SYNC = SYNC;
//# sourceMappingURL=clientsCont.js.map