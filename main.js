'use strict';

var obsidian = require('obsidian');

class HanspellPlugin extends obsidian.Plugin {
    async onload() {
        console.log('한글 문법 검사기 플러그인 로드됨');

        this.addCommand({
            id: 'run-hanspell',
            name: '한글 문법 검사 실행',
            editorCallback: (editor, view) => this.runHanspell(editor)
        });
    }

    async runHanspell(editor) {
        const selection = editor.getSelection();
        const text = selection || editor.getValue();

        if (!text) {
            console.log('검사할 텍스트가 없습니다.');
            return;
        }

        console.log('문법 검사를 시작합니다:', text);
        // 여기에 hanspell 실행 로직을 추가하세요.
    }

    onunload() {
        console.log('한글 문법 검사기 플러그인 언로드됨');
    }
}

module.exports = HanspellPlugin;