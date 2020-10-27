var sqlite3 = require("sqlite3").verbose();
const dayjs = require("dayjs");
const { now } = require("./time");

const connect = async () => {
    let db = new sqlite3.Database("./db/linkedin.db", (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    return await db;
};

const insertData = async (array) => {
    const db = await connect();
    console.log(`[INSERT]: ${array.join()}`);
    if (array.length < 0) {
        return;
    }

    db.serialize(function () {
        var stmt = db.prepare("INSERT OR IGNORE INTO linkedin VALUES (?,?,?)");
        for (var i = 0; i < array.length; i++) {
            console.log(array, array[i]);
            stmt.run(array[i], now, "");
        }
        stmt.finalize();
    });
};

const select = async () => {
    const db = await connect();
    return new Promise((resolve) => {
        db.all(
            `SELECT * FROM linkedin where updated_at not in ('${now}')`,
            (err, rows) => {
                resolve(rows);
            }
        );
    });
};

const selectAll = async () => {
    const db = await connect();
    return new Promise((resolve) => {
        db.all(`SELECT * FROM linkedin`, (err, rows) => {
            resolve(rows);
        });
    });
};

const update = async (uid) => {
    const db = await connect();
    console.log(`[UPDATE]: ${uid} at ${now}`);
    db.run(`update linkedin set updated_at = '${now}' where href = '${uid}'`);
};

exports.insertData = insertData;
exports.getOne = select;
exports.getAll = selectAll;
exports.update = update;
