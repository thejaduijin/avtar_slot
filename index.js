// const app = new PIXI.Application();
// await app.init({ resizeTo: window, });
// app.view.style.position = "absolute";

// const rows = 3;  // 3 Rows
// const cols = 5;  // 5 Columns
// const symbolWidth = 100;
// const symbolHeight = 100;
// const spacingX = 120; // Space between symbols horizontally
// const spacingY = 120; // Space between symbols vertically
// const startX = 225;  // X start position
// const startY = 125;   // Y start position

// let textures;
// let reels = []; // Stores each column's container
// let spinning = false;


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

//         const mask = new PIXI.Graphics();
//         mask.beginFill(0xffffff);
//         mask.drawRect(120, 50, 800, 380);
//         mask.endFill();
//         reelContainer.mask = mask;
//         app.stage.addChild(mask);

//         // Add 4 symbols (3 visible + 1 for smooth scrolling)
//         for (let row = 0; row < rows + 1; row++) {
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

// // Spin Logic
// // const spinReels = () => {
// //     if (spinning) return;
// //     spinning = true;

// //     const symbolKeys = Object.keys(textures);
// //     const spinSpeed = 15;
// //     const spinTime = 2000;

// //     reels.forEach((reel, colIndex) => {
// //         let elapsed = 0;

// //         const spinAnimation = () => {
// //             if (!spinning) return;

// //             elapsed += spinSpeed;

// //             // Move symbols downward
// //             reel.children.forEach(symbol => {
// //                 symbol.y += spinSpeed;
// //                 console.log(symbol.y)
// //                 if (symbol.y > 300) {
// //                     symbol.y = 50
// //                 }
// //             });

// //             // If the first symbol moves out of view, recycle it
// //             if (reel.children[0].y >= rows * spacingY) {
// //                 const firstSymbol = reel.children.shift();
// //                 firstSymbol.y = reel.children[reel.children.length - 1].y - spacingY;
// //                 firstSymbol.texture = textures[symbolKeys[Math.floor(Math.random() * symbolKeys.length)]];
// //                 reel.addChild(firstSymbol);
// //             }

// //             if (elapsed < spinTime) {
// //                 requestAnimationFrame(spinAnimation);
// //             } else {
// //                 spinning = false;
// //                 resetReelPosition(reel);
// //             }
// //         };

// //         setTimeout(spinAnimation, colIndex * 300); // Staggered start for each reel
// //     });
// // };


// // const spinReels = () => {
// //     if (spinning) return;
// //     spinning = true;

// //     const symbolKeys = Object.keys(textures);
// //     const spinSpeed = 15;
// //     const spinTime = 2000;

// //     reels.forEach((reel, colIndex) => {
// //         let elapsed = 0;

// //         const spinAnimation = () => {
// //             if (!spinning) return;

// //             elapsed += spinSpeed;

// //             reel.children.forEach((symbol, index) => {
// //                 symbol.y += spinSpeed;

// //                 // Check if symbol has moved beyond the visible area (i.e., exceeds the last row position)
// //                 if (symbol.y > rows * spacingY) {
// //                     // Move the symbol to the top of the reel (just below the last visible symbol)
// //                     symbol.y = reel.children[reel.children.length - 1].y - spacingY;

// //                     // Reassign the symbol texture to simulate "looping" by changing it randomly
// //                     symbol.texture = textures[symbolKeys[Math.floor(Math.random() * symbolKeys.length)]];
// //                 }
// //             });

// //             // Continue the spin animation until the spin time ends
// //             if (elapsed < spinTime) {
// //                 requestAnimationFrame(spinAnimation);
// //             } else {
// //                 spinning = false;
// //                 resetReelPosition(reel);
// //             }
// //         };

// //         // Start spinning the reel with a slight delay between each reel
// //         setTimeout(spinAnimation, colIndex * 300);
// //     });
// // };

// function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
//     const tween = {
//         object,
//         property,
//         propertyBeginValue: object[property],
//         target,
//         easing,
//         time,
//         change: onchange,
//         complete: oncomplete,
//         start: Date.now(),
//     };

//     tweening.push(tween);

//     return tween;
// }

// function startPlay() {
//     if (running) return;
//     running = true;

//     for (let i = 0; i < reels.length; i++) {
//         const r = reels[i];
//         const extra = Math.floor(Math.random() * 3);
//         const target = r.position + 10 + i * 5 + extra;
//         const time = 2500 + i * 600 + extra * 600;

//         tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
//     }
// }

// const spinReels = () => {
//     if (spinning) return;
//     spinning = true;

//     const symbolKeys = Object.keys(textures);
//     const spinSpeed = 10;  // Spin speed, you can adjust it as needed
//     const spinTime = 2000; // Duration for the spin (in ms)
//     const reelHeight = rows * spacingY;

//     reels.forEach((reel, colIndex) => {
//         let elapsed = 0;

//         // Reset the initial positions of the reel to avoid stale positions
//         reel.children.forEach((symbol, index) => {
//             symbol.y = index * spacingY; // Reset Y position to the original layout
//         });

//         const spinAnimation = () => {
//             if (!spinning) return;

//             elapsed += spinSpeed;

//             reel.children.forEach((symbol) => {
//                 symbol.y += spinSpeed;

//                 // Check if symbol has moved beyond the visible area (below the last row position)
//                 if (symbol.y > reelHeight) {
//                     // Move the symbol back to the top of the reel, without overlapping
//                     symbol.y = reel.children[reel.children.length - 1].y - spacingY;

//                     // Randomly change the symbol's texture to simulate the reel looping
//                     const randomSymbol = symbolKeys[Math.floor(Math.random() * symbolKeys.length)];
//                     symbol.texture = textures[randomSymbol];
//                 }
//             });

//             // Continue the spin animation until the spin time ends
//             if (elapsed < spinTime) {
//                 requestAnimationFrame(spinAnimation);
//             } else {
//                 spinning = false;
//                 resetReelPosition(reel); // Reset the reel back to its original position
//             }
//         };

//         setTimeout(spinAnimation, colIndex * 300); // Staggered start for each reel
//     });
// };

// // Reset reel position
// const resetReelPosition = (reel) => {
//     reel.children.forEach((symbol, index) => {
//         symbol.y = index * spacingY; // Reset Y to the original layout after the spin
//     });
// };


// // Reset Reel Position
// // const resetReelPosition = (reel) => {
// //     for (let i = 0; i < reel.children.length; i++) {
// //         reel.children[i].y = i * spacingY;
// //     }
// // };

// // Create Spin Button
// const createSpinButton = () => {
//     const button = document.createElement("button");
//     button.innerText = "SPIN";
//     button.style.position = "absolute";
//     button.style.left = "50%";
//     button.style.bottom = "20px";
//     button.style.transform = "translateX(-50%)";
//     button.style.padding = "10px 20px";
//     button.style.fontSize = "20px";
//     button.style.cursor = "pointer";
//     document.body.appendChild(button);

//     button.addEventListener("click", spinReels);
// };

// // Load Symbols when the page loads
// loadSymbols().catch(console.error);



// document.body.appendChild(app.view); 