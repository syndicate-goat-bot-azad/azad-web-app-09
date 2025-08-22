// Author: NTKhang | Modified by Az ad
const axios = require("axios");
const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const { client } = global;

const { configCommands } = global.GoatBot;
const { log, loading, removeHomeDir } = global.utils;

function getDomain(url) {
    const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function isURL(str) {
    try { new URL(str); return true; } catch (e) { return false; }
}

// ——— Global utility functions ———
const packageAlready = [];
const spinner = "\\|/-";
let count = 0;

function loadScripts(folder, fileName, log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang, rawCode) {
    const storageCommandFilesPath = global.GoatBot[folder == "cmds" ? "commandFilesPath" : "eventCommandsFilesPath"];
    try {
        if (rawCode) {
            if (fileName.endsWith(".js")) fileName = fileName.slice(0, -3);
            fs.writeFileSync(path.join(process.cwd(), `scripts/${folder}/${fileName}.js`), rawCode);
        }

        const pathCommand = path.join(process.cwd(), `scripts/${folder}/${fileName}.js`);
        if (!fs.existsSync(pathCommand)) throw new Error(`File ${fileName}.js does not exist`);

        // Check required packages
        const contentFile = fs.readFileSync(pathCommand, "utf8");
        const regExpCheckPackage = /require(['"`])([^'"`]+)\1/g;
        let matchPackages = [...contentFile.matchAll(regExpCheckPackage)].map(m => m[2]).filter(p => !p.startsWith(".") && !p.startsWith("/"));
        matchPackages.forEach(pkg => {
            if (!packageAlready.includes(pkg)) {
                packageAlready.push(pkg);
                if (!fs.existsSync(path.join(process.cwd(), `node_modules/${pkg}`))) {
                    let wating;
                    try {
                        wating = setInterval(() => { count++; loading.info("PACKAGE", `Installing ${pkg} ${spinner[count % spinner.length]}`); }, 80);
                        execSync(`npm install ${pkg} --save`, { stdio: "pipe" });
                        clearInterval(wating);
                        process.stderr.clearLine();
                    } catch (err) {
                        clearInterval(wating);
                        process.stderr.clearLine();
                        throw new Error(`Can't install package ${pkg}`);
                    }
                }
            }
        });

        // Remove old command if exists
        delete require.cache[require.resolve(pathCommand)];
        const oldCommand = require(pathCommand);
        const commandName = oldCommand?.config?.name;
        if (!commandName) throw new Error("Command name is missing!");

        // Remove old aliases
        if (oldCommand.config?.aliases) {
            let aliases = Array.isArray(oldCommand.config.aliases) ? oldCommand.config.aliases : [oldCommand.config.aliases];
            aliases.forEach(alias => global.GoatBot.aliases.delete(alias));
        }

        // Load new command
        const command = require(pathCommand);
        command.location = pathCommand;

        if (!command.onStart || typeof command.onStart != "function") throw new Error("Function onStart is missing or not a function!");

        // Handle aliases
        if (command.config?.aliases) {
            let aliases = Array.isArray(command.config.aliases) ? command.config.aliases : [command.config.aliases];
            aliases.forEach(alias => {
                if (global.GoatBot.aliases.has(alias)) throw new Error(`Alias "${alias}" is already in use!`);
                global.GoatBot.aliases.set(alias, commandName);
            });
        }

        // Update GoatBot command maps
        const setMap = folder == "cmds" ? "commands" : "eventCommands";
        global.GoatBot[setMap].set(commandName, command);

        // Save configCommands
        fs.writeFileSync(client.dirConfigCommands, JSON.stringify(configCommands, null, 2));

        // Update storageCommandFilesPath
        const indexStorage = storageCommandFilesPath.findIndex(item => item.filePath == pathCommand);
        if (indexStorage != -1) storageCommandFilesPath.splice(indexStorage, 1);
        storageCommandFilesPath.push({ filePath: pathCommand, commandName: [commandName, ...(command.config.aliases || [])] });

        return { status: "success", name: fileName, command };
    } catch (err) {
        return { status: "failed", name: fileName, error: err };
    }
}

function unloadScripts(folder, fileName, configCommands, getLang) {
    const pathCommand = path.join(process.cwd(), `scripts/${folder}/${fileName}.js`);
    if (!fs.existsSync(pathCommand)) throw new Error(getLang("missingFile", `${fileName}.js`));

    const command = require(pathCommand);
    const commandName = command.config?.name;
    if (!commandName) throw new Error(getLang("invalidFileName", `${fileName}.js`));

    // Remove command from GoatBot
    const setMap = folder == "cmds" ? "commands" : "eventCommands";
    global.GoatBot[setMap].delete(commandName);

    // Remove aliases
    if (command.config?.aliases) {
        let aliases = Array.isArray(command.config.aliases) ? command.config.aliases : [command.config.aliases];
        aliases.forEach(alias => global.GoatBot.aliases.delete(alias));
    }

    delete require.cache[require.resolve(pathCommand)];

    // Update unload list
    const keyUnload = folder == "cmds" ? "commandUnload" : "commandEventUnload";
    const commandUnload = configCommands[keyUnload] || [];
    if (!commandUnload.includes(`${fileName}.js`)) commandUnload.push(`${fileName}.js`);
    configCommands[keyUnload] = commandUnload;

    fs.writeFileSync(global.client.dirConfigCommands, JSON.stringify(configCommands, null, 2));

    return { status: "success", name: fileName };
}

// Expose global utils
global.utils.loadScripts = loadScripts;
global.utils.unloadScripts = unloadScripts;

// ——— CMD command module ———
module.exports = {
    config: {
        name: "cmd",
        version: "1.18",
        author: "NTKhang",
        countDown: 5,
        role: 2,
        description: { vi: "Quản lý các tệp lệnh của bạn", en: "Manage your command files" },
        category: "owner",
        guide: { vi: "   {pn} load <tên file lệnh>\n   {pn} loadAll\n   {pn} install <url> <tên file lệnh>\n   {pn} install <tên file lệnh> <code>", en: "   {pn} load <command file name>\n   {pn} loadAll\n   {pn} install <url> <command file name>\n   {pn} install <command file name> <code>" }
    },

    onStart: async ({ args, message, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, event, commandName, getLang }) => {
        const { unloadScripts, loadScripts } = global.utils;
        const commandUnloadSafe = configCommands.commandUnload || [];

        // Load single
        if (args[0] == "load" && args.length == 2) {
            if (!args[1]) return message.reply(getLang("missingFileName"));
            const infoLoad = loadScripts("cmds", args[1], log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang);
            if (infoLoad.status == "success") message.reply(getLang("loaded", infoLoad.name));
            else message.reply(`${getLang("loadedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message)}\n${infoLoad.error.stack}`);
        }
        // Load all
        else if ((args[0] || "").toLowerCase() == "loadall") {
            const files = fs.readdirSync(__dirname)
                .filter(file => file.endsWith(".js") && !commandUnloadSafe.includes(file))
                .map(f => f.split(".")[0]);
            const success = [], fail = [];
            for (const f of files) {
                const r = loadScripts("cmds", f, log, configCommands, api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, getLang);
                r.status == "success" ? success.push(f) : fail.push(`❗ ${f} => ${r.error.name}: ${r.error.message}`);
            }
            let msg = "";
            if (success.length > 0) msg += getLang("loadedSuccess", success.length);
            if (fail.length > 0) msg += (msg ? "\n" : "") + getLang("loadedFail", fail.length, fail.join("\n")) + "\n" + getLang("openConsoleToSeeError");
            message.reply(msg);
        }
        // Unload
        else if (args[0] == "unload") {
            if (!args[1]) return message.reply(getLang("missingCommandNameUnload"));
            const r = unloadScripts("cmds", args[1], configCommands, getLang);
            r.status == "success" ? message.reply(getLang("unloaded", r.name)) : message.reply(`${getLang("unloadedError", r.name, r.error.name, r.error.message)}`);
        }
        // Install
        else if (args[0] == "install") {
            let url = args[1], fileName = args[2], rawCode;
            if (!url || !fileName) return message.reply(getLang("missingUrlCodeOrFileName"));

            // Switch if only filename is first
