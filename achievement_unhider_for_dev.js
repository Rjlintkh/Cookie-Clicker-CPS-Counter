const unhideThose = {
	normal: false,
	shadow: false
}
var BackupCrateAndCrateTooltips;
function unhideAchievements(unhide) { // true to unhide them, false to rehide them
	unhideThose.normal = unhide;
}
function unhideShadowAchievements(unhide) { // true to unhide them, false to rehide them
    unhideThose.shadow = unhide;
}

ReplaceCrateAndCrateTooltips = function() {
    BackupCrateAndCrateTooltips = [Game.crate, Game.crateTooltip];
    Game.crate=function(me,context,forceClickStr,id) {
        let output;
        if (me.type === 'achievement') {
            let icon = me.icon;
            if (unhideThose.shadow && me.pool === 'shadow') {
                me.pool = 'normal';
                me.isShadow = true;
            }
            output = BackupCrateAndCrateTooltips[0](me,context,forceClickStr,id);
            if (unhideThose.normal && me.pool === 'normal' && !me.isShadow) output = output.replace('background-position:0px -336px', 'background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px');
            if (unhideThose.shadow && me.isShadow) {
                me.pool = 'shadow';
                output = output.replace('background-position:0px -336px', 'background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px');
            }
        } else {
            output = BackupCrateAndCrateTooltips[0](me,context,forceClickStr,id);
        }
        return output;
    }
    Game.crateTooltip=function(me,context) {
        let output;
        if (me.type === 'achievement') {
            output = BackupCrateAndCrateTooltips[1](me,context);
            if (unhideThose.normal && me.pool === 'normal') {
                output = output.replace('<div class="name">???</div>', '<div class="name">'+me.name+'</div>');
                output = output.replace('<div class="description">???</div>', '<div class="description">'+me.desc+'</div>');
            }
            if (unhideThose.shadow && me.pool === 'shadow') {
                output = output.replace('<div class="name">???</div>', '<div class="name">'+me.name+'</div>');
                output = output.replace('<div class="description">???</div>', '<div class="description">'+me.desc+'</div>');
            }
        } else {
            output = BackupCrateAndCrateTooltips[1](me,context);
        }
        return output;
    }
}
ReplaceCrateAndCrateTooltips();
