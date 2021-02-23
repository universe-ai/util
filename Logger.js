const ERROR     = 1;
const WARN      = 2;
const INFO      = 3;
const VERBOSE   = 4;
const DEBUG     = 5;

const labels = {
    [ERROR]:      "ERROR",
    [WARN]:       "WARN ",
    [INFO]:       "INFO ",
    [VERBOSE]:    "VERB ",
    [DEBUG]:      "DEBUG",
};

function output(id, logLevel, stream, ...args)
{
    const ts = String(Date.now());
    const label = labels[logLevel];

    const rows = [...args].map(arg => {
        if (typeof arg === "string") {
            return arg;
        }
        else if (typeof arg === "number") {
            return String(arg);
        }
        else if (typeof arg === false) {
            return "<false>";
        }
        else if (typeof arg === true) {
            return "<true>";
        }
        else if (arg === null) {
            return "<null>";
        }
        else if (arg === undefined) {
            return "<undefined>";
        }
        else if (typeof arg === "object") {
            try {
                return JSON.stringify(arg, null, 4);
            }
            catch(e) {
                // Fall through
            }
        }

        return "<data cannot be stringified>";
    });
    if (rows.length > 1) {
        // Add blank line if outputting multiline
        rows.push("");
    }
    const text = rows.join("\n");
    let str;
    if (id != null) {
        str = `[${ts}] [${label}] [${id.padEnd(18, " ")}] ${text}`;
    }
    else {
        str = `[${ts}] [${label}] ${text}`;
    }

    stream(str);
}

/**
 * Get a logger object which can be used for logging.
 *
 * @param {string | null} id class name/ID, max 18 chars will show
 * @param {string} logLevel: "error", "warn", "info", "verbose", "debug".  Default is "warn".
 *  What log level are we interested in outputting.
 * @param {Function} stream function to call with string to be output/piped/saved/ignored.
 * @return {object} functions error, warn, info, verbose, debug to be called when logging.
 */
function Logger(id, logLevelStr, stream)
{
    const reverseMap = {
        error:      ERROR,
        warn:       WARN,
        info:       INFO,
        verbose:    VERBOSE,
        debug:      DEBUG,
    };

    if (id) {
        id = id.slice(0, 18);
    }

    logLevelStr     = logLevelStr || "warn";

    const logLevel  = reverseMap[logLevelStr] || 0;
    stream          = stream ? stream : console.error;

    return {
        error:      (...args) => logLevel >= ERROR      && output(id, ERROR, stream, ...args),
        warn:       (...args) => logLevel >= WARN       && output(id, WARN, stream, ...args),
        info:       (...args) => logLevel >= INFO       && output(id, INFO, stream, ...args),
        verbose:    (...args) => logLevel >= VERBOSE    && output(id, VERBOSE, stream, ...args),
        debug:      (...args) => logLevel >= DEBUG      && output(id, DEBUG, stream, ...args),
    };
}

module.exports = Logger;
