const client_el = document.getElementById("client");
const store_el = document.getElementById("store");
const software_el = document.getElementById("software");
const app_el = document.getElementById("app");
const successMessage = document.getElementById("successMessage");
const submit_el = document.getElementById("submitData");
// const check_el = document.getElementById("checkProcess");
const sendingMessage = document.getElementById("sendingMessage");
const clientForm = document.getElementById("clientForm");
const failedMessage = document.getElementById("failedMessage");
successMessage.style.display = "none";
const checkFlag = async () => {
  const flag = await api.setShouldRunInterval(false);
  console.log(flag, "this is flag");
};
checkFlag();
// check_el.addEventListener("click", async (event) => {
//   event.preventDefault();
//   const app = "Google Chrome";

//   const isAppRunning = await api.checkAppRunning(app);
//   console.log(isAppRunning, "yoooo");
//   if (isAppRunning) {
//     console.log("App is running now");
//     successMessage.style.display = "block";
//     alert(`The app '${app}' is running.`);
//     const sendPingResult = await api.sendPingRequest(jsonData);

//     if (sendPingResult.success) {
//       console.log("Ping request sent successfully");
//     } else {
//       console.error("Failed to send ping request");
//     }

//     // setTimeout(() => {
//     //   successMessage.style.display = "none";
//     // }, 8000);
//   } else {
//     console.log("app is not running");
//     alert(`The app '${app}' is not running.`);
//   }

//   // if (isAppRunning) {
//   //   console.log("App is running now");
//   //   successMessage.style.display = "block";
//   //   setTimeout(() => {
//   //     successMessage.style.display = "none";
//   //   }, 8000);
//   // } else {
//   //   console.log("app is not running");
//   //   alert(`The app '${app}' is not running.`);
//   // }
// });

submit_el.addEventListener("click", async (event) => {
  event.preventDefault();
  const client = client_el.value;
  const store = store_el.value;
  const software = software_el.value;
  // const app = app_el.value;
  const app = app_el.value;
  // const jsonData = await api.getJsonData();
  const jsonData = { client, store, software, app };

  // const isAppRunning = await api.checkAppRunning(app);

  // console.log(isAppRunning, "yoo");
  // if (isAppRunning) {
  //   alert(`The app '${app}' is running.`);
  //   clientForm.style.display = "none";
  //   successMessage.style.display = "block";
  //   // const sendPingResult = await api.sendPingRequest(jsonData);

  //   // if (sendPingResult.success) {
  //   //   console.log("Ping request sent successfully");
  //   //   sendingMessage.style.display = "block";
  //   // } else {
  //   //   console.error("Failed to send ping request");
  //   // }
  //   // setTimeout(() => {
  //   //   successMessage.style.display = "none";
  //   // }, 8000);
  // } else {
  //   console.log("The app can't be run");
  //   alert(`The app '${app}' is not running.`);
  //   clientForm.style.display = "none";
  //   failedMessage.style.display = "block";
  // }

  const res = await api.createNote({
    client,
    store,
    software,
    app,
  });

  // successMessage.style.display = "block";

  // console.log(res);
  client_el.value = "";
  store_el.value = "";
  software_el.value = "";
  app_el.value = "";

  // setTimeout(() => {
  //   successMessage.style.display = "none";
  // }, 8000);
  window.location.href = "success.html";
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
