import { Request,Response } from "express";
import moment from 'moment';

export const PING = async(req:Request,resp:Response)=>{
    const workpointresponse = JSON.parse(process.env.WORKPOINT||'{error:"¡¡ .env file is missing !!"}');
    console.log("TEST de conexion:");
    console.log(req.body); // arraives under the route such a json
    console.log(req.params); // arrives on the route such /users/delete/10 
    console.log(req.query); // arrives on the route such /helpers/areaof?a=1&b=2 their are optionals
    setTimeout(()=>{
        resp.json(workpointresponse);
    },500);
};