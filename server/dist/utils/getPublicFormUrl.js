"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicIdFromUrl = void 0;
const getPublicIdFromUrl = (url, location) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return `${location}/${filename.split('.')[0]}`;
};
exports.getPublicIdFromUrl = getPublicIdFromUrl;
