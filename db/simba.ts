import accdb from 'node-adodb';
import moment from 'moment';
import vizapi from '../db/vizapi';
const fsol = accdb.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);

export const SIMBA = async()=>{
    const hourstart = moment('08:55:00', 'hh:mm:ss');
    const hourend = moment('21:00:00', 'hh:mm:ss');
    const now = moment();
    const nday:any = moment().format("d");

    if( (nday!=7) && (now.isBetween(hourstart,hourend)) ){
        const workpoint = JSON.parse((process.env.WORKPOINT||""));
        console.time('t1');
        const simbainit = `[${moment().format("YYYY/MM/DD h:mm:ss")}]: Simba ha iniciado...`;
        console.log(`\n${simbainit}`);
        let rset:any = [];

        const rows:Array<any> = await fsol.query(`
            SELECT F_STO.ARTSTO AS CODIGO,
            GEN.ACTSTO AS GENSTOCK,
            EXH.ACTSTO AS EXHSTOCK,
            FDT.ACTSTO AS FDTSTOCK,
            DES.ACTSTO AS DESSTOCK,
            (GEN.ACTSTO + EXH.ACTSTO + FDT.ACTSTO + DES.ACTSTO) AS STOCK 
            FROM 
            (
                (
                    ((F_STO INNER JOIN F_STO AS GEN ON GEN.ARTSTO = F_STO.ARTSTO)
                    INNER JOIN F_STO AS EXH  ON EXH.ARTSTO = F_STO.ARTSTO)

                    INNER JOIN F_STO AS FDT  ON FDT.ARTSTO = F_STO.ARTSTO)
                    INNER JOIN F_STO AS DES  ON DES.ARTSTO = F_STO.ARTSTO
            )
            WHERE
            (GEN.ALMSTO="GEN" AND EXH.ALMSTO="EXH" AND FDT.ALMSTO="FDT" AND DES.ALMSTO="DES")
            GROUP BY F_STO.ARTSTO, GEN.ACTSTO, EXH.ACTSTO, FDT.ACTSTO, DES.ACTSTO;
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

        const simbaends = `[${moment().format("YYYY/MM/DD h:mm:ss")}]: Simba ha finalizado.`;
        console.timeEnd('t1');
        console.log(`${simbaends}\n`);
    }
}
