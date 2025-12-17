import { app } from "./app.js";
import dbConnect from "./db/index.js";

const PORT = process.env.PORT || 8000;

await dbConnect();

// Only listen locally (Vercel ignores this)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
