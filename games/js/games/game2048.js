/* ============================================
   2048 GAME EMBED WRAPPER
   ============================================ */

const Game2048 = {
    iframe: null,

    init(container, level) {
        this.cleanup();
        const safeLevel = Number.isFinite(level) ? level : 1;
        container.innerHTML = `
            <div class="embedded-game-shell" style="width:100%;min-height:75vh;border-radius:16px;overflow:hidden;background:#0f0f1a;">
                <iframe
                    title="2048"
                    src="2048.html?level=${encodeURIComponent(String(safeLevel))}"
                    style="width:100%;height:75vh;border:0;display:block;background:#0f0f1a;"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                ></iframe>
            </div>
        `;

        this.iframe = container.querySelector('iframe');
    },

    showHint() {
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.postMessage({ type: 'game-hint', game: '2048' }, '*');
        }
    },

    cleanup() {
        if (this.iframe) {
            this.iframe.src = 'about:blank';
            this.iframe = null;
        }
    }
};
