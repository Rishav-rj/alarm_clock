// Variables
let time = document.querySelector(".clock-container>h2");
let hour = document.querySelector("#hour");
let min = document.querySelector("#minute");
let sec = document.querySelector("#second");
let am_pm = document.querySelector("#am_pm");
let activeAlarms = document.querySelector(".active-Alarms");
let alarm_set_btn = document.querySelector(".btn-set-alarm");
let sound = new Audio("alarm-sound.mp3");
let sun = document.querySelector(".sun");
let moon = document.querySelector(".moon");
let brightness = document.querySelector(".bright");
let body = document.getElementsByTagName("body");
let alarmsArray = [];
// let alarmsArray = JSON.parse(localStorage.getItem("alarmsList"));

let initialHour = 0,
    initialMin = 0,
    initialSec = 0,
    alarmIndex = 0;


// Append Zero for two digit format    
function appendZero(value){
    if(value <10){
        return ("0"+value);
    }else{
        return value;
    }
}; 

// update the currect Time every 1sec
function currentTime(){
    let date = new Date();
    let [hours, minutes, seconds, am_pm] = [
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds()),
        "AM"
    ]

    // Format changed from 24hr to 12hr
    if(hours>11){
        hours = hours-12;
        am_pm = "PM"
        hours = appendZero(hours)
    }else{
        am_pm = "AM"
    }

    // Current time display
    time.innerHTML = `${hours}:${minutes}:${seconds}:${am_pm}`

    // Alarm check & play
    alarmsArray.forEach((alarm, index)=>{
        if(alarm.isActive){
            if(`${alarm.alarmHour}:${alarm.alarmMin
            }:${alarm.alarmSec}:${alarm.alarmAM_PM}` === `${hours}:${minutes}:${seconds}:${am_pm}`){
                sound.play()
                sound.loop = true;
                alert("Times Up")   
            }
        }
    })

    // Sun and Moon Movement feature called
    sun_moon_movement(hours, am_pm)

};


// Check if the alarm exist
let AlarmCheck = (para, value) => {
    let alarmObject,
        alarmIndex,
        alarmExists = false;
    alarmsArray.forEach((alarm, index)=>{
        if(alarm[para] == value){
            alarmExists = true;
            alarmObject = alarm;
            alarmIndex = index;
            return false;
        }
    })
    return [alarmExists, alarmObject, alarmIndex]
};


// Check & update the input
const inputCheck = (inputValue)=>{
    inputValue = parseInt(inputValue);
    if(inputValue < 10){
        inputValue = appendZero(inputValue)
    }
    return inputValue;
};

hour.addEventListener('input', ()=>{
    hour.value = inputCheck(hour.value);
});
min.addEventListener('input', ()=>{
    min.value = inputCheck(min.value);
});
sec.addEventListener('input', ()=>{
    sec.value = inputCheck(sec.value);
});


// Start Alarm 
const startAlarm = (e)=>{
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [alarmExists, alarmObject, alarmIndex] = AlarmCheck("id", searchId);
    if(alarmExists){
        alarmsArray[alarmIndex].isActive = true;
        // localStorage.setItem("alarmsList", JSON.stringify(alarmsArray))
    }
};

// Stop Alarm
const stopAlarm = (e)=>{
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [alarmExists, alarmObject, alarmIndex] = AlarmCheck("id", searchId);
    if(alarmExists){
        alarmsArray[alarmIndex].isActive = false;
        sound.pause();
        // localStorage.setItem("alarmsList", JSON.stringify(alarmsArray))
    }
};

// Delete Alarm
const deleteAlarm = (e)=>{
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [alarmExists, alarmObject, alarmIndex] = AlarmCheck("id", searchId);
    if(alarmExists){
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(alarmIndex, 1);
        sound.pause();
        // localStorage.setItem("alarmsList", JSON.stringify(alarmsArray))
    }
}


// Create Alarm Div

const createAlarm = (alarmObj) =>{
    
    // get the values from Object
    const {id, alarmHour, alarmMin, alarmSec, alarmAM_PM, isActive} = alarmObj;

    // Alarm creation
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMin}:${alarmSec}:${alarmAM_PM}</span>`

    // checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");

    if(isActive){
        checkbox.setAttribute("checked", "true");
    }else{
        checkbox.removeAttribute("checked");
    }

    checkbox.addEventListener('click', (e)=>{
        if(e.target.checked){
            startAlarm(e);
        }else{
            stopAlarm(e);
            checkbox.classList.remove('active');
        }
    });

    alarmDiv.appendChild(checkbox);

    // Delete button
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteBtn.classList.add("deleteButton");
    deleteBtn.addEventListener('click', (e)=> 
    deleteAlarm(e));

    alarmDiv.appendChild(deleteBtn);
    activeAlarms.appendChild(alarmDiv);
};


// Set Alarm
alarm_set_btn.addEventListener("click", ()=>{

    alarmIndex += 1;
 
    // Alarm Object
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hour.value}_${min.value}_${sec.value}_${am_pm}`
    alarmObj.alarmHour = hour.value;
    alarmObj.alarmMin = min.value;
    alarmObj.alarmSec = sec.value;
    alarmObj.alarmAM_PM = am_pm.value;
    alarmObj.isActive = false;

    // Check if the inputs are correct
    if (hour.value > 11 || min.value > 59 || sec.value > 59){
        alert("Please enter a valid time");
        hour.value = appendZero(initialHour);
        min.value = appendZero(initialMin);
        sec.value = appendZero(initialSec);
        return
    }

    alarmsArray.push(alarmObj);
    // localStorage.setItem("alarmsList", JSON.stringify(alarmsArray))
    createAlarm(alarmObj);
    hour.value = appendZero(initialHour);
    min.value = appendZero(initialMin);
    sec.value = appendZero(initialSec);
});

