const path = require('path');

module.exports = {
  apps: [
    {
      name: "tokenrip-backend",
      script: path.join(__dirname, "apps/backend/dist/main.js"),
      interpreter: "bun",
      cwd: path.join(__dirname, "apps/backend"),
      env_file: path.join(__dirname, "apps/backend/.env"),
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
    {
      name: "tokenrip-frontend",
      script: path.join(__dirname, "apps/frontend/serve.ts"),
      interpreter: "bun",
      cwd: path.join(__dirname, "apps/frontend"),
      env_file: path.join(__dirname, "apps/frontend/.env"),
      env: {
        NODE_ENV: "production",
        PORT: "3333",
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};
