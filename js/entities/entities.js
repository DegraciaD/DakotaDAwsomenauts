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
        this.type = "PlayerEntity";
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        // keeps track of witch direction your character  is going
        this.facing = "right";
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.dead = false;
        this.lastAttack = new Date().getTime(); //Haven't used this
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        this.renderable.addAnimation("idle", [78]);
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
        this.renderable.addAnimation("Attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
        this.renderable.setCurrentAnimation("idle");

    },
    update: function (delta) {
        this.now = new Date().getTime();
        
        if (this.health <=0){
            this.dead = true;                  
        }
        
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
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("Attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } 
        else if (!this.renderable.isCurrentAnimation("Attack")) {
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
    loseHealth: function (damage) {
        this.health = this.health - damage;
        console.log(this.health);
    },
    collideHandler: function (response) {
        if (response.b.type === "EnemybaseEntity") {
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;

            console.log("xdif" + xdif + "ydif" + ydif);

            if (ydif < -40 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            if (xdif > -35 && this.facing === "right" && (xdif < 0)) {
                this.body.vel.x = 0;
               // this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === "left" && (xdif > 0)) {
                this.body.vel.x = 0;
               // this.pos.x = this.pos.x + 1;
            } else if (ydif < -40) {
                this.body.falling = false;
                this.pos.y = this.pos.y - 1;
            }
            if (!this.renderable.isCurrentAnimation("Attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
                console.log("tower Hit");
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        }else if(response.b.type==="EnemyCreep"){
            var xdif = this.pos.x - response.b.pos.x;
            var ydif = this.pos.y - response.b.pos.y;
            
            if (xdif>0){
                //this.pos.x = this.pos.x + 1;
                if(this.facing=="left"){
                    this.body.vel.x = 0;
                }
            }else{
             //this.pos.y = this.pos.y - 1; 
             if(this.facing=="right"){
                  this.body.vel.x = 0;
             }
            }
            
            if(this.renderable.isCurrentAnimation("Attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                  && (Math.abs(ydif) <=40) && 
                  (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing=="right")) 
                  ){
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
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
        this.health = game.data.playerBaseHealth;
        this.alwaysUpdate = true;
        this.body.onCollision = this.onCollision.bind(this);
        this.type = "Playerbase";

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
    loseHealth: function (damage) {
        this.health = this.health - damage;
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
        this.health = game.data.enemyBaseHealth;
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

    },
    loseHealth: function () {
        this.health--;
    }

});

game.EnemyCreep = me.Entity.extend({
    init: function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "creep1",
                width: 32,
                height: 64,
                spritewidth: "32",
                spriteheight: "64",
                getShape: function () {
                    return (new me.Rect(0, 0, 32, 64)).toPolygon();
                }
            }]);
        this.health = game.data.enemyCreepHealth;
        this.alwaysUpdate = true;
        //this.attack lets us know if the ennemy is currently attacking
        this.attacking = false;
        //keeps track if when our creep last attacked anything
        this.lastAttacking = new Date().getTime();
        //keep track of the last time our creep hit anything
        this.lastHit = new Date().getTime();
        this.now = new Date().getTime();
        this.body.setVelocity(3, 20);

        this.type = "EnemyCreep";

        this.renderable.addAnimation("walk", [3, 4, 5], 80);
        this.renderable.setCurrentAnimation("walk");
    },
    
    loseHealth: function(damage){
       this.health = this.health - damage; 
    },
    
    update: function (delta) {
        console.log(this.health);
        if(this.health <=0){
          me.game.world.removeChild(this);  
        }  
        
        this.now = new Date().getTime();

        this.body.vel.x -= this.body.accel.x * me.timer.tick;

        me.collision.check(this, true, this.collideHandler.bind(this), true);

        this.body.update(delta);


        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function (response) {
        if (response.b.type === "Playerbase") {
            this.attacking = true;
            //this.lastAttacking=this.now;
            this.body.vel.x = 0;
            //keeps moving the creep to the right to maintain its position
            //this.pos.x = this.pos.x + 1;
            //checks that it has been at least 1 second since this creep hit a base
            if ((this.now - this.lastHit >= 1000)) {
                //updates the lasthit timer
                this.lastHit = this.now;
                //makes the player base call its losehealth fucntion and passes it a
                // damage of 1
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        } else if (response.b.type === "PlayerEntity") {
            var xdif = this.pos.x - response.b.pos.x;

            this.attacking = true;
            //this.lastAttacking=this.now;


            if (xdif > 0) {
                //keeps moving the creep to the right to maintain its position
              //  this.pos.x = this.pos.x + 1;
                this.body.vel.x = 0;
            }
            //checks that it has been at least 1 second since this creep hit something
            if ((this.now - this.lastHit >= 1000 && xdif > 0)) {
                //updates the lasthit timer
                this.lastHit = this.now;
                //makes the player base call its losehealth fucntion and passes it a
                // damage of 1
                response.b.loseHealth(game.data.enemyCreepAttack);
            }
        }
    }

});

game.GameManager = Object.extend({
    init: function (x, y, settings) {
        this.now = new Date().getTime();
        this.lastCreep = new Date().getTime();

        this.alwaysUpdate = true;
    },
    update: function () {
        this.now = new Date().getTime();
        
        if(game.data.player.dead){
            me.game.world.removeChild(game.data.player);  
            me.state.current().resetPlayer(10, 0);
        }

        if (Math.round(this.now / 1000) % 10 === 0 && (this.now - this.lastCreep >= 1000)) {
            this.lastCreep = this.now;
            var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
            me.game.world.addChild(creepe, 5);

        }
        return true;
    }
});