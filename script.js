let selectedSeat = null;
let prices = [40, 25, 15];
let sectionNames = ["VIP Section", "Orchestra", "Gallery"];
let sectionIds = ["vip-seats", "orchestra-seats", "gallery-seats"];
let prefixes = ["V", "O", "G"];
function createSeats() {
    for (let s = 0; s < 3; s++) {
        let container = document.getElementById(sectionIds[s]);
        for (let i = 1; i <= 30; i++) {
            let seat = document.createElement("button");
            seat.type = "button";
            seat.textContent = prefixes[s] + i;
            seat.className = "seat";
            if (s === 0) {
                seat.className += " vip";
            } else if (s === 1) {
                seat.className += " premium";
            } else {
                seat.className += " standard";
            }
            seat.dataset.section = sectionNames[s];
            seat.dataset.price = prices[s];
            seat.dataset.number = i;
            if (i === 8 || i === 19 || i === 27) {
                seat.className += " unavailable";
                seat.disabled = true;
            } else {
                seat.onclick = function() {
                    inspectSeat(seat);
                };
            }
            container.appendChild(seat);
        }
    }
}
function inspectSeat(seat) {
    if (selectedSeat !== null) {
        selectedSeat.className =
            selectedSeat.className.replace(" inspected", "");
    }
    selectedSeat = seat;
    seat.className += " inspected";
    let details = document.getElementById("details-content");
    details.innerHTML =
        "<p><strong>Seat:</strong> " + seat.textContent + "</p>" +
        "<p><strong>Section:</strong> " + seat.dataset.section + "</p>" +
        "<p><strong>Price:</strong> " + seat.dataset.price + " AZN</p>";
    document.getElementById("add-to-cart").disabled = false;
}
createSeats();