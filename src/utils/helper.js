class ApiResponse {
    static success(data, message = "Success") {
        return {
            success: true,
            message,
            data,
        };
    }

    static error(message, statusCode = 500) {
        return {
            success: false,
            message,
            statusCode,
        };
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        this.statusCode = 400;
    }
}

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}

module.exports = {
    ApiResponse,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
};
