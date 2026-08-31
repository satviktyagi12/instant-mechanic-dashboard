import "dotenv/config";

import app from "./app";
import { prisma } from "./config/prisma";

const PORT = Number(
  process.env.PORT || 5000
);

const server = app.listen(PORT, () => {
  console.log("");
  console.log(
    "🚗 Instant Mechanic API"
  );
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
  console.log("");
});

async function shutdown() {
  console.log(
    "\n🛑 Shutting down server..."
  );

  await prisma.$disconnect();

  server.close(() => {
    console.log("👋 Server stopped");
    process.exit(0);
  });
}

process.on(
  "SIGINT",
  shutdown
);

process.on(
  "SIGTERM",
  shutdown
);