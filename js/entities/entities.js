game.PlayerEntity = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                getShape: function () {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        this.body.setVelocity(5, 20);
        // keeps track of witch direction your character  is going
        this.facing = "right";
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("Attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        this.renderable.setCurrentAnimation("idle");

    },
    update: function (delta) {
        if (me.input.isKeyPressed("right")) {
            //sets the position of my x by adding the velocity defined above in 
            //setVelocity() and mutiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth
            this.facing = "right";
            this.renderable.flipX(true);
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            


        } else if (me.input.isKeyPressed("left")) {
            this.facing = "left";
            this.renderable.flipX(false);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
             

        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed("Attack")) {
            console.log("Attack");
            if (!this.renderable.isCurrentAnimation("Attack")) {
                //Sets the current animation to attack and once that is over
                //goes back to the idle animation
                this.renderable.setCurrentAnimation("Attack", "idle");
                //Makes is so that the next time we start this sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animmation
                this.renderable.setAnimationFrame();
                me.audio.play("21");
                
            }
        }
        else if (this.body.vel.x !== 0) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else if (!this.renderable.isCurrentAnimation("Attack")) {
            this.renderable.setCurrentAnimation("walk");
        }


        if (me.input.isKeyPressed("jump")) {

            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            me.audio.play("21");
        }


        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this.body.update(delta);



        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function (response) {
        if (response.b.type === "EnemybaseEntity") {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            console.log("xdif" + xdif + "ydif" + ydif);

            if (xdif > -35 && this.facing === "right" && (xdif < 0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === "left" && (xdif > 0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1;
            }else if(ydif<-40){
                this.body.falling = false;
            }
        }
    }
});
game.PlayerbaseEntity = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spritehieght: "100",
                getShape: function () {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "PlayerbaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");


    },
    update: function (delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function () {

    }
});

game.EnemybaseEntity = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "tower",
                width: 100,
                height: 100,
                spritewidth: "100",
                spritehieght: "100",
                getShape: function () {
                    return (new me.Rect(0, 0, 100, 70)).toPolygon();
                }
            }]);
        this.broken = false;
        this.health = 10;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "EnemybaseEntity";

        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("broken", [1]);
        this.renderable.setCurrentAnimation("idle");


    },
    update: function (delta) {
        if (this.health <= 0) {
            this.broken = true;
            this.renderable.setCurrentAnimation("broken");
        }
        this.body.update(delta);

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    onCollision: function () {

    }
});