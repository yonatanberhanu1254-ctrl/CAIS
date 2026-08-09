module.exports = {
  apps: [{
    name: "cais-api",
    script: "./src/server.js",
    // Scales to absolute max CPU threads on the deployment server
    instances: "max",
    exec_mode: "cluster",
    // Fault tolerance - auto restart on crash
    autorestart: true,
    // File watching disabled in production
    watch: false,
    // Prevents memory leak crashing by preemptively restarting bloated workers
    max_memory_restart: "1G",
    log_date_format: "YYYY-MM-DD HH:mm Z",
    error_file: "./logs/pm2-error.log",
    out_file: "./logs/pm2-out.log",
    merge_logs: true,
    time: true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 3000
    }
  }]
};
