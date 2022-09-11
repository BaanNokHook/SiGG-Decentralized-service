// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ValidateSize(file) {
  const FileSize = file.files[0].size / 1024 / 1024; // in MB
  $("#myBox").hide();
  $("#myBox2").hide();
  $("#myBox3").hide();
  if (FileSize > 6) {
    document.getElementById("myBox").style.display = "block";
    $(file).val("");
  }
}

function addDataToForm(formId, data) {
  let form;
  if (typeof formId === "string") {
    if (formId[0] === "#") form = formId.slice(1);
    form = document.getElementById(formId);
  } else {
    // instead of a formId the form HTMLElement was passed in
    form = formId;
  }

  const keys = Object.keys(data);

  keys.forEach((name) => {
    // removing the inputs with the name if already exists [overide]
    Array.prototype.forEach.call(form.elements, (input) => {
      if (input.name === name) {
        input.parentNode.removeChild(input);
      }
    });

    const value = data[name];
    const input = document.createElement("input");
    input.setAttribute("name", name);
    input.setAttribute("value", value);
    input.setAttribute("type", "hidden");

    form.appendChild(input);
  });

  return form;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addjwt(myFormId) {
  let dataToAdd = {
    forlog: window.location.href,
    myFormId,
  };
  if (
    localStorage.getItem("Jwt") != null &&
    localStorage.getItem("Did") != null
  ) {
    dataToAdd = {
      ...dataToAdd,
      jwt: localStorage.getItem("Jwt"),
      did: localStorage.getItem("Did"),
    };
  }
  addDataToForm(myFormId, dataToAdd);
}

let jwtold = null;
let didold = null;
let send = false;
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

function check() {
  const { pathname } = window.location;
  if (
    localStorage.getItem("Jwt") !== null &&
    localStorage.getItem("Did") !== null
  ) {
    if (
      jwtold === localStorage.getItem("Jwt") &&
      didold === localStorage.getItem("Did")
    ) {
      send = false;
    } else {
      jwtold = localStorage.getItem("Jwt");
      didold = localStorage.getItem("Did");
      send = true;
    }
  }

  if (send) {
    const xhr = new XMLHttpRequest();
    if (pathname === "/demo/notarisation" || pathname === "/notary") {
      xhr.open("POST", "/demo/notarisation", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const doc = new DOMParser().parseFromString(
            xhr.response,
            "text/html"
          );
          const main = [].slice.call(doc.body.getElementsByTagName("main"))[0];
          $("main").html(main);
        }
      };

      xhr.send(
        JSON.stringify({
          jwt: localStorage.getItem("Jwt"),
          did: localStorage.getItem("Did"),
        })
      );
    }
  }
}

if (storageAvailable("localStorage")) {
  check();
} else {
  // eslint-disable-next-line no-console
  console.error("LocalStorage is not supported by the browser");
}

$(document).ready(() => {
  if (!localStorage.getItem("Jwt") || !localStorage.getItem("Did")) {
    $("#alertJwt").show();
    $("#myFormId").hide();
  }
});
