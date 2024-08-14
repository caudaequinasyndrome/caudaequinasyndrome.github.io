document.addEventListener("DOMContentLoaded", function() {
    generatePIN();
    document.getElementById("pinInput").focus();

    document.getElementById("pinInput").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            checkPIN();
        }
    });

    // Initialize FingerprintJS and check entropy
    const fpPromise = FingerprintJS.load();
    fpPromise.then(fp => fp.get()).then(result => {
        const entropy = calculateEntropy(result.components);
        if (entropy > 0.9) {
            document.getElementById("submitButton").disabled = false;
        }
    });
});

let generatedPIN;

function generatePIN() {
    generatedPIN = Math.floor(10000000 + Math.random() * 90000000).toString();
    const displayPIN = generatedPIN.slice(0, 4) + " " + generatedPIN.slice(4);
    document.getElementById('generatedPIN').textContent = displayPIN;
}

function addCountries(url, a, b) {
    var tempUrl = url;
    if (a != null) {
        var tempUrlOne = new URL(tempUrl);
        tempUrl += ((tempUrlOne.search == "") ? "?" : "&") + "token_countries=" + a;
    }
    if (b != null) {
        var tempUrlTwo = new URL(tempUrl);
        tempUrl += ((tempUrlTwo.search == "") ? "?" : "&") + "token_countries_blocked=" + b;
    }
    return tempUrl;
}

function signUrl(url, securityKey, expirationTime = 3600, userIp = null, isDirectory = false, pathAllowed = '', countriesAllowed = null, countriesBlocked = null) {
    var parameterData = "", parameterDataUrl = "", signaturePath = "", hashableBase = "", token = "";
    var expires = Math.floor(Date.now() / 1000) + expirationTime;
    url = addCountries(url, countriesAllowed, countriesBlocked);
    var parsedUrl = new URL(url);
    var parameters = new URLSearchParams(parsedUrl.search);

    if (pathAllowed !== "") {
        signaturePath = pathAllowed;
        parameters.set("token_path", signaturePath);
    } else {
        signaturePath = decodeURIComponent(parsedUrl.pathname);
    }
    
    var sortedParams = Array.from(parameters).sort();
    sortedParams.forEach(function([key, value]) {
        if (value === "") {
            return;
        }
        if (parameterData.length > 0) {
            parameterData += "&";
        }
        parameterData += key + "=" + value;
        parameterDataUrl += "&" + key + "=" + encodeURIComponent(value);
    });

    hashableBase = securityKey + signaturePath + expires + ((userIp != null) ? userIp : "") + parameterData;
    token = CryptoJS.SHA256(hashableBase).toString(CryptoJS.enc.Base64);
    token = token.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    
    if (isDirectory) {
        return parsedUrl.protocol + "//" + parsedUrl.host + "/bcdn_token=" + token + parameterDataUrl + "&expires=" + expires + parsedUrl.pathname;
    } else {
        return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?token=" + token + parameterDataUrl + "&expires=" + expires;
    }
}

function calculateEntropy(components) {
    // This function will calculate the entropy from the components
    let entropy = 0;
    for (const key in components) {
        entropy += components[key].value ? 0.1 : 0;
    }
    return entropy;
}

function checkPIN() {
    let userPIN = document.getElementById("pinInput").value.replace(/ /g, '');
    if (userPIN.length === 9 && userPIN.includes(" ")) {
        userPIN = userPIN.replace(" ", "");
    }
    const messageElement = document.getElementById("message");

    if (userPIN === generatedPIN) {
        messageElement.style.color = "green";
        messageElement.textContent = "Access Granted!";

        const baseUrl = "https://linux.farm/index.html";
        const securityKey = "4cd43040-729b-4645-92de-f4a3cc008840";
        const expirationTime = 3600; // Token valid for 1 hour

        const tokenURL = signUrl(baseUrl, securityKey, expirationTime);
        
        setTimeout(() => {
            document.body.classList.add("fade-out");
            document.querySelector(".container").classList.add("fade-out");
        }, 500);
        setTimeout(() => {
            window.location.href = tokenURL;
        }, 1500);
    } else {
        messageElement.style.color = "red";
        messageElement.textContent = "Incorrect PIN. Please try again.";
    }
}
