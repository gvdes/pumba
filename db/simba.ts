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
        let WRHGEN:any=[], WRHEXH:any=[], WRHFDT:any=[] ;

        let rset:any = { GEN:[], EXH:[], DES:[], FDT:[] };

        const rows:Array<any> = await fsol.query('SELECT ALMSTO,ARTSTO,ACTSTO FROM F_STO ORDER BY ARTSTO;');

        console.log(rows.length);

        WRHGEN = rows.filter( r => r.ALMSTO=="GEN");
        WRHEXH = rows.filter( r => r.ALMSTO=="EXH");
        WRHFDT = rows.filter( r => r.ALMSTO=="FDT");
        // WRHDES = rows.filter( r => r.ALMSTO=="DES");

        console.log("GEN",WRHGEN.length);
        console.log("EXB",WRHEXH.length);
        console.log("FDT",WRHFDT.length);
        console.log("WORKPOINT",workpoint.id);

        if(WRHGEN.length){
            console.log("Syncronizando Almacen GENERAL...");
            for await (const row of WRHGEN) {
                const [results]:any = await vizapi.query(`
                    UPDATE product_stock STO
                        INNER JOIN products P ON P.id = STO._product
                        INNER JOIN workpoints W ON W.id = STO._workpoint
                    SET gen=${row.ACTSTO}
                    WHERE P.code="${row.ARTSTO}" AND W.id="${workpoint.id}";
                `);
                if(results.changedRows>0){ rset.GEN.push({code:row.ARTSTO}); }
            }
        }

        if(WRHEXH.length){
            console.log("Syncronizando Almacen EXHIBICION...");
            for await (const row of WRHEXH) {
                const [results]:any = await vizapi.query(`
                    UPDATE product_stock STO
                        INNER JOIN products P ON P.id = STO._product
                        INNER JOIN workpoints W ON W.id = STO._workpoint
                    SET exh=${row.ACTSTO}
                    WHERE P.code="${row.ARTSTO}" AND W.id="${workpoint.id}";
                `);
                if(results.changedRows>0){ rset.EXH.push({code:row.ARTSTO}); }
            }
        }

        if(WRHFDT.length){
            console.log("Syncronizando Almacen FIN DE TEMPORADA...");
            for await (const row of WRHFDT) {
                const [results]:any = await vizapi.query(`
                    UPDATE product_stock STO
                        INNER JOIN products P ON P.id = STO._product
                        INNER JOIN workpoints W ON W.id = STO._workpoint
                    SET fdt=${row.ACTSTO}
                    WHERE P.code="${row.ARTSTO}" AND W.id="${workpoint.id}";
                `);
                if(results.changedRows>0){ rset.FDT.push({code:row.ARTSTO}); }
            }
        }

        console.log("FILAS TOTALES:",(WRHGEN.length+WRHEXH.length+WRHFDT.length));
        console.log("ALMACEN GENERAL:",WRHGEN.length,"UPDATEDS:",rset.GEN.length);
        console.log("ALMACEN EXHIBICION:",WRHEXH.length,"UPDATEDS:",rset.EXH.length);
        console.log("ALMACEN FINDETEMPO:",WRHFDT.length,"UPDATEDS:",rset.FDT.length);

        const simbaends = `[${moment().format("YYYY/MM/DD h:mm:ss")}]: Simba ha finalizado.`;
        console.timeEnd('t1');
        console.log(`${simbaends}\n`);
    }
}
