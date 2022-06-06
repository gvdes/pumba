import { Request, Response } from "express";
import accdb from 'node-adodb';
import moment from 'moment';

const fsol = accdb.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);// abrir conexion a factusol
// interface IClientExists { exists:Boolean, code:String|null, client:Object|null, resume:String|null } // interface de la respuesta de la existencia o no de clientes

export const SYNCAGENTS = async(req:Request, resp:Response)=>{
    const lsAgentes:Array<any> = req.body.rset_agentes; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    const lsDependientes:Array<any> = req.body.rset_dependientes; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    const destino = JSON.parse(process.env.WORKPOINT||"uknown");

    let resume:any = { destino, goals:[], fails:[] };
    
    if(lsAgentes.length||lsDependientes.length){
        console.log("Sincronizando Agentes/Dependientes...",lsAgentes.length);

        for await (const agent of lsAgentes) {
            agent.FALAGE = moment(agent.FALAGE).format("YYYY/MM/DD");
            agent.FFOAGE = moment(agent.FFOAGE).format("YYYY/MM/DD");
            agent.FCCAGE = moment(agent.FCCAGE).format("YYYY/MM/DD");
            agent.FFCAGE = moment(agent.FFCAGE).format("YYYY/MM/DD");
            let clResume = `${agent.CODAGE}::${agent.NOMAGE}::${agent.FALAGE}`;
            
            let agvalues = JSON.stringify(Object.values(agent));
            let agents_rows = agvalues.substring(1,agvalues.length-1);

            let q_age_del = `DELETE FROM F_AGE WHERE CODAGE=${agent.CODAGE};`;
            let q_age_ins = `INSERT INTO F_AGE (CODAGE,TEMAGE,ZONAGE,IMPAGE,COMAGE,TCOAGE,IVAAGE,IRPAGE,PIRAGE,FALAGE,FAXAGE,EMAAGE,WEBAGE,PAIAGE,PCOAGE,TEPAGE,CLAAGE,DNIAGE,RUTAGE,CUWAGE,CAWAGE,SUWAGE,MEWAGE,CPOAGE,PROAGE,ENTAGE,OFIAGE,DCOAGE,CUEAGE,BANAGE,LISAGE,CONAGE,DOMAGE,NOMAGE,NOCAGE,MEMAGE,OBSAGE,FORAGE,LFOAGE,FFOAGE,OFOAGE,UREAGE,CURAGE,URLAGE,CATAGE,FCCAGE,FFCAGE,PUNAGE,CVEAGE,CREAGE,PURAGE,JEQAGE,CSAAGE,AGJAGE,DMWAGE,FOTAGE,POBAGE,CTPAGE) VALUES (${agents_rows});`;

            let q_dep_del = `DELETE FROM T_DEP WHERE CODDEP=${agent.CODAGE};`;

            try {
                const agdel = await fsol.execute(q_age_del);
                const depdel = await fsol.execute(q_dep_del);

                const agins = await fsol.execute(q_age_ins);

                clResume+=` ==> Done!!`;
                console.log(clResume);
                resume.goals.push(clResume);
            } catch (error) { resume.fails.push(error); }
        }
    }

    if(lsDependientes.length){
        console.log("Sincronizando Dependientes...",lsDependientes.length);
        
        for await (const dep of lsDependientes) {
            let clResume = `${dep.CODDEP}::${dep.NOMDEP}::${dep.CLADEP}`;
            let depvalues = JSON.stringify(Object.values(dep));
            let dep_rows = depvalues.substring(1,depvalues.length-1);

            let q_dep_ins = `INSERT INTO T_DEP (CODDEP,NOMDEP,PERDEP,IMADEP,CLADEP,CCLDEP,ESTDEP,AGEDEP,IDIDEP) VALUES (${dep_rows});`;
            
            try {
                const depins = await fsol.execute(q_dep_ins);

                clResume+=` ==> Done!!`;
                console.log(clResume);
                resume.goals.push(clResume);
            } catch (error) { resume.fails.push(error); }
        }
    }
    
    resp.json(resume);
}