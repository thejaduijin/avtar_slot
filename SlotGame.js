const app = new PIXI.Application();
await app.init({ resizeTo: window, });
app.view.style.position = "absolute";

await PIXI.Assets.init({ manifest: "/manifest.json" });
let textures = await PIXI.Assets.loadBundle("symbols");

const container = new PIXI.Container();
app.stage.addChild(container);

const symbolKeys = Object.keys(textures);
const reels = [];
const reelContainer = new PIXI.Container();

const mask = new PIXI.Graphics();
mask.beginFill(0xffffff);
mask.drawRect(0, 0, 800, 450);
mask.endFill();
reelContainer.mask = mask;
app.stage.addChild(mask);


const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

for (let i = 0; i < 5; i++) {
    const rc = new PIXI.Container();

    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new PIXI.BlurFilter(),
    };

    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < 4; j++) {
        const symbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
        // Scale the symbol to fit symbol area.

        const texture = textures[symbol];
        const sprite = new PIXI.Sprite(texture);
        sprite.y = j * SYMBOL_SIZE;
        sprite.scale.x = sprite.scale.y = Math.min(SYMBOL_SIZE / sprite.width, SYMBOL_SIZE / sprite.height);
        sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2);
        reel.symbols.push(sprite);
        rc.addChild(sprite);
    }
    reels.push(reel);
}
app.stage.addChild(reelContainer);

// Build top & bottom covers and position reelContainer
const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
// reelContainer.y = margin;
// reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
const top = new PIXI.Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 0x0 });
const bottom = new PIXI.Graphics().rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin).fill({ color: 0x0 });
const fill = new PIXI.FillGradient(0, 0, 0, 36 * 1.7);
const colors = [0xffffff, 0x00ff99].map((color) => PIXI.Color.shared.setValue(color).toNumber());

colors.forEach((number, index) => {
    const ratio = index / colors.length;
    fill.addColorStop(ratio, number);
});

// Add play text
const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: { fill },
    stroke: { color: 0x4a1850, width: 5 },
    dropShadow: {
        color: 0x000000,
        angle: Math.PI / 6,
        blur: 4,
        distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
});
const playText = new PIXI.Text('Click For Spin', style);
playText.x = Math.round((bottom.width - playText.width) / 2);
playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
bottom.addChild(playText);

app.stage.addChild(bottom);

// Set the interactivity.
bottom.eventMode = 'static';
bottom.cursor = 'pointer';
bottom.addListener('pointerdown', () => {
    startPlay();
});

let running = false;

// Function to start playing.
function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        const extra = Math.floor(Math.random() * 3);
        const target = r.position + 10 + i * 5 + extra;
        const time = 2500 + i * 600 + extra * 600;

        tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
    }
}
// Reels done handler.
function reelsComplete() {
    const winAmount = checkWinLines(reels);
    console.log("Total Win:", winAmount);
    running = false;
}


// Listen for animate update.
app.ticker.add(() => {
    // Update the slots.
    for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        // Update blur filter y amount based on speed.
        // This would be better if calculated with time in mind also. Now blur depends on frame rate.

        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        // Update symbol positions on reel.
        for (let j = 0; j < r.symbols.length; j++) {
            const s = r.symbols[j];
            const prevy = s.y;

            s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            if (s.y < 0 && prevy > SYMBOL_SIZE) {
                // Detect going over and swap a texture.
                // This should in proper product be determined from some logical reel.
                let symbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)]

                s.texture = textures[symbol];
                s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
            }
        }
    }
});

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening = [];

function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);

    return tween;
}

// Listen for animate update.
app.ticker.add(() => {
    const now = Date.now();
    const remove = [];

    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

// Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}
function backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}



const checkWinLines = (reels) => {
    let totalWin = 0;
    let winningSymbols = [];

    // Iterate through each row (horizontal win check)
    for (let row = 0; row < 3; row++) { // Assuming 3 visible rows
        let matchCount = 1;
        let firstSymbol = reels[0].symbols[row].texture; // First symbol in the row
        let currentWinningSymbols = [{ reel: 0, row }];

        for (let col = 1; col < reels.length; col++) { // Iterate left to right
            let currentSymbol = reels[col].symbols[row].texture;

            if (currentSymbol === firstSymbol) {
                matchCount++;
                currentWinningSymbols.push({ reel: col, row });
            } else {
                // If match breaks and matchCount is at least 3, register the win
                if (matchCount >= 3) {
                    winningSymbols.push(...currentWinningSymbols);
                    totalWin += matchCount * 5;
                }
                // Reset for next sequence
                matchCount = 1;
                firstSymbol = currentSymbol;
                currentWinningSymbols = [{ reel: col, row }];
            }
        }

        // Final check for last column
        if (matchCount >= 3) {
            winningSymbols.push(...currentWinningSymbols);
            totalWin += matchCount * 5;
        }
    }

    // Highlight winning symbols
    highlightWinningSymbols(winningSymbols);

    return totalWin;
};

// Function to highlight winning symbols
const highlightWinningSymbols = (winningSymbols) => {
    winningSymbols.forEach(({ reel, row }) => {
        const symbol = reels[reel].symbols[row];
        symbol.tint = 0xffd700; // Gold color for highlighting win
    });

    setTimeout(() => {
        winningSymbols.forEach(({ reel, row }) => {
            reels[reel].symbols[row].tint = 0xffffff; // Reset after animation
        });
    }, 2000);
};



document.body.appendChild(app.view);

