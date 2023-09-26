const client_el = document.getElementById("client");
const store_el = document.getElementById("store");
const software_el = document.getElementById("software");
const app_el = document.getElementById("app");
const successMessage = document.getElementById("successMessage");
const submit_el = document.getElementById("submitData");
const backButton = document.getElementById("backButton");
const sendingMessage = document.getElementById("sendingMessage");
const clientForm = document.getElementById("clientForm");
const failedMessage = document.getElementById("failedMessage");
const appsList = document.getElementById("apps");
successMessage.style.display = "none";
const checkFlag = async () => {
  const flag = await api.setShouldRunInterval(false);
  console.log(flag, "this is flag");
};
checkFlag();

let appsArray = [];
let executionCount = 0;
const appEventListener = () => {
  if (executionCount < 5) {
    const newApp = app_el.value;

    if (!appsArray.includes(newApp)) {
      appsArray.push(newApp);
      app_el.value = "";
      executionCount++;
      updateList();
      console.log(appsArray, "nnice");
    } else {
      alert("Cannot add the same app twice.");
    }
  } else {
    // Remove the event listener after it has executed five times
    app_el.value = "";
    app_el.setAttribute("disabled", "true");
    app_el.removeEventListener("change", appEventListener);

    alert("You can't add more than 5 apps");
  }
};

app_el.addEventListener("change", appEventListener);

function updateList() {
  appsList.innerHTML = "";
  for (let i = 0; i < appsArray.length; i++) {
    const listItem = document.createElement("li");
    // const removeAppButton = document.createElement("button");
    // const container = document.createElement("div");

    // removeAppButton.textContent = "Remove App";
    // removeAppButton.setAttribute("data-index", i); // Store the index in a data attribute
    // removeAppButton.addEventListener("click", (event) => {
    //   // Handle the remove button click
    //   const indexToRemove = parseInt(
    //     event.target.getAttribute("data-index"),
    //     10
    //   );
    //   if (!isNaN(indexToRemove)) {
    //     appsArray.splice(indexToRemove, 1); // Remove the app from the array
    //     executionCount--; // Decrement the execution count
    //     updateList(); // Update the apps list
    //   }
    // });
    listItem.textContent = appsArray[i];
    // listItem.appendChild(removeAppButton); // Append the remove button to the list item
    appsList.appendChild(listItem);
    // container.appendChild(removeAppButton);
    // container.appendChild(listItem);
    // appsList.appendChild(container);
  }
}

submit_el.addEventListener("click", async (event) => {
  event.preventDefault();
  const client = client_el.value;
  const store = store_el.value;
  const software = software_el.value;
//   const app = app_el.value;
  // const jsonData = await api.getJsonData();
  const jsonData = { client, store, software, appsArray };
  console.log(jsonData, "hello");
  let validApps = [];
  const res = await api.createNote({
    client,
    store,
    software,
    appsArray,
  });
  client_el.value = "";
  store_el.value = "";
  software_el.value = "";
//   app_el.value = "";
  console.log(res, "niceeee");
  //   for (let i = 0; i < appsArray.length; i++) {
  //     let singleApp = appsArray[i];
  //     let isAppRunning = await api.checkAppRunning(singleApp);
  //     console.log(isAppRunning, "yoo");
  //     if (isAppRunning) {
  //     }
  //   }

  //   const isAppRunning = await api.checkAppRunning(app);

  //   console.log(isAppRunning, "yoo");
  //   if (isAppRunning) {
  //     alert(`The app '${app}' is running.`);
  //     clientForm.style.display = "none";
  //     successMessage.style.display = "block";
  //     const res = await api.createNote({
  //       client,
  //       store,
  //       software,
  //       app,
  //     });
  //     client_el.value = "";
  //     store_el.value = "";
  //     software_el.value = "";
  //     app_el.value = "";
  window.location.href = "success.html";

  // const sendPingResult = await api.sendPingRequest(jsonData);

  // if (sendPingResult.success) {
  //   console.log("Ping request sent successfully");
  //   sendingMessage.style.display = "block";
  // } else {
  //   console.error("Failed to send ping request");
  // }
  // setTimeout(() => {
  //   successMessage.style.display = "none";
  // }, 8000);
  //   } else {
  //     console.log("The app is not running");
  //     alert(`The app '${app}' is not running.`);
  //     clientForm.style.display = "none";
  //     failedMessage.style.display = "block";
  //     backButton.style.display = "block";
  //   }

  // successMessage.style.display = "block";

  // console.log(res);

  // setTimeout(() => {
  //   successMessage.style.display = "none";
  // }, 8000);
});

// const checkAppButton = document.getElementById("checkAppButton");

// checkAppButton.addEventListener("click", async () => {
//   const appName = "Google Chrome";
//   const isRunning = await api.checkAppRunning(appName);

//   if (isRunning) {
//     console.log(`${appName} is running.`);
//   } else {
//     console.log(`${appName} is not running.`);
//   }
// });
backButton.addEventListener("click", () => {
  console.log("hellooo");
  clientForm.style.display = "block";
  failedMessage.style.display = "none";
  backButton.style.display = "none";
});
