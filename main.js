const { app, BrowserWindow, ipcMain, ipcRenderer } = require("electron");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const fetch = require("electron-fetch").default;
async function createWindow() {
  // let id;

  // Check if the heartbeatData folder exists, and create it if not.
  const dataDir = path.join(__dirname, "heartbeatData");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const win = new BrowserWindow({
    width: 768,
    height: 560,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("set-hide-windows", async () => {
    //   for windows
    // await win.setSkipTaskbar(true);
    // for mac
    try {
      app.dock.hide();
      win.hide();
      return true;
    } catch (error) {
      console.error("Error hiding winows: ");
      return false;
    }
  });

  ipcMain.handle("fetch-json-data", async () => {
    const jsonFiles = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"));

    if (jsonFiles.length > 0) {
      const firstJsonFile = jsonFiles[0];
      const jsonData = JSON.parse(
        fs.readFileSync(path.join(dataDir, firstJsonFile))
      );

      // const url = `https://api.metadome.ai/heartbeat-dev/ping?client=${encodeURIComponent(
      //   jsonData.client
      // )}&store=${encodeURIComponent(
      //   jsonData.store
      // )}&software=${encodeURIComponent(
      //   jsonData.software
      // )}&app=${encodeURIComponent(jsonData.app)}`;

      // const res = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // console.log(res, "this is res");

      return jsonData;
    } else {
      return null;
    }
  });

  const jsonFiles = fs
    .readdirSync(dataDir)
    .filter((file) => file.endsWith(".json"));

  if (jsonFiles.length > 0) {
    // await win.loadFile("src/data.html");
    await win.loadFile("src/welcome.html");

    const firstJsonFile = jsonFiles[0];
    const jsonData = JSON.parse(
      fs.readFileSync(path.join(dataDir, firstJsonFile))
    );

    // ipcMain.handle("check-client-app", async () => {
    //   console.log("hello");
    //   if (jsonData.app) {
    //     const result = await ipcRenderer.invoke(
    //       "check-app-running",
    //       jsonData.app
    //     );
    //     console.log("App is running");
    //     return result;
    //   }
    //   console.log("App is not running");
    //   return false;
    // });
  } else {
    await win.loadFile("src/index.html");
  }
}

ipcMain.handle("create-file", (req, data) => {
  if (!data || !data.client || !data.store || !data.software || !data.app)
    return false;
  const jsonData = {
    client: data.client,
    store: data.store,
    software: data.software,
    app: data.app,
  };
  const jsonString = JSON.stringify(jsonData, null, 2);
  const filePath = path.join(__dirname, "heartbeatData", `${data.client}.json`);

  fs.writeFileSync(filePath, jsonString);
  return { success: true, filePath };
});

ipcMain.handle("check-app-running", async (event, appName) => {
  if (!appName) return false;
  return new Promise((resolve, reject) => {
    if (process.platform == "darwin" || process.platform == "linux") {
      exec(`ps aux | grep -v grep | grep '${appName}'`, (error, stdout) => {
        if (!error && stdout) {
          resolve({ success: true, isRunning: true });
        } else {
          // resolve({ success: false, isRunning: false });
          reject("App is not running");
          console.log("failed");
        }
      });
    } else if (process.platform === "win32") {
      console.log("Checking on Windows...");

      exec(`tasklist /FI "IMAGENAME eq ${appName}"`, (error, stdout) => {
        if (!error && stdout.toLowerCase().includes(appName.toLowerCase())) {
          resolve({ success: true, isRunning: true });
          console.log("App is running on Windows.");
        } else {
          reject("App is not running on Windows.");
          console.error("App is not running on Windows.");
        }
      });
    } else {
      console.log("Unsupported operating system.");
      reject("Unsupported operating system.");
    }
  });
});

ipcMain.handle("send-ping-request", async (event, jsonData) => {
  try {
    // console.log(jsonData);
    const response = await fetch("https://api.metadome.ai/heartbeat-dev/ping", {
      method: "POST",
      body: JSON.stringify(jsonData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      id = responseData.client.id;
      console.log("Ping request sent successfully", responseData);
      return { success: true };
    } else {
      setTimeout(async () => {
        try {
          const response = await fetch(
            "https://api.metadome.ai/heartbeat-dev/ping",
            {
              method: "POST",
              body: JSON.stringify(jsonData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (error) {
          console.error("Failed to send ping request again", error);
        }
      }, 30 * 60 * 1000);

      console.error("Failed to send ping request", response.statusText);
      return { success: false };
    }
  } catch (error) {
    console.error("Error sending ping request:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("edit-data", async (req, data) => {
  try {
    if (!data || !data.client || !data.store || !data.software || !data.app) {
      return false;
    }
    // const clientFile = data.client + ".json";
    const dataDir = path.join(__dirname, "heartbeatData");
    // console.log(dataDir);
    const jsonFiles = fs
      .readdirSync(dataDir)
      .filter((file) => file.endsWith(".json"));
    if (jsonFiles.length > 0) {
      const jsonData = {
        client: data.client,
        store: data.store,
        software: data.software,
        app: data.app,
      };
      const dataToWrite = JSON.stringify(jsonData, null, 2);
      const clientFile = path.join(dataDir, jsonFiles[0]);
      const checkFile = fs.existsSync(clientFile);
      if (checkFile) {
        fs.writeFileSync(clientFile, dataToWrite, {
          encoding: "utf8",
          flag: "w",
        });
        // const editedResponse = await fetch(
        //   `https://api.metadome.ai/heartbeat-dev/ping/${encodeURIComponent(id)}`,
        //   {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: dataToWrite,
        //   }
        // )
        //   .then((response) => response.json())
        //   .then((data) => {
        //     console.log("Updated HeartBeat entry:", data);
        //   })
        //   .catch((error) => {
        //     console.error("Error updating HeartBeat entry:", error);
        //   });

        const response = await fetch(
          "https://api.metadome.ai/heartbeat-dev/ping",
          {
            method: "POST",
            body: JSON.stringify(jsonData),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          id = responseData.client.id;
          console.log("Ping request sent successfully", responseData);
          return { success: true };
        } else {
          setTimeout(async () => {
            try {
              const response = await fetch(
                "https://api.metadome.ai/heartbeat-dev/ping",
                {
                  method: "POST",

                  body: JSON.stringify(jsonData),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
            } catch (error) {
              console.error("Failed to send ping request again", error);
            }
          }, 30 * 60 * 1000);
          console.log("Error sending ping, sending again");
        }
      } else {
        console.log("The file doesn't exist.");
      }
    } else {
      console.log("No JSON files found in the directory.");
    }
  } catch (error) {
    console.log("error editing file :", error);
  }
});

ipcMain.handle("update-json-data", async (event, newData) => {
  // Update the jsonData with the new data
  jsonData = newData;
  return { success: true };
});
let shouldRunInterval = false;
ipcMain.handle("set-should-run-interval", (event, newValue) => {
  shouldRunInterval = newValue;
  return newValue;
});

ipcMain.handle("get-should-run-interval", (event) => {
  return shouldRunInterval;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});
