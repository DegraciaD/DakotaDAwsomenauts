
game.ExperienceManager = Object.extend({
    init: function (x, y, settings) {
        this.alwaysUpdate = true;
        this.gameover = true;
    },
    update: function () {
        if (game.data.win === true && !this.gameover) {
            this.gameOver(true);
            console.log(game.data.exp)
        } else if (game.data.win === false && !this.gameover) {
            this.gameOver(false);
        }

        return true;
    },
    gameOver: function (win) {
        if (win) {
            game.data.exp += 10;
        } else {
            game.data.exp += 1;
        }
        this.gameover = true;
        me.save.exp = game.data.exp;
        console.log(me.save.exp);
    }
});

