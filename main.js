const input_uid = document.querySelector("input#uid");
const user_name = document.querySelector("#user #name");
const user_uid = document.querySelector("#user #uid");
const user_ar = document.querySelector("#user #ar");
const user_wl = document.querySelector("#user #wl");
const user_sig = document.querySelector("#user #signature");
const characters_elem = document.querySelector("#characters");
const calc_button = document.getElementById("calc_button");
const artifacts = ["flower", "plume", "sands", "goblet", "circlet"];
let user_data = null;

// Utils
const getUserProfile = async (uid) =>{
    try{
        const resp = await fetch(`https://enka.network/api/uid/${uid}`);
        const data = await resp.json();
        user_data = data;
        return data;
    }catch(e){
        alert("Failed to acquire user data");
        throw Error(e);
    }
}

const getCharacters = async () =>{
    try{
        const resp = await fetch("https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/characters.json");
        const data = await resp.json();
        return data;
    }catch(e){
        alert("Failed to acquire character data");
        throw Error(e);
    }
}

const hide_check = (data) => data == undefined?"Hidden":data;

const calcScore = (propId, index, equiplist) =>{
    let score = 0;
    for(let c = 0; c < 4; c++) {
        if(equiplist[index].flat.reliquarySubstats[c] != undefined){
            if(equiplist[index].flat.reliquarySubstats[c].appendPropId == propId){
                score += Number(equiplist[index].flat.reliquarySubstats[c].statValue);
            }
        }
    }
    return score
}

// Events
const uid = async () =>{
    if(input_uid.value === "") return alert("Please enter your UID");

    const user = await getUserProfile(input_uid.value);
    calc_button.disabled = false;
    user_name.innerText = user.playerInfo.nickname;
    user_uid.innerText = input_uid.value;
    user_ar.innerText = hide_check(user.playerInfo.level);
    user_wl.innerText = hide_check(user.playerInfo.worldLevel);
    user_sig.innerText = hide_check(user.playerInfo.signature);
    characters_elem.innerText = "";
    if(user.avatarInfoList === undefined) return (characters_elem.innerText = "Hidden");

    const characters_data = await getCharacters();
    for(let i = 0; i < user.avatarInfoList.length; i++){
        const icon_name = characters_data[user.avatarInfoList[i].avatarId].SideIconName;
        const input = document.createElement("input");
        const label = document.createElement("label");
        const img = document.createElement("img");
        input.type = "radio";
        input.name = "character";
        input.id = user.avatarInfoList[i].avatarId
        input.value = i;
        if(i == 0) input.checked = true;
        label.setAttribute("for", user.avatarInfoList[i].avatarId);
        img.className = "cicon";
        img.src = `https://enka.network/ui/${icon_name}.png`;
        label.appendChild(img);
        
        characters_elem.appendChild(input);
        characters_elem.appendChild(label);
    }
}

const score = () =>{
    const equiplist = user_data.avatarInfoList[Number(document.querySelector("#characters input:checked").value)].equipList;

    let scores = [0, 0, 0, 0, 0];
    for(let i = 0; i < 5; i++){
        for(let c = 0; c < 4; c++){
            if(equiplist[i].flat.reliquarySubstats[c] != undefined){
                if (equiplist[i].flat.reliquarySubstats[c].appendPropId == "FIGHT_PROP_CRITICAL") {
                    scores[i] += Number(equiplist[i].flat.reliquarySubstats[c].statValue) * 2;
                } else if (equiplist[i].flat.reliquarySubstats[c].appendPropId == "FIGHT_PROP_CRITICAL_HURT") {
                    scores[i] += Number(equiplist[i].flat.reliquarySubstats[c].statValue);
                }
            }
        }

        switch(document.querySelector(`#scoreoption #${artifacts[i]}`).value){
            case "a":
                scores[i] += calcScore("FIGHT_PROP_ATTACK_PERCENT", i, equiplist);
                break;
            case "c":
                scores[i] += calcScore("FIGHT_PROP_CHARGE_EFFICIENCY", i, equiplist);
                break;
            case "h":
                scores[i] += calcScore("FIGHT_PROP_HP_PERCENT", i, equiplist);
                break;
            case "d":
                scores[i] += calcScore("FIGHT_PROP_DEFENSE_PERCENT", i, equiplist);
                break;
            case "m":
                for(let c = 0; c < 4; c++) {
                    if(equiplist[i].flat.reliquarySubstats[c] != undefined){
                        if(equiplist[i].flat.reliquarySubstats[c].appendPropId == "FIGHT_PROP_ELEMENT_MASTERY"){
                            scores[i] += Number(equiplist[i].flat.reliquarySubstats[c].statValue / 2);
                        }
                    }
                }
                break;
        }

        document.querySelector(`#result #${artifacts[i]}`).innerText = scores[i].toFixed(1);
    }

    document.querySelector("#result #total").innerText = scores.reduce((sum, elem) => sum+elem, 0).toFixed(1);
}
