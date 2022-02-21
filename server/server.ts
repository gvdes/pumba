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
        this.app.use( express.json() );
    }

    routes(){
        this.app.use(this.paths.fsol, fsolRoutes);
    }

    run(){
        this.app.listen(this.port, ()=>{
            console.log("Server running on", this.port);
        });

        // SIMBA();
        setInterval(()=>{ SIMBA(); }, 200000);
    }
}

export default Server;