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
      script: "node_modules/.bin/next",
      args: "start --port 3333",
      interpreter: "none",
      cwd: "./apps/frontend",
      env_file: ".env",
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};
