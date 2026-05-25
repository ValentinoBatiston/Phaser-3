export default class EndScene extends Phaser.Scene {

    constructor() {
        super('EndScene')
    }

    init(data) {

        this.win = data.win
        this.score = data.score
    }

    create() {

        const result =
            this.win ? 'GANASTE' : 'PERDISTE'

        this.add.text(250, 200, result, {
            fontSize: '64px',
            fill: '#ffffff'
        })

        this.add.text(
            250,
            320,
            'Puntaje: ' + this.score,
            {
                fontSize: '32px',
                fill: '#ffffff'
            }
        )

        this.add.text(
            150,
            450,
            'ESPACIO para reiniciar',
            {
                fontSize: '28px',
                fill: '#ffff00'
            }
        )

        this.input.keyboard.once(
            'keydown-SPACE',
            () => {
                this.scene.start('HelloWorldScene')
            }
        )
    }
}