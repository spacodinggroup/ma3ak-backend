import app from './app.js';
import { ENV as config } from "./config/env.js";
console.log('Starting server...');
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
//# sourceMappingURL=server.js.map