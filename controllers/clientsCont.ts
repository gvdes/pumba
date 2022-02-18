import { Request, Response } from "express";
import accdb from 'node-adodb';
import moment from 'moment';

const fsol = accdb.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);// abrir conexion a factusol
interface IClientExists { exists:Boolean, code:String|null, client:Object|null, resume:String|null } // interface de la respuesta de la existencia o no de clientes

export const SYNC = async(req:Request, resp:Response)=>{
    const lsClients:Array<any> = req.body.rows; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    console.log("Clientes recibidos:",lsClients.length); // arraives under the route such a json
    const destino = JSON.parse(process.env.WORKPOINT||"uknown");
    let resume:any = { destino, actualizados:[], creados:[], erroneos:[] };

    for await (const client of lsClients) {
        console.log("Buscando: ",client.CODCLI);
        // FORMATEAR LAS FECHAS para 
        let clResume = `${client.CODCLI} ${client.NOFCLI}`;
        client.FALCLI = moment(client.FALCLI).format("YYYY/MM/DD");
        client.FNACLI = moment(client.FNACLI).format("YYYY/MM/DD");
        client.FUMCLI = moment(client.FUMCLI).format("YYYY/MM/DD");
        client.MFECLI = moment(client.MFECLI).format("YYYY/MM/DD");
        let values = JSON.stringify(Object.values(client));
        let valuesvals = values.substring(1,values.length-1);

        let clexists:Array<any> = await fsol.query(`SELECT * FROM F_CLI WHERE CODCLI=${client.CODCLI}`);
        let dquery=`DELETE FROM F_CLI WHERE CODCLI=${client.CODCLI};`;
        let iquery=`INSERT INTO F_CLI (CODCLI,CCOCLI,NIFCLI,NOFCLI,NOCCLI,DOMCLI,POBCLI,CPOCLI,PROCLI,TELCLI,FAXCLI,PCOCLI,AGECLI,BANCLI,ENTCLI,OFICLI,DCOCLI,CUECLI,FPACLI,FINCLI,PPACLI,TARCLI,DP1CLI,DP2CLI,DP3CLI,TCLCLI,DT1CLI,DT2CLI,DT3CLI,TESCLI,CPRCLI,TPOCLI,PORCLI,IVACLI,TIVCLI,REQCLI,FALCLI,EMACLI,WEBCLI,MEMCLI,OBSCLI,HORCLI,VDECLI,VHACLI,CRFCLI,NVCCLI,NFCCLI,NICCLI,MONCLI,PAICLI,DOCCLI,DBACLI,PBACLI,SWFCLI,CO1CLI,CO2CLI,CO3CLI,CO4CLI,CO5CLI,IM1CLI,IM2CLI,IM3CLI,IM4CLI,IM5CLI,RUTCLI,SWICLI,GIRCLI,CUWCLI,CAWCLI,SUWCLI,MEWCLI,ESTCLI,AR1CLI,AR2CLI,AR3CLI,AR4CLI,AR5CLI,FELCLI,TRACLI,NCFCLI,FNACLI,FOTCLI,SKYCLI,NO1CLI,TF1CLI,EM1CLI,NO2CLI,TF2CLI,EM2CLI,NO3CLI,TF3CLI,EM3CLI,NO4CLI,TF4CLI,EM4CLI,NO5CLI,TF5CLI,EM5CLI,RETCLI,CTMCLI,MNPCLI,IFICLI,IMPCLI,NCACLI,CAMCLI,CO6CLI,IM6CLI,AR6CLI,CO7CLI,IM7CLI,AR7CLI,CO8CLI,IM8CLI,AR8CLI,CO9CLI,IM9CLI,AR9CLI,CO10CLI,IM10CLI,AR10CLI,CO11CLI,IM11CLI,AR11CLI,CO12CLI,IM12CLI,AR12CLI,ME1CLI,ME2CLI,ME3CLI,ME4CLI,ME5CLI,ME6CLI,ME7CLI,ME8CLI,ME9CLI,ME10CLI,ME11CLI,ME12CLI,CASCLI,EMOCLI,PRECLI,DTCCLI,EPETCLI,ERECCLI,ECLICLI,EPAGCLI,FUMCLI,PGCCLI,RESCLI,RFICLI,PRACLI,ACTCLI,ECOCLI,ECNCLI,EADCLI,TWICLI,A1KCLI,MOVCLI,CPFCLI,RCCCLI,MUTCLI,MRECLI,MFECLI,ACO1CLI,ADO1CLI,ACP1CLI,APO1CLI,APR1CLI,APA1CLI,ACO2CLI,ADO2CLI,ACP2CLI,APO2CLI,APR2CLI,APA2CLI,ACO3CLI,ADO3CLI,ACP3CLI,APO3CLI,APR3CLI,APA3CLI,IEUCLI,ACO4CLI,ADO4CLI,ACP4CLI,APO4CLI,APR4CLI,APA4CLI,BTRCLI,CFECLI,COPCLI,MDFCLI,APDCLI,PECCLI,MDACLI,TRECLI,CVICLI,FAVCLI,FCBCLI,ITGCLI,FEFCLI,ATVCLI,DECCLI,SDCCLI) VALUES (${valuesvals});`;

        if(clexists.length){
            try {
                const del = await fsol.execute(dquery);
                const ins = await fsol.execute(iquery);
                clResume+=` ==> Actualizado!!`;
                console.log(clResume);
                resume.actualizados.push(clResume);
            } catch (error) {
                console.log(error);
                resume.erroneos.push({ clResume, error });
            }

        }else{
            try {
                const ins = await fsol.execute(iquery);
                clResume+=` ==> Creado !!`
                console.log(clResume);
                resume.creados.push(clResume);
            } catch (error) {
                console.log(error);
                resume.erroneos.push({ clResume, error });
            }
        }
    }

    resp.json(resume);
}