// const loadSymbols = async () => {
//     await PIXI.Assets.init({ manifest: "/manifest.json" });

//     textures = await PIXI.Assets.loadBundle("symbols");

//     const container = new PIXI.Container();
//     app.stage.addChild(container);

//     const symbolKeys = Object.keys(textures);

//     for (let col = 0; col < cols; col++) {
//         const reelContainer = new PIXI.Container();
//         reelContainer.x = startX + col * spacingX;
//         reelContainer.y = startY;
//         container.addChild(reelContainer);
//         reels.push(reelContainer);

//         for (let row = 0; row < rows ; row++) { // Add extra symbols above for smooth spin effect
//             const symbolName = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
//             const texture = textures[symbolName];

//             const sprite = new PIXI.Sprite(texture);
//             sprite.y = row * spacingY;
//             sprite.width = symbolWidth;
//             sprite.height = symbolHeight;
//             sprite.anchor.set(0.5);
//             reelContainer.addChild(sprite);
//         }
//     }

//     createSpinButton();
// };




// Spin Logic
// const spinReels = () => {
//     if (spinning) return;
//     spinning = true;

//     const spinDuration = 2000; // Total spin time (2 sec)
//     const easeOutTime = 500;   // Slow down duration
//     const symbolKeys = Object.keys(textures);

//     reels.forEach((reel, colIndex) => {
//         let targetY = reel.y - (spacingY * (rows + 2)); // Move symbols up
//         let speed = 20 + colIndex * 5; // Speed varies slightly per column

//         const spinAnimation = () => {
//             if (reel.y > targetY) {
//                 reel.y += speed;
//                 speed *= 0.96; // Gradually decrease speed (easing effect)
//                 requestAnimationFrame(spinAnimation);
//             } else {
//                 // Align symbols to final position
//                 reel.y = startY;

//                 // Reset symbols with new random ones
//                 for (let i = 0; i < reel.children.length; i++) {
//                     const sprite = reel.children[i];
//                     const symbolName = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
//                     sprite.texture = textures[symbolName];
//                 }

//                 if (colIndex === cols - 1) {
//                     spinning = false;
//                 }
//             }
//         };

//         setTimeout(spinAnimation, colIndex * 200); // Delay each reel's start
//     });
// };



// const mask = new PIXI.Graphics();
// mask.beginFill(0xffffff);
// mask.drawRect(100, 100, 200,200);
// mask.endFill();
// c1.mask = mask;
// app.stage.addChild(mask);


// function addResize() { }
// window.addEventListener("resize", addResize)



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
// Preload textures (example)
symbolKeys.forEach(symbol => {
    textures[symbol] = PIXI.Texture.from(`assets/${symbol}.png`);
});

// Initialize reels (example)
for (let i = 0; i < 3; i++) {
    const reel = {
        position: 0,
        previousPosition: 0,
        symbols: [],
        blur: new PIXI.BlurFilter(), // Add blur effect
    };
    for (let j = 0; j < 4; j++) {
        const symbol = new PIXI.Sprite(textures[symbolKeys[Math.floor(Math.random() * symbolKeys.length)]]);
        symbol.y = j * SYMBOL_SIZE;
        symbol.scale.set(Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height));
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        reel.symbols.push(symbol);
    }
    reels.push(reel);
}


let running = false;
// Start the spin

async function loadResponseJson() {
    const response = await fetch('./SpinResult.json'); // Update the path to your JSON file
    const data = await response.json();
    return data;
}


async function updateReelsFromResponse() {
    const responseData = await loadResponseJson();

    // Update each reel based on the stoppingPosition
    for (let i = 0; i < reels.length; i++) {
        const reelData = responseData.reels[i];
        const reel = reels[i];

        // Update the position of the reel
        reel.position = reelData.stoppingPosition;

        // Update the symbols in the reel
        for (let j = 0; j < reel.symbols.length; j++) {
            const symbol = reelData.symbols[j];
            const sprite = reel.symbols[j];

            // Set the texture for the symbol
            sprite.texture = textures[symbol];
            sprite.scale.x = sprite.scale.y = Math.min(SYMBOL_SIZE / sprite.texture.width, SYMBOL_SIZE / sprite.texture.height);
            sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2);
        }
    }

    // Highlight the winning lines
    highlightWinningLines(responseData.winningLines);
}
function highlightWinningLines(winningLines) {
    winningLines.forEach(line => {
        line.positions.forEach(pos => {
            const reel = reels[pos.reel];
            const symbol = reel.symbols[pos.row];
            symbol.tint = 0xffd700; // Gold color for highlighting
        });
    });

    // Reset the tint after a delay
    setTimeout(() => {
        winningLines.forEach(line => {
            line.positions.forEach(pos => {
                const reel = reels[pos.reel];
                const symbol = reel.symbols[pos.row];
                symbol.tint = 0xffffff; // Reset to original color
            });
        });
    }, 10000); // Reset after 10 seconds
}

