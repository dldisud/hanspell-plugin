import { Plugin, MarkdownView, Notice } from 'obsidian';
import { spawn } from 'child_process';

export default class HanspellPlugin extends Plugin {
  async onload() {
    console.log('한글 문법 검사기 플러그인 로드됨');

    this.addCommand({
      id: 'run-hanspell',
      name: '한글 문법 검사 실행',
      editorCallback: (editor) => this.runHanspell(editor)
    });
  }

  async runHanspell(editor: any) {
    const selection = editor.getSelection();
    const text = selection || editor.getValue();

    if (!text) {
      new Notice('검사할 텍스트가 없습니다.');
      return;
    }

    try {
      const result = await this.executeHanspell(text);
      this.displayResults(result);
    } catch (error) {
      console.error('Hanspell 실행 중 오류 발생:', error);
      new Notice('문법 검사 중 오류가 발생했습니다.');
    }
  }

  executeHanspell(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hanspell = spawn('node', ['/path/to/hanspell/cli.js', '-p']);
      let output = '';

      hanspell.stdin.write(text);
      hanspell.stdin.end();

      hanspell.stdout.on('data', (data) => {
        output += data.toString();
      });

      hanspell.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(`Hanspell 프로세스가 ${code} 코드로 종료되었습니다.`);
        }
      });

      hanspell.on('error', (err) => {
        reject(`Hanspell 실행 중 오류 발생: ${err.message}`);
      });
    });
  }

  displayResults(result: string) {
    // 결과를 표시하는 로직을 구현하세요.
    // 예: 새 노트에 결과를 작성하거나 모달 창으로 표시
    new Notice('문법 검사가 완료되었습니다.');
    console.log(result);
  }

  onunload() {
    console.log('한글 문법 검사기 플러그인 언로드됨');
  }
}
