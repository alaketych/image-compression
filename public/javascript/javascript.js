function closeMessage() {
    document.getElementById('foo').style.display='none'
}

const typeCompression = document.getElementsByName("typeCompression");
for (let radio of typeCompression) {
    radio.onchange = radio_change;
}

function radio_change() {
    alert(this.value);
}