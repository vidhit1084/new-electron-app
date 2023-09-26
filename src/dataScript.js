// const editButton = document.getElementById("editButton");
const cancelButton = document.getElementById("cancelButton");
const submit_el = document.getElementById("submitData");

let client_el = document.getElementById("editClient");
let store_el = document.getElementById("editStore");
let software_el = document.getElementById("editSoftware");
// let app_el = document.getElementById("editApp");
const editForm = document.getElementById("editData");
const addAppButton = document.getElementById("addAppButton");

let formDataModified = false;
let idx = 0;
document.addEventListener("DOMContentLoaded", async () => {
  const checkFlag = async () => {
    const flag = await api.setShouldRunInterval(false);
    console.log(flag, "this is flag");
  };
  checkFlag();
  const successMessage = document.getElementById("successMessage");
  const failedMessage = document.getElementById("failedMessage");

  try {
    const jsonData = await api.getJsonData();

    if (jsonData) {
      // const app = jsonData.app;
      console.log(jsonData, "bgbgbgbgvg");

      client_el.value = jsonData.client;
      store_el.value = jsonData.store;
      software_el.value = jsonData.software;
      const appInputsDiv = document.getElementById("appInputs");
      appInputsDiv.innerHTML = "";
      jsonData.appsArray.forEach((appName) => {
        const appInput = document.createElement("input");
        appInput.type = "text";
        appInput.className = "editApp";
        appInput.value = appName; // Prefill the input field with app name
        appInputsDiv.appendChild(appInput);
      });
      console.log(jsonData, "hghghghghg");

      formDataModified = false;

      editForm.style.display = "block";
      // editButton.style.display = "none";
      cancelButton.style.display = "block";
      const ggboi = document.querySelectorAll(".editApp");
      console.log(ggboi, "fgfgfgfg");

      // Check if the app is running
      // const isAppRunning = await api.checkAppRunning(app);

      // if (isAppRunning) {
      //   console.log("App is running now");
      //   successMessage.style.display = "block";
      //   editButton.style.display = "block";
      //   alert(`The app '${app}' is running.`);

      //   const sendPingResult = await api.sendPingRequest(jsonData);

      //   if (sendPingResult.success) {
      //     console.log("Ping request sent successfully");
      //   } else {
      //     console.error("Failed to send ping request");
      //   }
      // } else {
      //   console.log("App is not running");
      //   alert(`The app '${app}' is not running.`);
      //   successMessage.style.display = "none";
      //   failedMessage.style.display = "block";
      // }
    } else {
      console.log("No JSON data found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// editButton.addEventListener("click", async () => {
//   const jsonData = await api.getJsonData();

//   // client_el.value = jsonData.client;
//   // store_el.value = jsonData.store;
//   // software_el.value = jsonData.software;
//   // app_el.value = jsonData.app;

//   // formDataModified = false;

//   // editForm.style.display = "block";
//   // editButton.style.display = "none";
//   // cancelButton.style.display = "block";
// });

cancelButton.addEventListener("click", () => {
  editForm.style.display = "none";
  // editButton.style.display = "block";
  cancelButton.style.display = "none";
  window.location.href = "success.html";
});

client_el.addEventListener("input", () => {
  formDataModified = true;
  updateEditButtonState();
  console.log("rtrtrtrt");
});

store_el.addEventListener("input", () => {
  formDataModified = true;
  updateEditButtonState();
});

software_el.addEventListener("input", () => {
  formDataModified = true;
  updateEditButtonState();
});
// const appInputs = document.querySelectorAll(".editApp");
// console.log(appInputs, "good");
// appInputs.forEach((appInput) => {
//   console.log(appInput);
//   appInput.addEventListener("input", () => {
//     formDataModified = true;
//     updateEditButtonState();
//     console.log("working");
//   });
// });

const appInputs = document.getElementById("appInputs");
appInputs.addEventListener("change", () => {
  formDataModified = true;
  updateEditButtonState();
  console.log("working");
});

// app_el.addEventListener("input", () => {
//   formDataModified = true;
//   updateEditButtonState();
// });
const maxAppInputs = 5;

function addAppInputField() {
  const appInputsDiv = document.getElementById("appInputs");
  const appInputs = appInputsDiv.querySelectorAll(".editApp");

  if (appInputs.length < maxAppInputs) {
    const appInput = document.createElement("input");
    appInput.type = "text";
    appInput.className = "editApp";
    appInput.placeholder = "Enter App Name"; // You can set a placeholder text
    appInput.addEventListener("input", () => {
      formDataModified = true;
      updateEditButtonState();
    });

    appInputsDiv.appendChild(appInput);
  }

  // Disable the "Add App" button if the maximum number of inputs is reached
  if (appInputs.length >= maxAppInputs) {
    addAppButton.disabled = true;
  }
}

addAppButton.addEventListener("click", addAppInputField);

submit_el.addEventListener("click", async () => {
  if (validateForm()) {
    client_el = document.getElementById("editClient");
    store_el = document.getElementById("editStore");
    software_el = document.getElementById("editSoftware");
    // app_el = document.getElementById("editApp");

    const client = client_el.value;
    const store = store_el.value;
    const software = software_el.value;
    // const app = app_el.value;

    const appInputs = document.querySelectorAll(".editApp");
    const appsArray = Array.from(appInputs)
      .map((input) => input.value.trim())
      .filter((appName) => appName !== "");
    console.log(appsArray, "jkjkjkjk");
    const jsonData = { client, store, software, appsArray };
    console.log(jsonData, "yoooooo");
    const updatedData = await api.updateEditedData(jsonData);
    console.log(updatedData, "coool");
    const response = await api.editData(jsonData);
    console.log(response);

    // Check if the app is running
    // const isAppRunning = await api.checkAppRunning(jsonData.app);

    // if (isAppRunning) {
    //   const response = await api.editData(jsonData);
    //   alert("Data updated");
    //   const editSuccess = document.getElementById("editSuccess");
    //   console.log("App is running now");
    //   successMessage.style.display = "block";
    //   // editButton.style.display = "block";
    //   // alert(`The app '${app}' is  running.`);

    //   const sendPingResult = await api.sendPingRequest(jsonData);

    // if (sendPingResult.success) {
    //   console.log("Ping request sent successfully");
    formDataModified = false;
    updateEditButtonState();
    // location.reload();
    window.location.href = "success.html";
    // } else {
    //   alert("failed to send ping request");
    //   console.error("Failed to send ping request");
    // }
    // } else {
    //   console.log("App is not running");
    //   alert(`The app '${app}' is not running.`);
    //   successMessage.style.display = "none";
    //   failedMessage.style.display = "block";
    // }
  }
  // return response;
  // console.log(response);
});

function updateEditButtonState() {
  if (formDataModified) {
    submit_el.removeAttribute("disabled");
  } else {
    submit_el.setAttribute("disabled", "true");
  }
}

function validateForm() {
  const client = document.getElementById("editClient").value;
  const store = document.getElementById("editStore").value;
  const software = document.getElementById("editSoftware").value;
  // const appInputs = document.querySelectorAll(".editApp");

  // const app = document.getElementById("editApp").value;
  console.log(client, store, "haha");
  // Check if any of the fields are empty
  if (!client || !store || !software) {
    alert("Please fill in all fields.");
    return false;
  }

  // for (const appInput of appInputs) {
  //   const appName = appInput.value.trim();
  //   if (!appName) {
  //     alert("Please fill in all app fields.");
  //     return false;
  //   }
  // }

  return true; // Form is valid
}

updateEditButtonState();
