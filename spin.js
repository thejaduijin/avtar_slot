const app = new PIXI.Application();
await app.init({ resizeTo: window });
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

// Function to create a reel
function createReel(x) {
    const rc = new PIXI.Container();
    rc.x = x * REEL_WIDTH;
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

    for (let j = 0; j < 4; j++) {
        const symbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
        const texture = textures[symbol];
        const sprite = new PIXI.Sprite(texture);
        sprite.y = j * SYMBOL_SIZE;
        sprite.scale.x = sprite.scale.y = Math.min(SYMBOL_SIZE / sprite.width, SYMBOL_SIZE / sprite.height);
        sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2);
        reel.symbols.push(sprite);
        rc.addChild(sprite);
    }
    return reel;
}

for (let i = 0; i < 5; i++) {
    reels.push(createReel(i));
}
app.stage.addChild(reelContainer);

const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
const top = new PIXI.Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 0x0 });
const bottom = new PIXI.Graphics().rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin).fill({ color: 0x0 });

const style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: { fill: new PIXI.FillGradient(0, 0, 0, 36 * 1.7).addColorStop(0, 0xffffff).addColorStop(1, 0x00ff99) },
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

bottom.eventMode = 'static';
bottom.cursor = 'pointer';
bottom.addListener('pointerdown', () => {
    startPlay();
});

let running = false;

function startPlay() {
    if (running) return;
    running = true;

    reels.forEach((reel, i) => {
        const extra = Math.floor(Math.random() * 3);
        const target = reel.position + 10 + i * 5 + extra;
        const time = 2500 + i * 600 + extra * 600;

        tweenTo(reel, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
    });
}

function reelsComplete() {
    const winAmount = checkWinLines(reels);
    console.log("Total Win:", winAmount);
    running = false;
}

app.ticker.add(() => {
    reels.forEach(reel => {
        reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
        reel.previousPosition = reel.position;

        reel.symbols.forEach((symbol, j) => {
            const prevy = symbol.y;
            symbol.y = ((reel.position + j) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            if (symbol.y < 0 && prevy > SYMBOL_SIZE) {
                let symbolKey = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
                symbol.texture = textures[symbolKey];
                symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.texture.width, SYMBOL_SIZE / symbol.texture.height);
                symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            }
        });
    });
});

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

app.ticker.add(() => {
    const now = Date.now();
    const remove = [];
    tweening.forEach(t => {
        const phase = Math.min(1, (now - t.start) / t.time);
        t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    });
    remove.forEach(t => tweening.splice(tweening.indexOf(t), 1));
});

function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function backout(amount) {
    return t => --t * t * ((amount + 1) * t + amount) + 1;
}

function checkWinLines(reels) {
    let totalWin = 0;
    let winningSymbols = [];

    for (let row = 0; row < 3; row++) {
        let matchCount = 1;
        let firstSymbol = reels[0].symbols[row].texture;
        let currentWinningSymbols = [{ reel: 0, row }];

        for (let col = 1; col < reels.length; col++) {
            let currentSymbol = reels[col].symbols[row].texture;

            if (currentSymbol === firstSymbol) {
                matchCount++;
                currentWinningSymbols.push({ reel: col, row });
            } else {
                if (matchCount >= 3) {
                    winningSymbols.push(...currentWinningSymbols);
                    totalWin += matchCount * 5;
                }
                matchCount = 1;
                firstSymbol = currentSymbol;
                currentWinningSymbols = [{ reel: col, row }];
            }
        }

        if (matchCount >= 3) {
            winningSymbols.push(...currentWinningSymbols);
            totalWin += matchCount * 5;
        }
    }

    highlightWinningSymbols(winningSymbols);
    return totalWin;
}

function highlightWinningSymbols(winningSymbols) {
    winningSymbols.forEach(({ reel, row }) => {
        const symbol = reels[reel].symbols[row];
        symbol.tint = 0xffd700;
    });

    setTimeout(() => {
        winningSymbols.forEach(({ reel, row }) => {
            reels[reel].symbols[row].tint = 0xffffff;
        });
    }, 2000);
}

// ... (previous code remains the same until the bottom section)

// Create a button for the paytable
const paytableButton = new PIXI.Text('Paytable', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: 'bold',
    stroke: 0x000000,
    strokeThickness: 4,
});
paytableButton.x = 20; // Position the button
paytableButton.y = 600;
paytableButton.eventMode = 'static'; // Make it interactive
paytableButton.cursor = 'pointer'; // Change cursor on hover
app.stage.addChild(paytableButton);

// Create a paytable overlay (a simple container with text)
const paytableOverlay = new PIXI.Container();
paytableOverlay.visible = false; // Initially hidden
app.stage.addChild(paytableOverlay);

// Add a background for the paytable
const paytableBackground = new PIXI.Graphics();
paytableBackground.beginFill(0x000000, 0.8); // Semi-transparent black
paytableBackground.drawRect(0, 0, app.screen.width, app.screen.height);
paytableBackground.endFill();
paytableOverlay.addChild(paytableBackground);

// Add paytable text
const paytableText = new PIXI.Text('Paytable\n\n3 Symbols: 5x\n4 Symbols: 10x\n5 Symbols: 20x', {
    fontFamily: 'Arial',
    fontSize: 36,
    fill: 0xffffff,
    align: 'center',
});
paytableText.anchor.set(0.5);
paytableText.x = app.screen.width / 2;
paytableText.y = app.screen.height / 2;
paytableOverlay.addChild(paytableText);

const closeButton = new PIXI.Text('Close', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: 'bold',
    stroke: 0x000000,
    strokeThickness: 4,
});
closeButton.x = app.screen.width - 100; 
closeButton.y = 20;
closeButton.eventMode = 'static'; 
closeButton.cursor = 'pointer'; 
paytableOverlay.addChild(closeButton);


paytableButton.on('pointerdown', () => {
    paytableOverlay.visible = true; 
});

closeButton.on('pointerdown', () => {
    paytableOverlay.visible = false;
});

paytableOverlay.zIndex = 1000;

document.body.appendChild(app.view);