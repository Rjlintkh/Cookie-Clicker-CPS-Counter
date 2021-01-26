const unhideThose = {
	normal: false,
	shadow: false
}
var ReplaceCrateAndCrateTooltips;
function unhideAchievements(unhide) { // true to unhide them, false to rehide them
	unhideThose.normal = unhide;
}
function unhideShadowAchievements(unhide) { // true to unhide them, false to rehide them
    unhideThose.shadow = unhide;
}
ReplaceCrateAndCrateTooltips = function() {
    ReplaceCrateAndCrateTooltips = [Game.crate, Game.crateTooltip];
    Game.crate=function(me,context,forceClickStr,id)
    {
        //produce a crate with associated tooltip for an upgrade or achievement
        //me is an object representing the upgrade or achievement
        //context can be "store", "ascend", "stats" or undefined
        //forceClickStr changes what is done when the crate is clicked
        //id is the resulting div's desired id
        
        var classes='crate';
        var enabled=0;
        var noFrame=0;
        var attachment='top';
        var neuromancy=0;
        if (context=='stats' && (Game.Has('Neuromancy') || (Game.sesame && me.pool=='debug'))) neuromancy=1;
        var mysterious=0;
        var clickStr='';
        
        if (me.type=='upgrade')
        {
            var canBuy=(context=='store'?me.canBuy():true);
            if (context=='stats' && me.bought==0 && !Game.Has('Neuromancy') && (!Game.sesame || me.pool!='debug')) return '';
            else if (context=='stats' && (Game.Has('Neuromancy') || (Game.sesame && me.pool=='debug'))) neuromancy=1;
            else if (context=='store' && !canBuy) enabled=0;
            else if (context=='ascend' && me.bought==0) enabled=0;
            else enabled=1;
            if (me.bought>0) enabled=1;
            
            if (context=='stats' && !Game.prefs.crates) noFrame=1;
            
            classes+=' upgrade';
            if (me.pool=='prestige') classes+=' heavenly';
            
            
            if (neuromancy) clickStr='Game.UpgradesById['+me.id+'].toggle();';
        }
        else if (me.type=='achievement')
        {
            if (context=='stats' && me.won==0 && me.pool!='normal' && me.pool!='shadow') return ''; // EDITED added a new condition to prevent locked shadow achievements to fulfill this condition
            else if (context=='stats' && me.won==0 && !unhideThose.shadow && me.pool=='shadow') return ''; // EDITED: added a new condition, if locked shadow achievements aren't unhidden, ignore them
            else if (context!='stats') enabled=1;
            
            if (context=='stats' && !Game.prefs.crates) noFrame=1;
            
            classes+=' achievement';
            if (me.pool=='shadow') classes+=' shadow';
            if (me.won>0) enabled=1;
            else mysterious=unhideThose.normal ? 0 : 1; // EDIT: added a new condition, if locked achievements are unhidden, unhide them
            if (me.won==0 && me.pool=='shadow' && unhideThose.shadow) mysterious=0; // EDIT: added a new condition, if locked shadow achievements should be unhidden, unhide them again
            else if (me.won==0 && me.pool=='shadow' && !unhideThose.shadow) mysterious=1 // EDIT: if locked shadow achievements should be hidden, hide them again
            if (!enabled) clickStr='Game.AchievementsById['+me.id+'].click();';
            
            if (neuromancy) clickStr='Game.AchievementsById['+me.id+'].toggle();';
        }
        
        if (context=='store') attachment='store';
        
        if (forceClickStr) clickStr=forceClickStr;
        
        if (me.choicesFunction) classes+=' selector';
        
        
        var icon=me.icon;
        if (mysterious) icon=[0,7];
        
        if (me.iconFunction) icon=me.iconFunction();
        
        if (me.bought && context=='store') enabled=0;
        
        if (enabled) classes+=' enabled';// else classes+=' disabled';
        if (noFrame) classes+=' noFrame';
        
        var text=[];
        if (Game.sesame)
        {
            if (Game.debuggedUpgradeCpS[me.name] || Game.debuggedUpgradeCpClick[me.name])
            {
                text.push('x'+Beautify(1+Game.debuggedUpgradeCpS[me.name],2));text.push(Game.debugColors[Math.floor(Math.max(0,Math.min(Game.debugColors.length-1,Math.pow(Game.debuggedUpgradeCpS[me.name]/2,0.5)*Game.debugColors.length)))]);
                text.push('x'+Beautify(1+Game.debuggedUpgradeCpClick[me.name],2));text.push(Game.debugColors[Math.floor(Math.max(0,Math.min(Game.debugColors.length-1,Math.pow(Game.debuggedUpgradeCpClick[me.name]/2,0.5)*Game.debugColors.length)))]);
            }
            if (Game.extraInfo) {text.push(Math.floor(me.order)+(me.power?'<br>P:'+me.power:''));text.push('#fff');}
        }
        var textStr='';
        for (var i=0;i<text.length;i+=2)
        {
            textStr+='<div style="opacity:0.9;z-index:1000;padding:0px 2px;background:'+text[i+1]+';color:#000;font-size:10px;position:absolute;top:'+(i/2*10)+'px;left:0px;">'+text[i]+'</div>';
        }
        
        return '<div'+
        (clickStr!=''?(' '+Game.clickStr+'="'+clickStr+'"'):'')+
        ' class="'+classes+'" '+
        Game.getDynamicTooltip(
            'function(){return Game.crateTooltip(Game.'+(me.type=='upgrade'?'Upgrades':'Achievements')+'ById['+me.id+'],'+(context?'\''+context+'\'':'')+');}',
            attachment,true
        )+
        (id?'id="'+id+'" ':'')+
        'style="'+(mysterious?
            'background-position:'+(-0*48)+'px '+(-7*48)+'px':
            (icon[2]?'background-image:url('+icon[2]+');':'')+'background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px')+';'+
            ((context=='ascend' && me.pool=='prestige')?'position:absolute;left:'+me.posX+'px;top:'+me.posY+'px;':'')+
        '">'+
        textStr+
        (me.choicesFunction?'<div class="selectorCorner"></div>':'')+
        '</div>';
    }
    Game.crateTooltip=function(me,context)
    {
        var tags=[];
        mysterious=0;
        var neuromancy=0;
        var price='';
        if (context=='stats' && (Game.Has('Neuromancy') || (Game.sesame && me.pool=='debug'))) neuromancy=1;
        
        if (me.type=='upgrade')
        {
            if (me.pool=='prestige') tags.push('Heavenly','#efa438');
            else if (me.pool=='tech') tags.push('Tech','#36a4ff');
            else if (me.pool=='cookie') tags.push('Cookie',0);
            else if (me.pool=='debug') tags.push('Debug','#00c462');
            else if (me.pool=='toggle') tags.push('Switch',0);
            else tags.push('Upgrade',0);
            
            if (me.tier!=0 && Game.Has('Label printer')) tags.push('Tier : '+Game.Tiers[me.tier].name,Game.Tiers[me.tier].color);
            if (me.name=='Label printer' && Game.Has('Label printer')) tags.push('Tier : Self-referential','#ff00ea');
            
            if (me.isVaulted()) tags.push('Vaulted','#4e7566');
            
            if (me.bought>0)
            {
                if (me.pool=='tech') tags.push('Researched',0);
                else if (me.kitten) tags.push('Purrchased',0);
                else tags.push('Purchased',0);
            }
            
            if (me.lasting && me.unlocked) tags.push('Unlocked forever','#f2ff87');
            
            if (neuromancy && me.bought==0) tags.push('Click to learn!','#00c462');
            else if (neuromancy && me.bought>0) tags.push('Click to unlearn!','#00c462');
            
            var canBuy=(context=='store'?me.canBuy():true);
            var cost=me.getPrice();
            if (me.priceLumps>0) cost=me.priceLumps;
            
            if (me.priceLumps==0 && cost==0) price='';
            else
            {
                price='<div style="float:right;text-align:right;"><span class="price'+
                    (me.priceLumps>0?(' lump'):'')+
                    (me.pool=='prestige'?((me.bought || Game.heavenlyChips>=cost)?' heavenly':' heavenly disabled'):'')+
                    (context=='store'?(canBuy?'':' disabled'):'')+
                '">'+Beautify(Math.round(cost))+'</span>'+((me.pool!='prestige' && me.priceLumps==0)?Game.costDetails(cost):'')+'</div>';
            }
        }
        else if (me.type=='achievement')
        {
            if (me.pool=='shadow') tags.push('Shadow Achievement','#9700cf');
            else tags.push('Achievement',0);
            if (me.won>0) tags.push('Unlocked',0);
            else {tags.push('Locked',0);mysterious=unhideThose.normal ? 0 : 1;} // EDIT: added a new condition, if locked normal achievements should be unhidden, unhide them

            if (me.won==0 && me.pool=='shadow' && unhideThose.shadow) mysterious=0; // EDIT: added a new condition, if locked shadow achievements should be unhidden, unhide them again
            else if (me.won==0 && me.pool=='shadow' && !unhideThose.shadow) mysterious=1 // EDIT: if locked shadow achievements should be hidden, hide them again
            
            if (neuromancy && me.won==0) tags.push('Click to win!','#00c462');
            else if (neuromancy && me.won>0) tags.push('Click to lose!','#00c462');
        }
        
        var tagsStr='';
        for (var i=0;i<tags.length;i+=2)
        {
            if (i%2==0) tagsStr+=' <div class="tag" style="color:'+(tags[i+1]==0?'#fff':tags[i+1])+';">['+tags[i]+']</div>';
        }
        tagsStr=tagsStr.substring(1);
        
        var icon=me.icon;
        if (mysterious) icon=[0,7];
        
        if (me.iconFunction) icon=me.iconFunction();
        
        
        var tip='';
        if (context=='store')
        {
            if (me.pool!='toggle' && me.pool!='tech')
            {
                var purchase=me.kitten?'purrchase':'purchase';
                if (Game.Has('Inspired checklist'))
                {
                    if (me.isVaulted()) tip='Upgrade is vaulted and will not be auto-'+purchase+'d.<br>Click to '+purchase+'. Shift-click to unvault.';
                    else tip='Click to '+purchase+'. Shift-click to vault.';
                    if (Game.keys[16]) tip+='<br>(You are holding Shift.)';
                    else tip+='<br>(You are not holding Shift.)';
                }
                else tip='Click to '+purchase+'.';
            }
            else if (me.pool=='toggle' && me.choicesFunction) tip='Click to open selector.';
            else if (me.pool=='toggle') tip='Click to toggle.';
            else if (me.pool=='tech') tip='Click to research.';
        }
        
        var desc=me.desc;
        if (me.descFunc) desc=me.descFunc(context);
        if (me.bought && context=='store' && me.displayFuncWhenOwned) desc=me.displayFuncWhenOwned()+'<div class="line"></div>'+desc;
        if (me.unlockAt)
        {
            if (me.unlockAt.require)
            {
                var it=Game.Upgrades[me.unlockAt.require];
                desc='<div style="font-size:80%;text-align:center;">From <div class="icon" style="vertical-align:middle;display:inline-block;'+(it.icon[2]?'background-image:url('+it.icon[2]+');':'')+'background-position:'+(-it.icon[0]*48)+'px '+(-it.icon[1]*48)+'px;transform:scale(0.5);margin:-16px;"></div> '+it.name+'</div><div class="line"></div>'+desc;
            }
            /*else if (me.unlockAt.season)
            {
                var it=Game.seasons[me.unlockAt.season];
                desc='<div style="font-size:80%;text-align:center;">From <div class="icon" style="vertical-align:middle;display:inline-block;'+(Game.Upgrades[it.trigger].icon[2]?'background-image:url('+Game.Upgrades[it.trigger].icon[2]+');':'')+'background-position:'+(-Game.Upgrades[it.trigger].icon[0]*48)+'px '+(-Game.Upgrades[it.trigger].icon[1]*48)+'px;transform:scale(0.5);margin:-16px;"></div> '+it.name+'</div><div class="line"></div>'+desc;
            }*/
            else if (me.unlockAt.text)
            {
                var it=Game.Upgrades[me.unlockAt.require];
                desc='<div style="font-size:80%;text-align:center;">From <b>'+text+'</b></div><div class="line"></div>'+desc;
            }
        }
        
        return '<div style="padding:8px 4px;min-width:350px;">'+
        '<div class="icon" style="float:left;margin-left:-8px;margin-top:-8px;'+(icon[2]?'background-image:url('+icon[2]+');':'')+'background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;"></div>'+
        (me.bought && context=='store'?'':price)+
        '<div class="name">'+(mysterious?'???':me.name)+'</div>'+
        tagsStr+
        '<div class="line"></div><div class="description">'+(mysterious?'???':desc)+'</div></div>'+
        (tip!=''?('<div class="line"></div><div style="font-size:10px;font-weight:bold;color:#999;text-align:center;padding-bottom:4px;line-height:100%;">'+tip+'</div>'):'')+
        (Game.sesame?('<div style="font-size:9px;">Id : '+me.id+' | Order : '+Math.floor(me.order)+(me.tier?' | Tier : '+me.tier:'')+'</div>'):'');
    }
}
ReplaceCrateAndCrateTooltips();