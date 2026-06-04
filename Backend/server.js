import './src/config/env.js'

import connectDB from "./src/database/db.js";
import app from "./src/app.js";

connectDB();

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});