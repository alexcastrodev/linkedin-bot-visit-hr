const { promises } = require("fs");
const { now } = require("./time");
const firstHR = ""; // URL person

var sqlite3 = require("sqlite3").verbose();
const dayjs = require("dayjs");

const create = async () => {
    let db = new sqlite3.Database("./db/linkedin.db", (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    db.run(
        "CREATE TABLE linkedin (href TEXT NOT NULL UNIQUE, created_at TEXT , updated_at TEXT)"
    );
    console.log("Created");

    setTimeout(() => {
        db.run(`INSERT INTO linkedin VALUES ('${firstHR}', '${now}','')`);
        console.log("Created first HR");
    }, 1000);
};

create();
