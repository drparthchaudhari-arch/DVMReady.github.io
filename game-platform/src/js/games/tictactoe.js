/* ============================================
   TIC TAC TOE GAME EMBED WRAPPER
   ============================================ */

const TicTacToe = {
    iframe: null,

    init(container, level) {
        this.cleanup();
        const safeLevel = Number.isFinite(level) ? level : 1;
        container.innerHTML = `
            <div class="embedded-game-shell" style="width:100%;min-height:75vh;border-radius:16px;overflow:hidden;background:#0f172a;">
                <iframe
                    title="Tic Tac Toe"
                    src="tic-tac-toe.html?level=${encodeURIComponent(String(safeLevel))}"
                    style="width:100%;height:75vh;border:0;display:block;background:#fff;"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                ></iframe>
            </div>
        `;

        this.iframe = container.querySelector('iframe');
    },

    showHint() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({ type: 'game-hint', game: 'tictactoe' }, '*');
        }
    },

    cleanup() {
        if (this.iframe) {
            this.iframe.src = 'about:blank';
            this.iframe = null;
        }
    }
};
