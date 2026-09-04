module.exports = {
    apps: [
        {
            name: "manager-site",
            script: "npm",
            args: "start",
            cwd: "./",
            interpreter: "none",
            env: {
                NODE_ENV: "development",
                PORT: 2002
            }
        }
    ]
};