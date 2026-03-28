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
      script: process.env.HOME + "/.bun/bin/bun",
      args: "--bun next start --port 3333",
      cwd: "./apps/frontend",
      exec_mode: "fork",
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
