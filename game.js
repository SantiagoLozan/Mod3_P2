/*class Nivel {
  constructor(_contadorNivel, velocidadInicial) {
    this.contadorNivel = 0;
    this.contadorBounce = 0;
    this.velocidadInicial = velocidadInicial;
    this.velocidadActual = velocidadInicial + this.velocidadActual;
    this.obstaculos = [];
    console.log(Nivel);
  }

  aumentarVelocidad(porcentaje) {
    this.velocidadActual *= 1 + porcentaje / 100;
  }

  agregarObstaculo(obstaculo) {
    this.obstaculos.push(obstaculo);
  }
}*/

export default class Juego extends Phaser.Scene {
  constructor() {
    super("juego");
  }

  init() {
    this.contadorBounce = 0;
    this.contadorNivel = 1;
  }

  preload() {
    // load assets
    this.load.image("background", "./assets/background.png");
    this.load.image("base", "./assets/base.png");
    this.load.image("esfera", "./assets/esfera.png");
    this.load.image("obstaculo", "./assets/platform.png");
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
    this.camera = this.cameras.main;
    this.obstaculos = this.physics.add.staticGroup();

    this.physics.world.setBoundsCollision(true, true, true, true);

    this.physics.add.collider(
      this.esfera,
      this.base,
      this.contadorRebote,
      null,
      this
    );
    this.physics.add.collider(this.esfera, this.obstaculos, null, null, this);
    this.textoNivel = this.add.text(16, 16, "Nivel: 1", {
      fontSize: "20px",
      fill: "#fff",
      fontFamily: "verdana, arial, sans-serif",
    });
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
    const escalaAleatoria = Phaser.Math.RND.between(20, 50) / 100;
    const obstaculo = this.obstaculos
      .create(randomX, randomY, "obstaculo", 0, true)
      .setImmovable(true)
      .setScale(escalaAleatoria);
    obstaculo.setOrigin(0.5, 0.5);
    obstaculo.refreshBody();

    const nuevoAncho = obstaculo.width * escalaAleatoria;
    const nuevoAlto = obstaculo.height * escalaAleatoria;
    obstaculo.body.setSize(nuevoAncho, nuevoAlto);

    this.obstaculos.children.iterate((child) => {
      const childNuevoAncho = child.width * child.scaleX;
      const childNuevoAlto = child.height * child.scaleY;
      child.body.setSize(childNuevoAncho, childNuevoAlto);
    });
  }

  pasarNivel() {
    console.log("Nivel" + this.contadorNivel);
    this.contadorBounce = 0;
    this.contadorNivel++;
    this.textoNivel.setText("Nivel: " + this.contadorNivel);
    const nivelOpacity = 1 - this.contadorNivel * 0.05;

    const minOpacity = 0.03;
    this.cameras.main.setAlpha(Math.max(nivelOpacity, minOpacity));
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
export { Juego /*Nivel*/ };
