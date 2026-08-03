declare module "vscode" {
  export interface Disposable {
    dispose(): unknown;
  }

  export class Uri {
    static joinPath(base: Uri, ...pathSegments: string[]): Uri;
    toString(skipEncoding?: boolean): string;
  }

  export interface WebviewOptions {
    enableScripts?: boolean;
    localResourceRoots?: readonly Uri[];
  }

  export interface Webview {
    options: WebviewOptions;
    html: string;
    readonly cspSource: string;
    asWebviewUri(localResource: Uri): Uri;
    postMessage(message: unknown): PromiseLike<boolean>;
    onDidReceiveMessage(listener: (message: any) => unknown): Disposable;
  }

  export interface WebviewView {
    readonly webview: Webview;
    onDidDispose(listener: () => unknown): Disposable;
  }

  export interface WebviewViewProvider {
    resolveWebviewView(webviewView: WebviewView): void | PromiseLike<void>;
  }

  export interface ExtensionContext {
    readonly extensionUri: Uri;
    readonly subscriptions: Disposable[];
  }

  export namespace window {
    function registerWebviewViewProvider(
      viewId: string,
      provider: WebviewViewProvider
    ): Disposable;
  }

  export namespace commands {
    function registerCommand(
      command: string,
      callback: (...args: any[]) => unknown
    ): Disposable;
  }
}
