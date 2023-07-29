import hello from "./modules/hello";

document.addEventListener("DOMContentLoaded", function () {
    let options = document.getElementsByClassName("smile");
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", function () {
            let currentOption = this;
            let countElement = currentOption.querySelector(".count");
            let count = +(countElement.innerText);
            count++;
            countElement.innerText = count;
        });
    }
});

console.log("index");


console.log(hello);




