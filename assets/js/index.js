function scrollToOptions(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

(function () {
  const fullName = "Shayan Sarkar";
  let arrayName = [];
  let i = 0;

  let interval = setInterval(() => {
    arrayName.push(fullName[i]); // add one character
    document.getElementById("fullName").innerText = arrayName.join("");

    i++;
    if (i === fullName.length) {
      clearInterval(interval); // stop when done
    }
  }, 200); // print every 500ms
})();