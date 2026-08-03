import * as vscode from "vscode";
import { DragonBallViewProvider } from "./ui/DragonBallViewProvider";

export function activate(context: vscode.ExtensionContext): void {
  const provider = new DragonBallViewProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      DragonBallViewProvider.viewType,
      provider
    ),
    vscode.commands.registerCommand("dragonBallArena.reset", () => {
      provider.reset();
    })
  );
}

export function deactivate(): void {}
