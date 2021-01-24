Game.registerMod("CPS Counter", {
	name: "CPS Counter",
	version: "1.0.0",
	GameVersion: "2.031",
	init: () => {
	Game.Win("Third-party");
        document.querySelector("#bigCookie").addEventListener("contextmenu", event => {
            event.preventDefault();
            Game.ClickCookie();
        });
        let cpsCounter = document.createElement("div");
        cpsCounter.id = "cps_counter";
        cpsCounter.classList.add("title");
        cpsCounter.style.cssText = `position: absolute;
            bottom: 15%;
            left: 25%;
            width: 50%;
            text-align: center;
            font-size: 20px;
            background: rgba(0,0,0,0.4);
            border-radius: 12px;
            padding: 4px 0px;
            cursor: pointer;
            z-index: 9999`;
        cpsCounter.innerHTML = `
            <style>
                #reset_cps:hover {
                    text-shadow: 0px 0px 8px #fff;
                }
            </style>
            Click Counter
            <span id="reset_cps"> ↺</span>
            <div>
                <span>CPS: </span>
                <span id="lmb_cps">0</span>
                <span>|</span>
                <span id="rmb_cps">0</span>
                <br>
                <span>MAX: </span>
                <span id="lmb_max">0</span>
                <span>|</span>
                <span id="rmb_max">0</span>
            </div>`;
        document.querySelector("#sectionLeft").appendChild(cpsCounter);
        {
            let clicks = [];
            let max = 0;
            document.addEventListener("mousedown", event => {
                if (event.button === 0) {
                    let currentTime = new Date();
                    clicks.push(currentTime);
                }
            });
            setInterval(_ => {
                let currentTime = new Date();
                for (let [i, e] of clicks.entries()) {
                    if ((currentTime.getTime() - e.getTime()) / 1000 >= 1) {
                        clicks.splice(i, 1);
                    }
                }
                document.querySelector("#lmb_cps").innerText = clicks.length;
                if (clicks.length > max) {
                    max = clicks.length;
                }
                document.querySelector("#lmb_max").innerText = max;
            }, 1);
            document.querySelector("#reset_cps").addEventListener("click", event => {
                clicks = [];
                max = 0;
            });
        }
        {
            let clicks = [];
            let max = 0;
            document.addEventListener("mousedown", event => {
                if (event.button === 2) {
                    let currentTime = new Date();
                    clicks.push(currentTime);
                }
            });
            document.addEventListener("contextmenu", event => {
                event.preventDefault();
            });
            setInterval(_ => {
                let currentTime = new Date();
                for (let [i, e] of clicks.entries()) {
                    if ((currentTime.getTime() - e.getTime()) / 1000 >= 1) {
                        clicks.splice(i, 1);
                    }
                }
                document.querySelector("#rmb_cps").innerText = clicks.length;
                if (clicks.length > max) {
                    max = clicks.length;
                }
                document.querySelector("#rmb_max").innerText = max;
            }, 1);
            document.querySelector("#reset_cps").addEventListener("click", event => {
                clicks = [];
                max = 0;
            });
        }
	}
});
