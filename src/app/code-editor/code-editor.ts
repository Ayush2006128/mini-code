import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import Lucide Angular icons
import { LucideAngularModule, Play, Code2, Palette, Zap, Eye, RotateCcw, Link2, 
  Copy, Download, MessageSquare, Sun, Moon, Layout, LayoutGrid, 
  Settings, Terminal, Trash2, Save, FileCode } from 'lucide-angular';

// Import Ace Editor
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';

@Component({
  selector: 'app-code-editor',
  imports: [CommonModule, FormsModule, DatePipe, LucideAngularModule],
  templateUrl: './code-editor.html',
  styleUrl: './code-editor.css'
})
export class CodeEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('htmlEditor', { static: false }) htmlEditorRef!: ElementRef;
  @ViewChild('cssEditor', { static: false }) cssEditorRef!: ElementRef;
  @ViewChild('jsEditor', { static: false }) jsEditorRef!: ElementRef;
  @ViewChild('preview', { static: false }) previewRef!: ElementRef;

  // Editor instances
  htmlEditor!: ace.Ace.Editor;
  cssEditor!: ace.Ace.Editor;
  jsEditor!: ace.Ace.Editor;

  // Code content
  htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MiniCode Preview</title>
</head>
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <p>Start coding to see your changes live!</p>
    <button onclick="changeColor()">Click me!</button>
  </div>
</body>
</html>`;

  cssCode = `body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

