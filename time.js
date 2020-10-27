const dayjs = require("dayjs");
const pt = require("dayjs/locale/pt-br");
dayjs.locale(pt);

const now = () => {
    return dayjs().format("YYYY-MM-DD");
};

exports.now = now();
