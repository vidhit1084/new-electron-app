document.addEventListener("DOMContentLoaded", async () => {
  // Fetch JSON data and display it

  const checkFlag = async () => {
    const flag = await api.setShouldRunInterval(false);
    console.log(flag, "this is flag");
  };
  checkFlag();
  const jsonData = await api.getJsonData();

  const jsonDataList = document.getElementById("jsonDataList");

  if (jsonData) {
    // Create list items for each key-value pair in JSON data
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        const listItem = document.createElement("li");
        listItem.textContent = `${key} - ${jsonData[key]}`;
        jsonDataList.appendChild(listItem);
      }
    }
  } else {
    // Display a message if no JSON data is found
    jsonDataList.textContent = "No JSON data found.";
  }

  // Add event listeners for Edit Data and Continue buttons
  const editDataBtn = document.getElementById("editDataBtn");
  const continueBtn = document.getElementById("continueBtn");

  editDataBtn.addEventListener("click", () => {
    // Redirect to data.html to edit data
    window.location.href = "data.html";
  });

  continueBtn.addEventListener("click", async () => {
    // Check if the app is running
    const result = await api.checkAppRunning(jsonData.app);

    if (result) {
      // Send JSON data to the ping URL
      const pingResult = await api.sendPingRequest(jsonData);

      if (pingResult.success) {
        // Redirect to success.html with a success message
        window.location.href = "success.html";
      } else {
        console.error("Failed to send ping request");
        // Handle the failure case
      }
    } else {
      console.error("App is not running");
      // Handle the case where the app is not running
    }
  });
});
