"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragonBallViewProvider = void 0;
const vscode = __importStar(require("vscode"));
const roster_1 = require("../game/roster");
const spriteData_1 = require("../game/spriteData");
function nonce() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let value = "";
    for (let index = 0; index < 32; index += 1) {
        value += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return value;
}
function safeJson(value) {
    return JSON.stringify(value)
        .replace(/&/g, "\\u0026")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e");
}
class DragonBallViewProvider {
    constructor(context) {
        this.context = context;
    }
    reset() {
        void this.view?.webview.postMessage({ type: "reset" });
    }
    resolveWebviewView(webviewView) {
        this.view = webviewView;
        const webview = webviewView.webview;
        const mediaRoot = vscode.Uri.joinPath(this.context.extensionUri, "media");
        webview.options = {
            enableScripts: true,
            localResourceRoots: [mediaRoot]
        };
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, "game.js"));
        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaRoot, "styles.css"));
        const scriptNonce = nonce();
        const fighters = roster_1.fighterRoster.map((fighter) => ({
            ...fighter,
            // Embedded data prevents the webview from falling back to blocky placeholder
            // drawings when VS Code delays or blocks a local sprite request.
            spriteUri: spriteData_1.embeddedSpriteData[fighter.id]
        }));
        const data = safeJson({ fighters, battlefields: roster_1.battlefields });
        webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} data:; script-src 'nonce-${scriptNonce}';">
  <link rel="stylesheet" href="${styleUri}">
  <title>Dragon Ball Arena</title>
</head>
<body>
  <main class="app">
    <div class="title-row">
      <div>
        <h1>Dragon Ball Arena</h1>
        <p>Detailed animated fighters</p>
      </div>
      <span class="status-pill" id="statusPill">Ready</span>
    </div>

    <div class="pickers" aria-label="Fighter and battlefield selection">
      <label>
        <span>Left</span>
        <select id="leftFighter"></select>
      </label>
      <label>
        <span>Right</span>
        <select id="rightFighter"></select>
      </label>
      <label class="field-picker">
        <span>Battlefield</span>
        <select id="battlefield"></select>
      </label>
    </div>

    <div class="canvas-wrap">
      <canvas id="arena" width="480" height="300" aria-label="Animated Dragon Ball fighting arena"></canvas>
    </div>

    <div class="controls">
      <button id="fightButton" class="primary" type="button">Fight!</button>
      <button id="randomButton" type="button">Random</button>
      <button id="resetButton" type="button">Reset</button>
    </div>

    <section class="battle-log" aria-live="polite">
      <div class="log-heading">Battle log</div>
      <div id="logLines"></div>
    </section>

    <script id="arena-data" type="application/json">${data}</script>
    <script nonce="${scriptNonce}" src="${scriptUri}"></script>
  </main>
</body>
</html>`;
        webviewView.onDidDispose(() => {
            this.view = undefined;
        });
    }
}
exports.DragonBallViewProvider = DragonBallViewProvider;
DragonBallViewProvider.viewType = "dragonBallArena.view";
//# sourceMappingURL=DragonBallViewProvider.js.map