document.addEventListener("DOMContentLoaded", function(){

    const inputSlider = document.querySelector(".slider");
    const displayLength = document.querySelector("[data-length-number]");
    const passwordDisplay = document.querySelector(".display");
    const copyButton = document.querySelector("#copy-button");
    const copyMessage = document.querySelector("[data-copy-message]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numberCheck = document.querySelector("#numbers");
    const symbolCheck = document.querySelector("#symbols");
    const indicator = document.querySelector(".strength-indicator");
    const generateButton = document.querySelector("#generate-button");
    const allCheckBox = document.querySelectorAll("input[type=checkbox]");
    const symbolString = "`~!@#$%^&*()_-+={}|[]\\:;'<>,.?/₹\"";

    // on start
    let password = "";
    inputSlider.value = 8;
    let passwordLength = inputSlider.value;
    let checkCount = 1;
    uppercaseCheck.checked = true;
    handleSlider();
    setIndicator("rgb(255,255,255)");
    
    // set password length
    inputSlider.addEventListener("input", handleSlider);

    function handleSlider(){
        if(inputSlider.value < checkCount) inputSlider.value = checkCount;

        passwordLength = inputSlider.value;
        displayLength.innerHTML = `<p>${passwordLength}</p>`;

        calculateStrength();
    }

    // indicator
    function setIndicator(color){
        indicator.style.backgroundColor = color;
        indicator.style.boxShadow = `0px 0px 10px ${color}`;
    }

    // get random integer
    function getRandomInteger(min, max){
        return Math.floor(Math.random() * (max - min) + min);
    }

    // ger random number
    function generateRandomNumber(){
        return getRandomInteger(0, 10);
    }

    // get random lowercase
    function generateRandomLowerCase(){
        return String.fromCharCode(getRandomInteger(97, 124));
    }

    // get random upper case
    function generateRandomUpperCase(){
        return String.fromCharCode(getRandomInteger(65, 91));
    }

    // get random symbol
    function generateRandomSymbol(){
        return symbolString.charAt(getRandomInteger(0, symbolString.length - 1));
    }

    // strength calculate
    function calculateStrength(){
        let hasUpper = false;
        let hasLower = false;
        let hasNumber = false;
        let hasSymbol = false;

        if(uppercaseCheck.checked) hasUpper = true;
        if(lowercaseCheck.checked) hasLower = true;
        if(numberCheck.checked) hasNumber = true;
        if(symbolCheck.checked) hasSymbol = true;

        if(((hasUpper && hasLower) || (hasNumber || hasSymbol)) && (passwordLength >= 8)) setIndicator("rgb(0, 255, 0)");
        else if(((hasUpper || hasLower) || (hasNumber || hasSymbol)) && (passwordLength >= 6)) setIndicator("rgb(255, 255, 0)");
        else setIndicator("rgb(255, 0, 0)");
    }

    // copy content
    copyButton.addEventListener("click", ()=>{
        if(passwordDisplay.value) copyContent();
    });

    async function copyContent(){
        try{
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMessage.innerHTML = "Copied";
        }
        catch(error){
            copyMessage.innerHTML = "Failed";
        }
        finally{
            copyMessage.classList.add("active");
            copyMessage.style.backgroundColor = "rgb(0,0,0)"
            setTimeout(()=>{
               copyMessage.classList.remove("active"); 
               copyMessage.innerHTML = "";
                copyMessage.style.backgroundColor = "rgba(0,0,0,0)"
            }, 750);
        }
    }

    // handling checkboxes
    function handleCheckBoxChange(){
        checkCount = 0;
        allCheckBox.forEach( (checkbox) => {
            if(checkbox.checked) checkCount++;
        });

        // edge case
        if(inputSlider.value < checkCount){
            inputSlider.value = checkCount;
            handleSlider();
        }

        calculateStrength();
    }

    allCheckBox.forEach( (checkbox) => {
        checkbox.addEventListener("change", handleCheckBoxChange);
    });

    // generating new password

    function shufflePassword(password){
        let arr = password.split("");
        for(let i = 0; i < password.length; i++){
            let a = getRandomInteger(0, password.length);
            let b = getRandomInteger(0, password.length);
            [arr[a], arr[b]] = [arr[b], arr[a]];
        }

        password = arr.join("");
        return password;
    }

    generateButton.addEventListener("click", () => {
        if(checkCount == 0){ 
            alert("Please tick atleast one checkbox");
            return ;    
        }

        password = "";

        let funcArr = [];
        if(uppercaseCheck.checked) funcArr.push(generateRandomUpperCase);
        if(lowercaseCheck.checked) funcArr.push(generateRandomLowerCase);
        if(numberCheck.checked) funcArr.push(generateRandomNumber);
        if(symbolCheck.checked) funcArr.push(generateRandomSymbol);

        for(let i = 0; i < funcArr.length; i++) password += funcArr[i]();
        for(let i = 0; i < inputSlider.value - funcArr.length; i++) password += funcArr[getRandomInteger(0, funcArr.length)]();
        password = shufflePassword(password);

        passwordDisplay.value = password;
    });

});