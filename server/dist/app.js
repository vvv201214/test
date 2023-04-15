"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const router_1 = __importDefault(require("./controllers/router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://13.233.184.159/",
    // origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));
app.use(express_1.default.json({ limit: '25kb' }));
app.get('/', (req, res) => {
    res.send('Jeevan Khata');
});
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/roles', roleRoutes);
// app.use('/api/v1/bioMarkers', bioMarkerRoutes);
// app.use('/api/v1/units', unitsRoutes);
app.use('/api/v1/data', router_1.default);
app.use('/api/v1/uploads', uploadRoutes_1.default);
// app.use('/api/v1/ocrData', ocrDataRoutes);
if (process.env.NODE_ENV == 'production') {
    app.use(express_1.default.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}
app.use(errorHandler_1.default);
exports.default = app;
