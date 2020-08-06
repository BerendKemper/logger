"use strict";
const localTimeZoneDate = function loadLocalTimeZoneDate() {
    const pad2 = number => number < 10 ? "0" + number : number;
    const pad3 = number => number < 10 ? "00" + number : number < 100 ? "0" + number : number;
    const getUTCOffset = date => {
        const hour = date.getTimezoneOffset() / -60;
        return { hhmm: "+" + pad2(hour) + "00", hour };
    };
    return Object.freeze({
        'toISOString': (date, ms = true) => pad2(date.getFullYear()) + "-" + pad2(date.getMonth() + 1) + "-" + pad2(date.getDate()) + "T" +
            pad2(date.getHours()) + ":" + pad2(date.getMinutes()) + ":" + pad2(date.getSeconds()) +
            (ms === true ? "." + pad3(date.getMilliseconds()) : "") + getUTCOffset(date).hhmm,
    });
}();

const spaces = (number = 0, string = "") => {
    let spaces = "";
    for (let i = 0; i < number - string.length; i++)
        spaces += " ";
    return spaces;
};
const pretify = (...data) => {
    let logStr = "";
    for (const str of data) {
        let length = 10;
        while (length < str.length + 4)
            length += 5;
        logStr += str + spaces(length, str);
    }
    return logStr;
};
let logStream;
let errorStream;
let debugStream;
const logger = Object.freeze({
    'log': (...data) => {
        const callback = (typeof data[data.length - 1] === "function") ? data.pop() : () => {};
        const logStr = dateISOString.toOffset(new Date(), true) + spaces(4) + pretify(...data);
        console.log(logStr);
        logStream.write(logStr + "\n", "utf8");
        callback(logStr);
    },
    'logNoDate': (...data) => {
        const callback = (typeof data[data.length - 1] === "function") ? data.pop() : () => {};
        const logStr = pretify(...data);
        console.log(logStr);
        logStream.write(logStr + "\n", "utf8");
        callback(logStr);
    },
    'error': (...data) => {
        const callback = (typeof data[data.length - 1] === "function") ? data.pop() : () => {};
        const error = dateISOString.toOffset(new Date(), true) + spaces(4) + pretify(...data);
        console.log(error);
        errorStream.write(error + "\n", "utf8");
        logStream.write(error + "\n", "utf8");
        callback(error);
    },
    'debug': (...data) => debugStream.write(data.join(" ") + "\n", "utf8")
});
let then = new Date();
then.setHours(0, 0, 0, 0);
(function nextTick() {
    const now = new Date();
    setTimeout(() => nextTick(), (then - now) * 0.99);
    if (now >= then) {
        const dateStr = yyyymmdd.toString(now);
        logStream = _fs.createWriteStream("./log/" + dateStr + ".log", { flags: "a+" });
        errorStream = _fs.createWriteStream("./log/error/" + dateStr + ".log", { flags: "a+" });
        testStream = _fs.createWriteStream("./log/debug/" + dateStr + ".log", {flags: "a+" });
        then.setHours(then.getHours() + 24, 0, 0, 0);
    }
    logger.log("logger tick");
}());
module.exports = logger;