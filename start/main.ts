import Server, { start } from "start/server";
import Database, { testDB } from "start/db";

testDB().then(start);
