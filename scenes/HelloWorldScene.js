export default class HelloWorldScene extends Phaser.Scene {

    constructor() {
        super('HelloWorldScene')
    }

    preload() {

        this.load.image('bg', 'public/assets/space3.png')

        this.load.image('player', 'public/assets/player.png')

        this.load.image('square', 'public/assets/square.png')
        this.load.image('triangle', 'public/assets/triangle.png')
        this.load.image('diamond', 'public/assets/diamond.png')
        this.load.image('bad', 'public/assets/bad.png')

        this.load.image('ground', 'public/assets/ground.png')

    }

    create() {

        // Fondo
        this.add.image(400, 300, 'bg')

        // Variables
        this.score = 0
        this.timeLeft = 60
        this.collectedItems = []

        // Texto score
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff'
        })

        // Texto timer
        this.timerText = this.add.text(600, 20, 'Time: 60', {
            fontSize: '32px',
            fill: '#fff'
        })

        // Piso
        this.platforms = this.physics.add.staticGroup()

        this.platforms.create(400, 580, 'ground')

        this.platforms.create(-100, 400, 'ground')

        this.platforms.create(1000, 300, 'ground')

        this.platforms.create(-100, 200, 'ground')

        // Jugador
        this.player = this.physics.add.sprite(400, 400, 'player')

        this.player.setCollideWorldBounds(true)

        this.physics.add.collider(this.player, this.platforms)

        // Teclado
        this.cursors = this.input.keyboard.createCursorKeys()

        // Grupo de figuras
        this.items = this.physics.add.group()

        this.physics.add.collider(
          this.items,
          this.platforms,
          this.hitPlatform,
          null,
          this
        )

        // Recolección
        this.physics.add.overlap(
            this.player,
            this.items,
            this.collectItem,
            null,
            this
        )

        // Spawn de figuras
        this.time.addEvent({
            delay: 500,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        })

        // Timer
        this.time.addEvent({
            delay: 1000,
            callback: () => {

                this.timeLeft--

                this.timerText.setText('Time: ' + this.timeLeft)

                if (this.timeLeft <= 0) {

                    this.add.text(250, 300, 'PERDISTE', {
                        fontSize: '64px',
                        fill: '#ff0000'
                    })

                    this.scene.start('EndScene', {
                      win: false,
                      score: this.score
                    })
                }

            },
            loop: true
        })
    }

    update() {

      // Movimiento horizontal
      if (this.cursors.left.isDown) {

        this.player.setVelocityX(-300)

      }
      else if (this.cursors.right.isDown) {

        this.player.setVelocityX(300)

      }
      else {

        this.player.setVelocityX(0)
      }

      // Salto
      if (
        this.cursors.up.isDown &&
        this.player.body.touching.down
      ) {

        this.player.setVelocityY(-300)
      }
    }

    spawnItem() {

      const types = ['square', 'triangle', 'diamond', 'bad']

      const randomType = Phaser.Utils.Array.GetRandom(types)

      const x = Phaser.Math.Between(50, 750)

      const item = this.items.create(x, 0, randomType)

      item.type = randomType
      item.rebounds = 0

      item.setBounce(1)

      if (randomType === 'square') {
        item.points = 10
      }

      if (randomType === 'triangle') {
        item.points = 15
      }

      if (randomType === 'diamond') {
        item.points = 20
      }

      if (randomType === 'bad') {
        item.points = -20
      }
    }

    hitPlatform(item, platform) {

      item.points -= 5

      if (item.points <= 0) {

        item.destroy()
      }
    }

    collectItem(player, item) {

        if (item.type === 'bad') {

        this.score -= 20

    }
        else {

        this.score += item.points

        this.collectedItems.push(item.type)
    }

        item.destroy()

        this.scoreText.setText('Score: ' + this.score)

        if (this.score >= 100) {

        this.scene.start('EndScene', {
            win: true,
            score: this.score
        })
    }
  }
}