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
    token = CryptoJS.HmacSHA256(hashableBase, securityKey).toString(CryptoJS.enc.Base64);
    token = token.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    if (isDirectory) {
        return parsedUrl.protocol + "//" + parsedUrl.host + "/bcdn_token=" + token + parameterDataUrl + "&expires=" + expires + parsedUrl.pathname;
    } else {
        return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?token=" + token + parameterDataUrl + "&expires=" + expires;
    }
}