h1 {
  font-size: 3em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2em;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}`;

  jsCode = `function changeColor() {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = randomColor;
  
  console.log('Background changed to:', randomColor);
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 MiniCode Preview Loaded!');
  
  // Add keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      changeColor();
    }
  });
});`;

  // Layout and theme settings
  isDarkTheme = true;
  isVerticalLayout = false;
  
  // Update throttling
  private updateTimeout: any;
  
  // Console logging
  consoleMessages: Array<{type: 'log' | 'error' | 'warn', message: string, timestamp: Date}> = [];
  showConsole = false;
  
  // Lucide Icons
  readonly PlayIcon = Play;
  readonly Code2Icon = Code2;
  readonly PaletteIcon = Palette;
  readonly ZapIcon = Zap;
  readonly EyeIcon = Eye;
  readonly RotateCcwIcon = RotateCcw;
  readonly Link2Icon = Link2;
  readonly CopyIcon = Copy;
  readonly DownloadIcon = Download;
  readonly MessageSquareIcon = MessageSquare;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;
  readonly LayoutIcon = Layout;
  readonly LayoutGridIcon = LayoutGrid;
  readonly SettingsIcon = Settings;
  readonly TerminalIcon = Terminal;
  readonly Trash2Icon = Trash2;
  readonly SaveIcon = Save;
  readonly FileCodeIcon = FileCode;

  ngOnInit() {
    // Load saved code from localStorage
    this.loadFromStorage();
    
    // Listen for console messages from iframe
    window.addEventListener('message', (event) => {
      if (event.data.type === 'console-log') {
        this.addConsoleMessage('log', event.data.data);
      } else if (event.data.type === 'console-error') {
        this.addConsoleMessage('error', event.data.data);
      } else if (event.data.type === 'console-clear') {
        this.clearConsole();
      }
    });
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter or Cmd+Enter to run code
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      }
      
      // Ctrl+S or Cmd+S to save (prevent default)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.saveToStorage();
        // You could show a toast notification here
      }
      
      // Ctrl+Shift+L or Cmd+Shift+L to toggle layout
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        this.toggleLayout();
      }
      
      // Ctrl+Shift+T or Cmd+Shift+T to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        this.toggleTheme();
      }
      
      // Ctrl+` or Cmd+` to toggle console
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        this.toggleConsole();
      }
    });
  }

  ngAfterViewInit() {
    // Initialize editors after view is ready
    setTimeout(() => {
      this.initializeEditors();
      this.updatePreview();
    }, 100);
  }

  ngOnDestroy() {
    // Clean up editors
    if (this.htmlEditor) this.htmlEditor.destroy();
    if (this.cssEditor) this.cssEditor.destroy();
    if (this.jsEditor) this.jsEditor.destroy();
    
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
  }

  initializeEditors() {
    // Initialize HTML Editor
    this.htmlEditor = ace.edit(this.htmlEditorRef.nativeElement);
    this.setupEditor(this.htmlEditor, 'html', this.htmlCode);

    // Initialize CSS Editor
    this.cssEditor = ace.edit(this.cssEditorRef.nativeElement);
    this.setupEditor(this.cssEditor, 'css', this.cssCode);

    // Initialize JavaScript Editor
    this.jsEditor = ace.edit(this.jsEditorRef.nativeElement);
    this.setupEditor(this.jsEditor, 'javascript', this.jsCode);
  }

  setupEditor(editor: ace.Ace.Editor, mode: string, initialValue: string) {
    editor.setTheme(this.isDarkTheme ? 'ace/theme/monokai' : 'ace/theme/github');
    editor.session.setMode(`ace/mode/${mode}`);
    editor.setValue(initialValue, -1);
    
    // Editor options
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
      fontSize: '14px',
      showPrintMargin: false,
      wrap: true
    });

    // Listen for changes
    editor.on('change', () => {
      this.onCodeChange();
    });
  }

  onCodeChange() {
    // Update code variables
    this.htmlCode = this.htmlEditor.getValue();
    this.cssCode = this.cssEditor.getValue();
    this.jsCode = this.jsEditor.getValue();

    // Throttle preview updates
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    this.updateTimeout = setTimeout(() => {
      this.updatePreview();
      this.saveToStorage();
    }, 300);
  }

  updatePreview() {
    const previewFrame = this.previewRef.nativeElement;
    
    // Create the complete HTML document
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MiniCode Preview</title>
        <style>
          ${this.cssCode}
        </style>
      </head>
      <body>
        ${this.getBodyContent()}
        <script>
          // Capture console logs
          const originalLog = console.log;
          const originalError = console.error;
          
          window.parent.postMessage({ type: 'console-clear' }, '*');
          
          console.log = function(...args) {
            originalLog.apply(console, args);
            window.parent.postMessage({ 
              type: 'console-log', 
              data: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
            }, '*');
          };
          
          console.error = function(...args) {
            originalError.apply(console, args);
            window.parent.postMessage({ 
              type: 'console-error', 
              data: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
            }, '*');
          };
          
          // Error handling
          window.addEventListener('error', function(e) {
            console.error('JavaScript Error:', e.message, 'at line', e.lineno);
          });
          
          try {
            ${this.jsCode}
          } catch (error) {
            console.error('JavaScript execution error:', error.message);
          }
        </script>
      </body>
      </html>
    `;

    // Update iframe
    const blob = new Blob([fullHtml], { type: 'text/html' });
    previewFrame.src = URL.createObjectURL(blob);
  }

  getBodyContent(): string {
    // Extract body content from HTML
    const bodyMatch = this.htmlCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      return bodyMatch[1];
    }
    
    // If no body tags, return the HTML as-is
    return this.htmlCode.replace(/<!DOCTYPE[^>]*>/i, '')
                        .replace(/<\/?html[^>]*>/gi, '')
                        .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
                        .replace(/<\/?body[^>]*>/gi, '');
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const theme = this.isDarkTheme ? 'ace/theme/monokai' : 'ace/theme/github';
    
    if (this.htmlEditor) this.htmlEditor.setTheme(theme);
    if (this.cssEditor) this.cssEditor.setTheme(theme);
    if (this.jsEditor) this.jsEditor.setTheme(theme);
  }

  toggleLayout() {
    this.isVerticalLayout = !this.isVerticalLayout;
  }

  formatCode() {
    // Basic formatting - in a real app, you might use prettier or similar
    if (this.htmlEditor) {
      const session = this.htmlEditor.getSession();
      const code = session.getValue();
      // Simple indentation (you could integrate with prettier here)
      this.htmlEditor.setValue(code, -1);
    }
  }

  saveToStorage() {
    const data = {
      html: this.htmlCode,
      css: this.cssCode,
      js: this.jsCode,
      theme: this.isDarkTheme,
      layout: this.isVerticalLayout
    };
    localStorage.setItem('minicode-data', JSON.stringify(data));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('minicode-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.htmlCode = data.html || this.htmlCode;
        this.cssCode = data.css || this.cssCode;
        this.jsCode = data.js || this.jsCode;
        this.isDarkTheme = data.theme !== undefined ? data.theme : this.isDarkTheme;
        this.isVerticalLayout = data.layout || this.isVerticalLayout;
      } catch (e) {
        console.warn('Failed to load saved data:', e);
      }
    }
  }

  exportCode() {
    const zip = {
      'index.html': this.htmlCode,
      'styles.css': this.cssCode,
      'script.js': this.jsCode
    };
    
    // Simple download implementation
    Object.entries(zip).forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  runCode() {
    this.updatePreview();
  }
  
  // Console methods
  addConsoleMessage(type: 'log' | 'error' | 'warn', message: string) {
    this.consoleMessages.push({
      type,
      message,
      timestamp: new Date()
    });
    
    // Auto-show console on errors
    if (type === 'error' && !this.showConsole) {
      this.showConsole = true;
    }
  }
  
  clearConsole() {
    this.consoleMessages = [];
  }
  
  toggleConsole() {
    this.showConsole = !this.showConsole;
  }
  
  // Copy code functionality
  copyCode(type: 'html' | 'css' | 'js') {
    let code = '';
    switch (type) {
      case 'html':
        code = this.htmlCode;
        break;
      case 'css':
        code = this.cssCode;
        break;
      case 'js':
        code = this.jsCode;
        break;
    }
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        // Could show a toast notification here
        console.log(`${type.toUpperCase()} code copied to clipboard!`);
      });
    }
  }
  
  // Reset to default code
  resetCode() {
    if (confirm('Are you sure you want to reset all code? This cannot be undone.')) {
      this.loadDefaultCode();
      if (this.htmlEditor) this.htmlEditor.setValue(this.htmlCode, -1);
      if (this.cssEditor) this.cssEditor.setValue(this.cssCode, -1);
      if (this.jsEditor) this.jsEditor.setValue(this.jsCode, -1);
      this.updatePreview();
    }
  }
  
  private loadDefaultCode() {
    this.htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MiniCode Preview</title>
</head>
<body>
  <div class="container">
    <h1>Hello World!</h1>
    <p>Start coding to see your changes live!</p>
    <button onclick="changeColor()">Click me!</button>
  </div>
</body>
</html>`;

    this.cssCode = `body {
  font-family: 'Arial', sans-serif;
  margin: 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

h1 {
  font-size: 3em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2em;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}`;

    this.jsCode = `function changeColor() {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = randomColor;
  
  console.log('Background changed to:', randomColor);
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎯 MiniCode Preview Loaded!');
  
  // Add keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      changeColor();
    }
  });
});`;
  }
}
