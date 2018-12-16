module.exports = {
  apps: [{
    name: "kdk-shop",
    script: "server.js",
    env: {
            "NODE_ENV": "PRODUCTION"
        }
    }],
  deploy: {
    // "production" is the environment name
    production: {
      user: "node",
      // SSH key path, default to $HOME/.ssh
      key: "./deploy_key",
      // SSH user
      user: "root",
      // SSH host
      host: ["95.216.119.91"],
      // SSH options with no command-line flag, see 'man ssh'
      // can be either a single string or an array of strings
      ssh_options: "StrictHostKeyChecking=no",
      // GIT remote/branch
      ref: "origin/master",
      // GIT remote
      repo: "https://github.com/kdk-shop/KDK-Online-Shopping-Website",
      // path in the server
      path: "/root/kdk/",
      // Pre-setup command or path to a script on your local machine
      "pre-setup": "ls -la",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      "post-setup": "ls -la",
      // pre-deploy action
      "pre-deploy":"git pull --force",
      // "pre-deploy-local": "echo 'This is a local executed command'",
      // post-deploy action
      "post-deploy": "npm install && cd client && npm install &&"+
      " npm run build-product && cd .. && pm2 startOrRestart ecosystem.config.js"
    }
  }
}
