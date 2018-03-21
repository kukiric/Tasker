import { start } from "start/server";
import { testDB } from "start/db";

testDB().then(start).catch(err => {
    console.error(err.stack);
    process.exit(1);
});
