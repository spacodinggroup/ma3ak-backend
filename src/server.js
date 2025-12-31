import { ENV as config } from "./config/env.js";
import app from './app.js';
console.log('Starting server...');
const port = Number.parseInt(config.PORT, 10);
app.listen(Number.isFinite(port) ? port : 5000, () => {
    console.log(`Server is running on port ${Number.isFinite(port) ? port : 5000}`);
});
//# sourceMappingURL=server.js.map