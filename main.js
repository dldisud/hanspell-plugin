const { Plugin, Notice, Modal } = require('obsidian');

class HanspellPlugin extends Plugin {
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
            new Notice('검사할 텍스트가 없습니다.');
            return;
        }

        new Notice('문법 검사 중...');

        try {
            const result = this.simpleSpellCheck(text);
            new ResultModal(this.app, result).open();
        } catch (error) {
            console.error('맞춤법 검사 중 오류 발생:', error);
            new Notice('문법 검사 중 오류가 발생했습니다.');
        }
    }

    simpleSpellCheck(text) {
        const commonErrors = [
            { wrong: '되여', correct: '되어' },
            { wrong: '됬', correct: '됐' },
            { wrong: '밟다', correct: '밟다' },
            { wrong: '뻐꾸기', correct: '뻐꾸기' },
            { wrong: '않돼', correct: '안 돼' },
            { wrong: '익숙치', correct: '익숙지' },
            { wrong: '수업듣고', correct: '수업 듣고' },
            { wrong: '웬지', correct: '왠지' },
            { wrong: '에요', correct: '이에요' },
            { wrong: '되요', correct: '됩니다' },
        ];

        const results = [];
        commonErrors.forEach(error => {
            const regex = new RegExp(error.wrong, 'g');
            const matches = text.match(regex);
            if (matches) {
                results.push({
                    token: error.wrong,
                    suggestions: [error.correct],
                    info: `'${error.wrong}'은(는) '${error.correct}'으로 쓰는 것이 맞습니다.`
                });
            }
        });

        return results;
    }

    onunload() {
        console.log('한글 문법 검사기 플러그인 언로드됨');
    }
}

class ResultModal extends Modal {
    constructor(app, result) {
        super(app);
        this.result = result;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.createEl('h2', { text: '문법 검사 결과' });

        if (this.result.length === 0) {
            contentEl.createEl('p', { text: '수정할 내용이 없습니다.' });
        } else {
            const ul = contentEl.createEl('ul');
            this.result.forEach(item => {
                const li = ul.createEl('li');
                li.createEl('strong', { text: item.token });
                li.createEl('span', { text: ` → ${item.suggestions.join(', ')}` });
                li.createEl('p', { text: item.info });
            });
        }
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

module.exports = HanspellPlugin;