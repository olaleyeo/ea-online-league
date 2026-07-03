"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const tournaments_1 = __importDefault(require("./routes/tournaments"));
const fixtures_1 = __importDefault(require("./routes/fixtures"));
const standings_1 = __importDefault(require("./routes/standings"));
const knockouts_1 = __importDefault(require("./routes/knockouts"));
const ai_1 = __importDefault(require("./routes/ai"));
app.use('/api/tournaments', tournaments_1.default);
app.use('/api', fixtures_1.default); // Contains fixture routes
app.use('/api', standings_1.default); // Contains standings routes
app.use('/api', knockouts_1.default); // Contains knockout routes
app.use('/api', ai_1.default); // Contains ai routes
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
