import express, { Application } from 'express';
import cors from 'cors';

import fsolRoutes from '../routes/fsol';
import { SIMBA } from '../db/simba';

class Server{
    private app:Application;
    private port:string;
    private paths={
        fsol: '/fsol'
    }

    constructor(){
        this.app = express();
        this.port = process.env.PORT || "4400";

        this.middlewares();
        this.routes();
    }

    middlewares(){
        // this.app.use(express.json());
        this.app.use(express.json({limit: '50mb'}));
        this.app.use(express.urlencoded({limit: '50mb', extended: true }));
    }

    routes(){
        this.app.use(this.paths.fsol, fsolRoutes);
    }

    run(){
        this.app.listen(this.port, ()=>{
            console.log("Pumba running's on", this.port);
        });

        // SIMBA();
        let interval:any = (process.env.SIMBATIME||120000);
        setInterval(()=>{ SIMBA(); }, interval);
    }
}

export default Server;