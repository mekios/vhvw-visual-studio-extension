// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	const detectRegex = new RegExp(/([0-9]*px)/g);
	const numberRegex = new RegExp(/([0-9]*)px/g);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let disposable1 = vscode.commands.registerTextEditorCommand('vhvw-converter.pxtovh', (textEditor, texteditorEdit) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user		
		if (!!textEditor.selection) {
			let selectionRange = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
			let selectedText = textEditor.document.getText(selectionRange) || '';
			//console.log(selectedText);
			if (selectedText.trim() !== '') {
				//console.log(selectedText);
				if (detectRegex.test(selectedText)) {
					selectedText = selectedText.replace(numberRegex, pxtovhFunc);
					textEditor.edit((builder) => {
						builder.replace(selectionRange, selectedText);
					}).then(() => {
						vscode.window.showInformationMessage(selectedText);
					})

				} else {
					vscode.window.showWarningMessage('No pixels to convert!');
				}
			} else {
				vscode.window.showWarningMessage('No code selected!');
			}
		}


	});

	let disposable2 = vscode.commands.registerTextEditorCommand('vhvw-converter.pxtovw', (textEditor, texteditorEdit) => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user		
		if (!!textEditor.selection) {
			let selectionRange = new vscode.Range(textEditor.selection.start, textEditor.selection.end);
			let selectedText = textEditor.document.getText(selectionRange) || '';
			//console.log(selectedText);
			if (selectedText.trim() !== '') {
				//console.log(selectedText);
				if (detectRegex.test(selectedText)) {
					selectedText = selectedText.replace(numberRegex, pxtovwFunc);
					textEditor.edit((builder) => {
						builder.replace(selectionRange, selectedText);
					}).then(() => {
						vscode.window.showInformationMessage(selectedText);
					})

				} else {
					vscode.window.showWarningMessage('No pixels to convert!');
				}
			} else {
				vscode.window.showWarningMessage('No code selected!');
			}
		}


	});


	let disposable3 = vscode.commands.registerCommand('vhvw-converter.setViewportHeight', () => {
		vscode.window.showInputBox({
			placeHolder: "Viewport Height",
			prompt: "Enter the base viewport height for conversion calcuation",
			value: vscode.workspace.getConfiguration("vhvw-converter").get<string>('viewportHeight')
		}).then((newvalue) => {
			//console.log(newvalue);
			if (!!newvalue && newvalue !== '0') {
				vscode.workspace.getConfiguration("vhvw-converter").update('viewportHeight', parseInt(newvalue || '0')).then(() => {
					vscode.window.showInformationMessage('New base viewportHeight set to:' + vscode.workspace.getConfiguration("vhvw-converter").get<string>('viewportHeight'));
				});
			} else {
				vscode.window.showWarningMessage('Nothing changed!');
			}
		});

	});


	let disposable4 = vscode.commands.registerCommand('vhvw-converter.setViewportWidth', () => {
		vscode.window.showInputBox({
			placeHolder: "Viewport Width",
			prompt: "Enter the base viewport width for conversion calcuation",
			value: vscode.workspace.getConfiguration("vhvw-converter").get<string>('viewportWidth')
		}).then((newvalue) => {

			if (!!newvalue && newvalue !== '0') {
				vscode.workspace.getConfiguration("vhvw-converter").update('viewportWidth', parseInt(newvalue || '0')).then(() => {
					vscode.window.showInformationMessage('New base viewportWidth set to:' + vscode.workspace.getConfiguration("vhvw-converter").get<string>('viewportWidth'));
				});
			} else {
				vscode.window.showWarningMessage('Nothing changed!');
			}


		});
	});

	let disposable5 = vscode.commands.registerCommand('vhvw-converter.setAccuracy', () => {
		vscode.window.showInputBox({
			placeHolder: "Accuracy",
			prompt: "Enter the desired accuracy for conversion calcuation",
			value: vscode.workspace.getConfiguration("vhvw-converter").get<string>('accuracy')
		}).then((newvalue) => {
			if (!!newvalue && newvalue !== '0') {
				vscode.workspace.getConfiguration("vhvw-converter").update('accuracy', parseInt(newvalue || '0')).then(() => {
					vscode.window.showInformationMessage('New accuracy set to:' + vscode.workspace.getConfiguration("vhvw-converter").get<string>('accuracy'));
				});
			} else {
				vscode.window.showWarningMessage('Nothing changed!');
			}

		});
	});

	context.subscriptions.push(disposable1);
	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable3);
	context.subscriptions.push(disposable4);
	context.subscriptions.push(disposable5);

	function pxtovhFunc(match: any, capture: any) {
		const config = vscode.workspace.getConfiguration("vhvw-converter");
		let viewportHeight = config.get<number>('viewportHeight') || 720;
		let accuracy = config.get<number>('accuracy') || 2;
		return ((capture / viewportHeight) * 100).toFixed(accuracy) + 'vh';
	}

	function pxtovwFunc(match: any, capture: any) {
		const config = vscode.workspace.getConfiguration("vhvw-converter");
		let viewportWidth = config.get<number>('viewportWidth') || 720;
		let accuracy = config.get<number>('accuracy') || 2;

		return ((capture / viewportWidth) * 100).toFixed(accuracy) + 'vw';
	}
}

// This method is called when your extension is deactivated
export function deactivate() { }
