module.exports = {
  apps: [
    {
      name: "tokenrip-backend",
      script: "dist/main.js",
      interpreter: "bun",
      cwd: "./apps/backend",
      env_file: ".env",
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
    {
      name: "tokenrip-frontend",
      script: "serve.ts",
      interpreter: "bun",
      cwd: "./apps/frontend",
      env_file: ".env",
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
