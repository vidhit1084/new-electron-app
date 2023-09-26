const { contextBridge, ipcRenderer } = require("electron");

let jsonData = null;
let shouldRunInterval = false;
const getShouldRunIntervalFunc = async () => {
  return await ipcRenderer.invoke("get-should-run-interval");
};

const fetchData = async () => {
  const jsonFile = await ipcRenderer.invoke("fetch-json-data");
  if (jsonFile) {
    console.log("JSON Data found");
    return jsonFile;
  } else {
    console.log("JSON Data not found");
    return null;
  }
};

const initializeJsonData = async () => {
  jsonData = await fetchData();
};

initializeJsonData();

// const updateIntervalFlag = async () => {
//   try {
//     const jsonFile = await ipcRenderer.invoke("check-need");
//     shouldRunInterval = flag;
//     return shouldRunInterval;
//   } catch (error) {
//     console.error("Error updating interval flag:", error);
//   }
// };
// updateIntervalFlag();

contextBridge.exposeInMainWorld(
  "api",
  {
    title: "Client Data",
    createNote: (data) => ipcRenderer.invoke("create-file", data),
    checkAppRunning: async (appName) => {
      try {
        const result = await ipcRenderer.invoke("check-app-running", appName);
        if (result.success) {
          console.log("App is running, sending data...");
          return result;
        } else {
          console.error("App is not running somehow.");
        }
      } catch (error) {
        console.error("Error checking app status:", error);
      }
    },
    getJsonData: async () => {
      if (jsonData) {
        return jsonData; // Return the cached JSON data
      } else {
        console.log("JSON Data is not available");
        return null;
      }
    },
    sendPingRequest: async (jsonData) => {
      return await ipcRenderer.invoke("send-ping-request", jsonData);
    },

    editData: (data) => {
      return ipcRenderer.invoke("edit-data", data);
    },
    updateEditedData: (data) => {
      return ipcRenderer.invoke("update-json-data", data);
    },
    setShouldRunInterval: async (flag) => {
      shouldRunInterval = flag;
      return await ipcRenderer.invoke("set-should-run-interval", flag); // Update the value in the main process
    },
    getShouldRunInterval: async () => {
      return await getShouldRunIntervalFunc();
    },

    // checkNeed: (flag) => {
    //   shouldRunInterval = flag;
    // },
  },

  setInterval(async () => {
    // const flag = updateIntervalFlag();
    // const flag = await api.checkNeed();
    shouldRunInterval = await getShouldRunIntervalFunc();
    if (!shouldRunInterval) {
      console.log("Interval skipped because the flag is false.");
    } else {
      console.log("interval started");
      // const jsonData = await ipcRenderer.invoke("fetch-json-data");
      if (!jsonData) {
        console.log("data not found");
      } else {
        console.log("Checking app status of :", jsonData);

        const appsArray = jsonData.appsArray || []; // Ensure appsArray is an array
        console.log(appsArray, "appsArray");

        let count = 0;
        for (let i = 0; i < appsArray.length; i++) {
          count++;
          console.log(count, "running this times");
          let eachApp = appsArray[i];
          console.log(eachApp, "that's it");

          try {
            const result = await ipcRenderer.invoke(
              "check-app-running",
              eachApp
            );
            if (result) {
              console.log(result, "running good");
              const hide = await ipcRenderer.invoke("set-hide-windows");
              const appData = {
                client: jsonData.client,
                store: jsonData.store,
                software: jsonData.software,
                app: eachApp,
              };
              const ping = await ipcRenderer.invoke(
                "send-ping-request",
                appData
              );
              //   console.log(ping, "hehehehe");

              //   console.log(ping, "hehehehe");
              if (ping.success) {
                console.log("Sending ping succesfully");
              } else {
                console.log("unable to send ping, check connectiopn");
              }
            } else {
              console.log("App is not running on interval");
            }
          } catch (error) {
            console.error("Error checking app status:", error.message);
          }
        }

        // const result = await ipcRenderer.invoke(
        //   "check-app-running",
        //   jsonData.app
        // );
        // if (result) {
        //   const hide = await ipcRenderer.invoke("set-hide-windows");
        //   const ping = await ipcRenderer.invoke("send-ping-request", jsonData);
        //   console.log("App is running on interval", ping, hide);
        // } else {
        //   console.log("App is not running on interval");
        // }
      }
    }
  }, 20 * 1000)
);