// Sun and Moon Movement feature

function sun_moon_movement(hours, am_pm){

    // Changing background
    if (hours >= 6 && am_pm == "AM" || hours <= 6 && am_pm == "PM"){
        document.body.style.backgroundImage = "url('images/mountains.png')";
    }else{
        document.body.style.backgroundImage = "url('images/night.jpg')";
    }


    // Sun movement & brightness
    if(hours == 6 && am_pm == "AM"){
        sun.style.top = "195px";
        sun.style.left = "0px";
        brightness.style.opacity = "0.8";
    }else if(hours == 7 && am_pm == "AM"){
        sun.style.top = "145px";
        sun.style.left = "10px";
        brightness.style.opacity = "0.7";
    }else if(hours == 8 && am_pm == "AM"){
        sun.style.top = "95px";
        sun.style.left = "40px";
        brightness.style.opacity = "0.6";
    }else if(hours == 9 && am_pm == "AM"){
        sun.style.top = "45px";
        sun.style.left = "80px";
        brightness.style.opacity = "0.4";
    }else if(hours == 10 && am_pm == "AM"){
        sun.style.top = "-5px";
        sun.style.left = "120px";
        brightness.style.opacity = "0.3";
    }else if(hours == 11 && am_pm == "AM"){
        sun.style.top = "-55px";
        sun.style.left = "210px";
        brightness.style.opacity = "0.2";
    }else if(hours == 0 && am_pm == "PM"){
        sun.style.top = "-100px";
        sun.style.left = "340px";
        brightness.style.opacity = "0";
    }else if(hours == 1 && am_pm == "PM"){
        sun.style.top = "-55px";
        sun.style.left = "470px";
        brightness.style.opacity = "0.2";
    }else if(hours ==2 && am_pm == "PM"){
        sun.style.top = "-5px";
        sun.style.left = "560px";
        brightness.style.opacity = "0.3";
    }else if(hours == 3 && am_pm == "PM"){
        sun.style.top = "45px";
        sun.style.left = "600px";
        brightness.style.opacity = "0.4";
    }else if(hours == 4 && am_pm == "PM"){
        sun.style.top = "95px";
        sun.style.left = "640px";
        brightness.style.opacity = "0.6";
    }else if(hours == 5 && am_pm == "PM"){
        sun.style.top = "145px";
        sun.style.left = "670px";
        brightness.style.opacity = "0.7";
    }else if(hours == 6 && am_pm == "PM"){
        sun.style.top = "195px";
        sun.style.left = "680px";
        brightness.style.opacity = "0.8";
    }       

    // Moon movement & brightness
    else if(hours == 7 && am_pm == "PM"){
        moon.style.top = "195px";
        moon.style.left = "0px";
    }else if(hours == 8 && am_pm == "PM"){
        moon.style.top = "136px";
        moon.style.left = "20px";
        brightness.style.opacity = "0.8";
    }else if(hours == 9 && am_pm == "PM"){
        moon.style.top = "77px";
        moon.style.left = "60px";
        brightness.style.opacity = "0.8";
    }else if(hours == 10 && am_pm == "PM"){
        moon.style.top = "19px";
        moon.style.left = "100px";
        brightness.style.opacity = "0.7";
    }else if(hours == 11 && am_pm == "PM"){
        moon.style.top = "-41px";
        moon.style.left = "200px";
        brightness.style.opacity = "0.7";
    }else if(hours == 0 && am_pm == "AM"){
        moon.style.top = "-100px";
        moon.style.left = "340px";
        brightness.style.opacity = "0.6";
    }else if(hours == 1 && am_pm == "AM"){
        moon.style.top = "-35px";
        moon.style.left = "470px";
        brightness.style.opacity = "0.6";
    }else if(hours == 2 && am_pm == "AM"){
        moon.style.top = "30px";
        moon.style.left = "580px";
        brightness.style.opacity = "0.7";
    }else if(hours == 3 && am_pm == "AM"){
        moon.style.top = "95px";
        moon.style.left = "640px";
        brightness.style.opacity = "0.7";
    }else if(hours == 4 && am_pm == "AM"){
        moon.style.top = "160px";
        moon.style.left = "660px";
        brightness.style.opacity = "0.8";
    }else if(hours == 5 && am_pm == "AM"){
        moon.style.top = "225px";
        moon.style.left = "680px";
        brightness.style.opacity = "0.9";
    }
}


// Run this once page loaded
window.onload = ()=>{
    setInterval(currentTime);
    initialHour = 0;
    initialMin = 0;
    initialSec = 0;
    alarmIndex = 0;
    hour.value = appendZero(initialHour);
    min.value = appendZero(initialMin);
    sec.value = appendZero(initialSec);
    if(alarmsArray.length > 0){
        for(let i = 0; i<alarmsArray.length; i++ ){
            createAlarm(alarmsArray[i]);
        }
    }
}

