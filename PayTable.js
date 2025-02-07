
const paytableButton = new PIXI.Text('Paytable', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    fontWeight: 'bold',
    stroke: 0x000000,
    strokeThickness: 4,
});
paytableButton.x = 20; 
paytableButton.y = 600;
paytableButton.eventMode = 'static';
paytableButton.cursor = 'pointer'; 
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