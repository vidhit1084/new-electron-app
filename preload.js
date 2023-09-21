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
        const result = await ipcRenderer.invoke(
          "check-app-running",
          jsonData.app
        );
        if (result) {
          const ping = await ipcRenderer.invoke("send-ping-request", jsonData);
          console.log("App is running on interval", ping);
        } else {
          console.log("App is not running on interval");
        }
      }
    }
  }, 5 * 1000)
);