// Call this function to update the reels based on the response.json file
updateReelsFromResponse();


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

function reelsComplete() {
    // Load the response.json file and update the reels
    updateReelsFromResponse();

    // Log the total win
    loadResponseJson().then(data => {
        console.log("Total Win:", data.totalWin);
    });

    running = false;
}

// Reels done handler
// function reelsComplete() {
//     const winData = checkWinLines(reels);
//     console.log("Total Win:", winData.totalWin);
//     generateResponseJson(winData); // Generate and download response.json
//     running = false;
// }
// Generate JSON response based on reels and win amount
// function generateSlotResponse(reels, winAmount) {
//     const reelData = reels.map((reel, index) => ({
//         reelNumber: index + 1,
//         symbols: reel.symbols.map(symbol => symbol.texture.textureCacheIds[0].split('/').pop().replace('.png', ''))
//     }));

//     return {
//         status: "success",
//         spinId: Date.now().toString(),
//         playerId: "player123",
//         balance: 10000 - 100 + winAmount, // Example balance calculation
//         betAmount: 100,
//         winnings: winAmount,
//         reels: reelData,
//         winningLines: checkWinLines(reels), // Implement this function to calculate winning lines
//         bonusFeatures: {
//             freeSpins: 0,
//             multiplier: 1
//         },
//         timestamp: new Date().toISOString()
//     };
// }

// Check winning lines (example implementation)
// function checkWinLines(reels) {
//     // Example logic: Check for 3 matching symbols in the middle row
//     const middleRow = reels.map(reel => reel.symbols[1].texture.textureCacheIds[0].split('/').pop().replace('.png', ''));
//     if (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
//         return 500; // Payout for 3 matching symbols
//     }
//     return 0;
// }

const checkWinLines = (reels) => {
    let totalWin = 0;
    let winningSymbols = [];

    // Iterate through each row (horizontal win check)
    for (let row = 0; row < 3; row++) { // Assuming 3 visible rows
        let matchCount = 1;
        let firstSymbol = reels[0].symbols[row].texture.textureCacheIds[0]; // First symbol in the row
        let currentWinningSymbols = [{ reel: 0, row, symbol: firstSymbol }];

        for (let col = 1; col < reels.length; col++) { // Iterate left to right
            let currentSymbol = reels[col].symbols[row].texture.textureCacheIds[0];

            if (currentSymbol === firstSymbol) {
                matchCount++;
                currentWinningSymbols.push({ reel: col, row, symbol: currentSymbol });
            } else {
                // If match breaks and matchCount is at least 3, register the win
                if (matchCount >= 3) {
                    winningSymbols.push(...currentWinningSymbols);
                    totalWin += matchCount * 5;
                }
                // Reset for next sequence
                matchCount = 1;
                firstSymbol = currentSymbol;
                currentWinningSymbols = [{ reel: col, row, symbol: currentSymbol }];
            }
        }

        // Final check for last column
        if (matchCount >= 3) {
            winningSymbols.push(...currentWinningSymbols);
            totalWin += matchCount * 5;
        }
    }

    return {
        totalWin,
        winningSymbols
    };
};

// Tweening utility
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

// Listen for animate update
app.ticker.add(() => {
    // Update the slots
    for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        // Update blur filter y amount based on speed
        r.blur.blurY = (r.position - r.previousPosition) * 8;
        r.previousPosition = r.position;

        // Update symbol positions on reel
        for (let j = 0; j < r.symbols.length; j++) {
            const s = r.symbols[j];
            const prevy = s.y;

            s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
            if (s.y < 0 && prevy > SYMBOL_SIZE) {
                // Detect going over and swap a texture
                const symbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
                s.texture = textures[symbol];
                s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
            }
        }
    }

    // Update tweening
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

// Basic lerp function
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

// Easing function
function backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}


// function generateResponseJson(winData) {
//     const response = {
//         winAmount: winData.totalWin,
//         symbols: winData.winningSymbols.map(symbol => ({
//             reel: symbol.reel,
//             row: symbol.row,
//             symbol: symbol.symbol
//         }))
//     };

//     // Convert the response object to JSON string
//     const jsonString = JSON.stringify(response, null, 2);

//     // Create a Blob and download the file
//     const blob = new Blob([jsonString], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'response.json';
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
// }

// async function loadResponseJson() {
//     const response = await fetch('./SpinResult.json');
//     const data = await response.json();

//     // Update the reels based on the response data
//     data.symbols.forEach(symbolInfo => {
//         const reel = reels[symbolInfo.reel];
//         const sprite = reel.symbols[symbolInfo.row];
//         sprite.texture = textures[symbolInfo.symbol];
//         sprite.scale.x = sprite.scale.y = Math.min(SYMBOL_SIZE / sprite.texture.width, SYMBOL_SIZE / sprite.texture.height);
//         sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2);
//     });
// }

// Call this function to load and apply the response.json data
// loadResponseJson();

document.body.appendChild(app.view);
