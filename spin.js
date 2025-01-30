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