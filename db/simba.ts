const fs = require('fs');
import accdb from 'node-adodb';
import moment from 'moment';
import vizapi from '../db/vizapi';

export const SIMBA = async () => {
    const hourstart = moment('08:55:00', 'hh:mm:ss');
    const hourend = moment('22:00:00', 'hh:mm:ss');
    const now = moment();
    const nday: any = moment().format("d");

    if ((nday != 7) && (now.isBetween(hourstart, hourend))) { // activar cuando no es temporada
        console.log("Simba a iniciado...");
        try {
            const dbMap = new Map();
            const fsol = accdb.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);
            const workpoint = JSON.parse((process.env.WORKPOINT || ""));
            console.time('t1');
            const simbainit = `[${moment().format("YYYY/MM/DD hh:mm:ss")}]: Simba ha iniciado...`;
            console.log(`\n${simbainit}`);
            let rset: any = [];

            const rows: Array<any> = await fsol.query(`
                SELECT
                    F_ART.CODART AS code,
                    SUM(IIF(F_STO.ALMSTO = "GEN", F_STO.ACTSTO , 0)) AS gen,
                    SUM(IIF(F_STO.ALMSTO = "DES", F_STO.ACTSTO , 0)) AS des,
                    SUM(IIF(F_STO.ALMSTO = "EXH", F_STO.ACTSTO , 0)) AS exh,
                    SUM(IIF(F_STO.ALMSTO = "FDT", F_STO.ACTSTO , 0)) AS fdt,
                    SUM(IIF(F_STO.ALMSTO = "GEN", F_STO.ACTSTO , 0)  + IIF(F_STO.ALMSTO = "EXH", F_STO.ACTSTO , 0) ) AS stock
                FROM F_ART
                    INNER JOIN F_STO ON F_STO.ARTSTO = F_ART.CODART
                GROUP BY F_ART.CODART
            `);
            console.log('factusol',rows.length)
            const [rowsdb]: Array<any> = await vizapi.query(`
                SELECT 
                P.code,
                PS.gen,
                PS.des,
                PS.exh,
                PS.fdt,
                PS.stock
                FROM products P
                INNER JOIN product_stock PS ON PS._product = P.id
                WHERE P._status != 4  AND _workpoint = "${workpoint.id}";
                `
            )
            for (const item of rowsdb) {
                dbMap.set(item.code, item);
            }
            console.log('basededatos',rowsdb.length)
            const updates: any[] = [];

            for (const item of rows) {
                const dbItem = dbMap.get(item.code);
                if (!dbItem) {
                    continue;
                }
                const normalize = (n: any) => Number(n) || 0;
                const diff =
                normalize(item.gen) !== normalize(dbItem.gen) ||
                normalize(item.des) !== normalize(dbItem.des) ||
                normalize(item.exh) !== normalize(dbItem.exh) ||
                normalize(item.fdt) !== normalize(dbItem.fdt) ||
                normalize(item.stock) !== normalize(dbItem.stock);

                if (diff) {
                    updates.push({
                        code: item.code,
                        gen: item.gen,
                        des: item.des,
                        exh: item.exh,
                        fdt: item.fdt,
                        stock: item.stock
                    });
                }
            }
            console.log('actualizaciones',updates.length)
            if (updates.length) {
                console.log("Syncronizando ALMACENES...");
                console.log(updates.length, "filas");
                const chunkSize = 100;

                for (let i = 0; i < updates.length; i += chunkSize) {
                    const chunk = updates.slice(i, i + chunkSize);

                    await Promise.all(
                        chunk.map(item => vizapi.query(`
                        UPDATE product_stock PS
                        INNER JOIN products P ON PS._product = P.id
                        SET 
                            PS.gen = ${item.gen},
                            PS.des = ${item.des},
                            PS.exh = ${item.exh},
                            PS.fdt = ${item.fdt},
                            PS.stock = ${item.stock}
                        WHERE 
                            P.code = '${item.code}'
                            AND PS._workpoint = '${workpoint.id}'
                        `))
                    );
                }
            }

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
    } else { setTimeout(() => { SIMBA(); }, 300000); }
}
