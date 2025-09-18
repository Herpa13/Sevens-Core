"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZip = exports.triggerDownload = exports.unparseCsv = exports.parseCsv = void 0;
const papaparse_1 = __importDefault(require("papaparse"));
const jszip_1 = __importDefault(require("jszip"));
// Function to parse a CSV file content
const parseCsv = (file) => {
    return new Promise((resolve, reject) => {
        papaparse_1.default.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                resolve(results.data);
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};
exports.parseCsv = parseCsv;
// Function to convert an array of objects to a CSV string
const unparseCsv = (data) => {
    return papaparse_1.default.unparse(data);
};
exports.unparseCsv = unparseCsv;
// Function to trigger a download in the browser
const triggerDownload = (content, fileName, mimeType) => {
    const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
exports.triggerDownload = triggerDownload;
// Function to create a ZIP file from multiple CSV files
const createZip = async (files) => {
    const zip = new jszip_1.default();
    files.forEach(file => {
        zip.file(file.name, file.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    return blob;
};
exports.createZip = createZip;
