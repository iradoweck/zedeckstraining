const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

class Logger {
    constructor() {
        this.env = import.meta.env.MODE;
    }

    log(level, message, data = null) {
        if (this.env === 'production' && level === LOG_LEVELS.DEBUG) return;

        const timestamp = new Date().toISOString();
        const payload = {
            timestamp,
            level,
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Console output with colors
        const styles = {
            [LOG_LEVELS.INFO]: 'color: #00b894',
            [LOG_LEVELS.WARN]: 'color: #fdcb6e',
            [LOG_LEVELS.ERROR]: 'color: #d63031',
            [LOG_LEVELS.DEBUG]: 'color: #0984e3',
        };

        console.log(`%c[${level}] ${message}`, styles[level], data || '');

        // In a real scenario, you would send 'payload' to a backend service like server-side logs or Sentry
        // this.sendToBackend(payload);
    }

    info(message, data) { this.log(LOG_LEVELS.INFO, message, data); }
    warn(message, data) { this.log(LOG_LEVELS.WARN, message, data); }
    error(message, data) { this.log(LOG_LEVELS.ERROR, message, data); }
    debug(message, data) { this.log(LOG_LEVELS.DEBUG, message, data); }
}

export const logger = new Logger();
