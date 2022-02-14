"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PING = void 0;
const PING = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const workpointresponse = JSON.parse(process.env.WORKPOINT || '{error:"¡¡ .env file is missing !!"}');
    console.log("TEST de conexion:");
    console.log(req.body); // arraives under the route such a json
    console.log(req.params); // arrives on the route such /users/delete/10 
    console.log(req.query); // arrives on the route such /helpers/areaof?a=1&b=2 their are optionals
    setTimeout(() => {
        resp.json(workpointresponse);
    }, 500);
});
exports.PING = PING;
//# sourceMappingURL=ping.js.map