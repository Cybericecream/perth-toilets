import {server} from "./rest/express";
import {Ledger} from "./data/mariadb/pool";

const ledger = new Ledger();
console.log(ledger.connection.totalCount);

server();