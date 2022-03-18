import { Request, Response } from "express";
import accdb from 'node-adodb';
import moment from 'moment';

const fsol = accdb.open(`Provider=Microsoft.ACE.OLEDB.12.0;Data Source=${process.env.FSOLDB};Persist Security Info=False;`);// abrir conexion a factusol

export const SYNCPRODUCTS = async( req:Request, resp:Response )=>{
    const body = req.body;
    const products = body.rsetprods;
    const prices = body.rsetprices;

    for await (const product of products) {
        console.log(product.CODART);
        const qexists = await fsol.query(`SELECT COUNT(*) as EXISTE FROM F_ART WHERE CODART="${product.CODART}";`);
        console.log(qexists); 
    }

    // console.log(products);
    resp.json({msg:"Working!...",productos:products.length,prices:prices.length});
}