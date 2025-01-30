const app = new PIXI.Application();
await app.init({
    resizeTo: window,
});
app.view.style.position = "absolute";

await PIXI.Assets.init({ manifest: "/manifest.json" });
const data = await PIXI.Assets.loadBundle("symbols");
console.log(data)
// data.map(()=>{})
const h1 = PIXI.Sprite.from(data.h1);
// app.stage.addChild(h1);
// const h2 = PIXI.Sprite.from(data.h2);
// h2.interactive = true;
// h2.buttonMode = true;
// h2.cursor = "pointer";
// h2.on('pointerdown', () => {
//     console.log("clicked")
// });

// app.stage.addChild(h2);

const graphics = new PIXI.Graphics();
graphics.beginFill(0xff0000);
graphics.drawCircle(100, 500, 50);
graphics.endFill();
app.stage.addChild(graphics);


const background = PIXI.Sprite.from(data.bonus);
background.x = 200


const c1 = new PIXI.Container();
c1.addChild(background, h1);
app.stage.addChild(c1);

app.ticker.add(() => {
    c1.x -= 2;  // Moves the background left
    if (c1.x <= -c1.width) {
        c1.x = 0;  // Resets position for infinite scrolling
    }
});

// const mask = new PIXI.Graphics();
// mask.beginFill(0xffffff);
// mask.drawRect(100, 100, 200,200);
// mask.endFill();
// c1.mask = mask;
// app.stage.addChild(mask);


// const emitter =  PIXI.Emitter(app.stage, {
//     lifetime: { min: 0.5, max: 1 },
//     frequency: 0.1,
//     particlesPerWave: 5,
//     maxParticles: 100,
//     textures: [PIXI.Texture.from('particle.png')],
// });
// app.stage.addChild(emitter);

// const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');
// const img = PIXI.Sprite.from(texture);
// img.x = 100;
// img.y = 100;
// img.anchor = 0.5;

// app.ticker.add(() => {
//     // img.rotation += 1.1
//     img.y += 10;
//     if (img.y > 500) {
//         img.y = 10;
//     }
//     h1.y += 20;
//     if (h1.y > 500) {
//         h1.y = 10;
//     }
// })

function addResize() {
    // img.x = window.innerWidth - 100;
    // img.y = 100;
}

window.addEventListener("resize", addResize)
// app.stage.addChild(img);
document.body.appendChild(app.view);