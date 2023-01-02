const fs = require('fs');
import accdb from 'node-adodb';
import moment from 'moment';
import vizapi from '../db/vizapi';

export const SIMBA = async()=>{
    const hourstart = moment('08:55:00', 'hh:mm:ss');
    const hourend = moment('22:00:00', 'hh:mm:ss');
    const now = moment();
    const nday:any = moment().format("d");

    if( (nday!=7) && (now.isBetween(hourstart,hourend)) ){ // activar cuando no es temporada
    // if( now.isBetween(hourstart,hourend) ){
        console.log("Simba a iniciado...");
        try {
            const fsol = accdb.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);
            const workpoint = JSON.parse((process.env.WORKPOINT||""));
            console.time('t1');
            const simbainit = `[${moment().format("YYYY/MM/DD hh:mm:ss")}]: Simba ha iniciado...`;
            console.log(`\n${simbainit}`);
            let rset:any = [];
    
            const rows:Array<any> = await fsol.query(`
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
            
            if(rows.length){
                console.log("Syncronizando ALMACENES...");
                console.log(rows.length, "filas");
                for await (const row of rows) {
                    const [results]:any = await vizapi.query(`
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
                    if(results.changedRows>0){ rset.push({code:row.CODIGO}); }
                }
            }
    
            console.log("FILAS TOTALES:",rows.length);
            console.log("UPDATEDS:",rset.length);
            
            console.timeEnd('t1');
            const _tend = moment();
            console.log(`[${_tend.format("hh:mm:ss")}]: Simba ha finalizado, siguiente vuelta en 10 segundos...`);
            setTimeout(() => { SIMBA(); }, 10000);
        } catch (error) {
            console.timeEnd('t1');
            console.error(error);
            console.log("Simba tuvo un error de jecucion, nuevo intento en 10 segundos...");
            setTimeout(() => { SIMBA(); }, 10000);
        }
    }else{ setTimeout(() => { SIMBA(); }, 300000); }
}
