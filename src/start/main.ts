import Server, { start } from "start/server";
import Database, { testDB } from "start/db";

// Inicia a aplicação
testDB().then(start);