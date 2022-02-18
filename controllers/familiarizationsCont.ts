import { Request, Response } from "express";
import accdb from 'node-adodb';
import moment from 'moment';

const fsol = accdb.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);// abrir conexion a factusol

export const SYNCPRODFAMS = async( req:Request, resp:Response )=>{
    console.time("timeexe");
    const newrows:Array<any> = req.body.rows; // se obtiene la lista de clientes que llega desde el servidor remoto (CEDISS)
    console.log("vamo a familiarizar!!");
    const resume:any = { goals:[], fails:[]};
    console.log("Filas a insertar:",newrows.length);

    try {
        for await (const row of newrows) {
            let dquery=`DELETE FROM F_EAN WHERE ARTEAN="${row.ARTEAN}";`;
            let iquery=`INSERT INTO F_EAN(ARTEAN,EANEAN) VALUES("${row.ARTEAN}","${row.EANEAN}");`;

            const del = await fsol.execute(dquery);
            const ins = await fsol.execute(iquery);
            const res = `${row.ARTEAN} ==> Ok!!!`;
            console.log(res);
            resume.goals.push(res);
        }
        resp.json(resume);
    } catch (error) {
        console.log(error);
        resp.json({msg:error});
    }
    console.timeEnd("timeexe");
}