const backButton = document.getElementById("backButton");

const checkFlag = async () => {
  const flag = await api.setShouldRunInterval(true);
  console.log(flag, "this is flag");
};
checkFlag();
backButton.addEventListener("click", async () => {
  window.location.href = "welcome.html";
});
