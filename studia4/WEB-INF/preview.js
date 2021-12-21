let przedmioty = document.querySelectorAll('#przedmioty > div');
let przedmiotyDiv = document.querySelector('#przedmioty')


let showMenu = function() {
    //alert(this.linksDiv.style.maxHeight);
    if (this.linksDiv.style.maxHeight === "0px") {
        this.style.borderWidth = "0px 0px 0px 0px";
        this.linksDiv.style.maxHeight = "98px";
    } else {
        this.linksDiv.style.maxHeight = "0px";
        this.style.borderWidth = "0px 0px 1.5px 0px";
    }
    
}


przedmioty.forEach((element) => {
    let linksDiv = document.createElement('div');
    let link1 = document.createElement('a');
    let link2 = document.createElement('a');
    link1.innerHTML = "Strona przedmiotu";
    link2.innerHTML = "Strona prowadzącego";
    linksDiv.append(link1, link2);
    linksDiv.classList.add("subject-menu");
    linksDiv.style.maxHeight = "0px";
    element.linksDiv = linksDiv;
    element.onclick = showMenu
    przedmiotyDiv.insertBefore(linksDiv, element.nextSibling);
});