export default class Juego extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("juego");
  }
  init() {
    this.contadorBounce = 0;
    this.contadorNivel = 0;
  }

  preload() {
    // load assets
    this.load.image("background", "/assets/background.png");
    this.load.image("base", "/assets/base.png");
    this.load.image("esfera", "/assets/esfera.png");
    this.load.image("obstaculo", "/assets/platform.png");
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    this.add.image(400, 300, "background");

    this.esfera = this.physics.add
      .image(400, 100, "esfera")
      .setScale(1.8)
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    this.base = this.physics.add
      .image(400, 560, "base")
      .setScale(0.35)
      .setImmovable(true)
      .setCollideWorldBounds(true);
    this.base.body.allowGravity = false;

    this.obstaculos = this.physics.add.group();

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.physics.add.collider(
      this.esfera,
      this.base,
      this.contadorRebote,
      null,
      this
    );
  }

  update() {
    this.base.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.base.setVelocityX(-300);
    } else if (this.cursors.right.isDown) {
      this.base.setVelocityX(300);
    } else if (this.cursors.up.isDown) {
      this.base.setVelocityY(-300);
    } else if (this.cursors.down.isDown) {
      this.base.setVelocityY(300);
    } else {
      this.base.setVelocityX(0);
    }
  }

  aumentarVelocidadEsfera() {
    this.esfera.setVelocityX(this.esfera.body.velocity.x * 1.1);
    this.esfera.setVelocityY(this.esfera.body.velocity.y * 1.1);
  }

  agregarObstaculo() {
    const randomX = Phaser.Math.RND.between(0, 800);
    const randomY = Phaser.Math.RND.between(0, 300);
    this.obstaculos.create(randomX, randomY, "obstaculo", 0, true);
  }

  pasarNivel() {
    this.contadorBounce = 0;
    this.contadorNivel++;
    console.log("Nivel : ", this.contadorNivel);
    this.agregarObstaculo();
    this.aumentarVelocidadEsfera();
  }

  contadorRebote(esfera, base) {
    this.contadorBounce++;
    console.log(this.contadorBounce);
    if (this.contadorBounce === 2) {
      this.pasarNivel();
    }
  }
}
