module.exports = {
  apps: [
    {
      name: "tokenrip-backend",
      cwd: "./apps/backend",
      script: "dist/main.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "tokenrip-frontend",
      cwd: "./apps/frontend",
      script: "node_modules/.bin/next",
      args: "start --port 3333",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
