async function uid() {
    var user = await (await fetch("https://enka.network/u/" + document.querySelector("input#uid").value + "/__data.json")).json();
    document.querySelector("#user #name").innerText = user.playerInfo.nickname;
    document.querySelector("#user #uid").innerText = user.uid;
    document.querySelector("#user #ar").innerText = user.playerInfo.level;
    document.querySelector("#user #wl").innerText = user.playerInfo.worldLevel;
    document.querySelector("#user #signature").innerText = user.playerInfo.signature;
    document.querySelector("#characters").innerHTML = "\n";
    var character = await (await fetch("https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json")).json();
    var i = 0;
    for (var i = 0; i < user.avatarInfoList.length; i++) {
        var icon = character[user.avatarInfoList[i].avatarId].SideIconName;
        var html = '<input type="radio" id="' + user.avatarInfoList[i].avatarId + '" name="character" value=' + i + ' />' + '\n' + '<label for="' + user.avatarInfoList[i].avatarId + '"><img class="cicon" src="https://enka.network/ui/' + icon + '.png" />' + '\n' + '</label>' + '\n';
        document.querySelector("#characters").innerHTML += html;
    }
    document.querySelector("#characters input:first-child").setAttribute("checked", "");
}

async function score() {
    var user = await (await fetch("https://enka.network/u/" + document.querySelector("input#uid").value + "/__data.json")).json();
    var artifacts = ["flower", "plume", "sands", "goblet", "circlet"];
    var scores = [0, 0, 0, 0, 0];
    var sum;
    var equiplist = user.avatarInfoList[Number(document.querySelector("#characters input:checked").value)].equipList;
    for (var i = 0; i < 5; i++) {
        if (equiplist[i].flat.reliquaryMainstat.mainPropId == "FIGHT_PROP_CRITICAL") {
            scores[i] += equiplist[i].flat.reliquaryMainstat.statValue * 2;
        } else if (equiplist[i].flat.reliquaryMainstat.mainPropId == "FIGHT_PROP_CRITICAL_HURT") {
            scores[i] += equiplist[i].flat.reliquaryMainstat.statValue;
        }
        for (var j = 0; j < 4; j++) {
            if (equiplist[i].flat.reliquarySubstats[j].appendPropId == "FIGHT_PROP_CRITICAL") {
                scores[i] += equiplist[i].flat.reliquarySubstats[j].statValue * 2;
            } else if (equiplist[i].flat.reliquarySubstats[j].appendPropId == "FIGHT_PROP_CRITICAL_HURT") {
                scores[i] += equiplist[i].flat.reliquarySubstats[j].statValue;
            }
        }
        if (document.querySelector("#scoreoption #" + artifacts[i]).value == "a") {
            if (equiplist[i].flat.reliquaryMainstat.mainPropId == "FIGHT_PROP_ATTACK_PERCENT") {
                scores[i] += equiplist[i].flat.reliquaryMainstat.statValue;
            }
            for (var j = 0; j < 4; j++) {
                if (equiplist[i].flat.reliquarySubstats[j].appendPropId == "FIGHT_PROP_ATTACK_PERCENT") {
                    scores[i] += equiplist[i].flat.reliquarySubstats[j].statValue;
                }
            }
        } else if (document.querySelector("#scoreoption #" + artifacts[i]).value == "c") {
            if (equiplist[i].flat.reliquaryMainstat.mainPropId == "FIGHT_PROP_CHARGE_EFFICIENCY") {
                scores[i] += equiplist[i].flat.reliquaryMainstat.statValue;
            }
            for (var j = 0; j < 4; j++) {
                if (equiplist[i].flat.reliquarySubstats[j].appendPropId == "FIGHT_PROP_CHARGE_EFFICIENCY") {
                    scores[i] += equiplist[i].flat.reliquarySubstats[j].statValue;
                }
            }
        } else if (document.querySelector("#scoreoption #" + artifacts[i]).value == "h") {
            if (equiplist[i].flat.reliquaryMainstat.mainPropId == "FIGHT_PROP_HP_PERCENT") {
                scores[i] += equiplist[i].flat.reliquaryMainstat.statValue;
            }
            for (var j = 0; j < 4; j++) {
                if (equiplist[i].flat.reliquarySubstats[j].appendPropId == "FIGHT_PROP_HP_PERCENT") {
                    scores[i] += equiplist[i].flat.reliquarySubstats[j].statValue;
                }
            }
        } else if (document.querySelector("#scoreoption #" + artifacts[i]).value == "d") {
            if (equiplist[i].flat.reliquaryMainstat.mainPropId == "FIGHT_PROP_DEFENSE_PERCENT") {
                scores[i] += equiplist[i].flat.reliquaryMainstat.statValue;
            }
            for (var j = 0; j < 4; j++) {
                if (equiplist[i].flat.reliquarySubstats[j].appendPropId == "FIGHT_PROP_DEFENSE_PERCENT") {
                    scores[i] += equiplist[i].flat.reliquarySubstats[j].statValue;
                }
            }
        } else if (document.querySelector("#scoreoption #" + artifacts[i]).value == "m") {
            if (equiplist[i].flat.reliquaryMainstat.mainPropId == "FIGHT_PROP_ELEMENT_MASTERY") {
                scores[i] += equiplist[i].flat.reliquaryMainstat.statValue / 2;
            }
            for (var j = 0; j < 4; j++) {
                if (equiplist[i].flat.reliquarySubstats[j].appendPropId == "FIGHT_PROP_ELEMENT_MASTERY") {
                    scores[i] += equiplist[i].flat.reliquarySubstats[j].statValue / 2;
                }
            }
        }
        document.querySelector("#result #" + artifacts[i]).innerHTML = score[i];
        sum += score[i];
    }
    document.querySelector("#result #total").innerHTML = sum;
}