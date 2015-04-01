game.LoadProfile = me.ScreenObject.extend({
    /**	
     *  action to perform on state change
     */
    onResetEvent: function () {
        me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('load-screen')), -10); // TODO

        me.input.unbindKey(me.input.KEY.Enter);
        me.input.unbindKey(me.input.KEY.D);
        me.input.unbindKey(me.input.KEY.A);
        me.input.unbindKey(me.input.KEY.W);
        me.input.unbindKey(me.input.KEY.S);

        me.game.world.addChild(new (me.Renderable.extend({
            init: function () {
                this._super(me.Renderable, 'init', [10, 10, 300, 50]);
                this.font = new me.Font("Algerian", 45, "turquoise");
            },
            draw: function (renderer) {
                this.font.draw(renderer.getContext(), "ENTER YOUR USERNAME AND PASSWORD", this.pos.x, this.pos.y);
              
            },
        })));
    },
    /**	
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {

    }
});






