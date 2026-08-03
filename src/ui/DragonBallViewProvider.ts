import * as vscode from "vscode";
import { battlefields, fighterRoster } from "../game/roster";
import { embeddedSpriteData } from "../game/spriteData";

function nonce(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let value = "";
  for (let index = 0; index < 32; index += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/&/g, "\\u0026")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

export class DragonBallViewProvider implements vscode.WebviewViewProvider {
  static readonly viewType = "dragonBallArena.view";

  private view: vscode.WebviewView | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {}

  reset(): void {
    void this.view?.webview.postMessage({ type: "reset" });
  }

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;

    const webview = webviewView.webview;
    const mediaRoot = vscode.Uri.joinPath(this.context.extensionUri, "media");
    webview.options = {
      enableScripts: true,
      localResourceRoots: [mediaRoot]
    };

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaRoot, "game.js")
    );
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(mediaRoot, "styles.css")
    );
    const scriptNonce = nonce();
    const fighters = fighterRoster.map((fighter) => ({
      ...fighter,
      // Embedded data prevents the webview from falling back to blocky placeholder
      // drawings when VS Code delays or blocks a local sprite request.
      spriteUri: embeddedSpriteData[fighter.id]
    }));
    const data = safeJson({ fighters, battlefields });

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
