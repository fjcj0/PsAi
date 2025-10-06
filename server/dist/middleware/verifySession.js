"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySession = void 0;
const verifySession = (request, response, next) => {
    if (request.user) {
        const userId = request.user._id || request.user.id;
        return next();
    }
    return response.status(401).json({
        success: false,
        message: "Unauthorized - session not found or expired",
    });
};
exports.verifySession = verifySession;
