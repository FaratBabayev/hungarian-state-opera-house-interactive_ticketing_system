let selectedSeat = null;
let prices = [40, 25, 15];
let cart = [];
let sectionNames = ["VIP Section", "Orchestra", "Gallery"];
let sectionIds = ["vip-seats", "orchestra-seats", "gallery-seats"];
let prefixes = ["V", "O", "G"];
let mapScale = 1;
let mapX = 0;
let mapY = 0;
const zoomStep = 0.1;
const moveStep = 30;
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
function addToCart() {
    if (selectedSeat === null) {
        alert("Please select a seat first.");
        return;
    }
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].seat === selectedSeat.textContent) {
            alert("This seat is already in your cart.");
            return;
        }
    }
    let ticket = {
        seat: selectedSeat.textContent,
        section: selectedSeat.dataset.section,
        price: Number(selectedSeat.dataset.price),
        element: selectedSeat  
    };
    cart.push(ticket);
    selectedSeat.className = selectedSeat.className.replace(" inspected", "");
    selectedSeat.className += " in-cart";
    selectedSeat = null;
    document.getElementById("add-to-cart").disabled = true;
    document.getElementById("details-content").innerHTML =
        "<p>No seat is selected.</p>";

    displayCart();
    updateSeatCounts();
    saveCart();
}
function displayCart() {
    let cartItems = document.getElementById("cart-items");
    let total = 0;
    cartItems.innerHTML = "";
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty</p>";
    }
    for (let i = 0; i < cart.length; i++) {
        cartItems.innerHTML +=
            "<div class='cart-item'>" +
            "<p><strong>Seat:</strong> " + cart[i].seat + "</p>" +
            "<p><strong>Section:</strong> " + cart[i].section + "</p>" +
            "<p><strong>Price:</strong> " + cart[i].price + " AZN</p>" +
            "<button type='button' class='remove-ticket' data-index='" +
            i + "'>Remove</button>" +
            "</div>";
        total = total + cart[i].price;
    }
    document.getElementById("cart-total").textContent = total + " AZN";
    let removeButtons = document.getElementsByClassName("remove-ticket");
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].onclick = function() {
            removeTicket(Number(this.dataset.index));
        };
    }
}
function removeTicket(index) {
    let ticket = cart[index];
    ticket.element.className =
        ticket.element.className.replace(" in-cart", "");
    cart.splice(index, 1);
    displayCart();
    updateSeatCounts();
    saveCart();
}
function updateSeatCounts() {
    let countIds = ["vip-count", "orchestra-count", "gallery-count"];
    let sectionSeatIds = ["vip-seats", "orchestra-seats", "gallery-seats"];
    for (let s = 0; s < 3; s++) {
        let seats = document.getElementById(sectionSeatIds[s]).children;
        let available = 0;
        for (let i = 0; i < seats.length; i++) {
            if (!seats[i].disabled && !seats[i].className.includes("in-cart")) {
                available++;
            }
        }
        document.getElementById(countIds[s]).textContent =
            available + " available seats";
    }
}
function saveCart() {
    let savedCart = [];
    for (let i = 0; i < cart.length; i++) {
        savedCart.push({
            seat: cart[i].seat,
            section: cart[i].section,
            price: cart[i].price
        });
    }
    localStorage.setItem("operaCart", JSON.stringify(savedCart));
}
function updateMapView() {
    let venueMap = document.querySelector(".venue-map");
    venueMap.style.transform =
        "translate(" + mapX + "px, " + mapY + "px) scale(" + mapScale + ")";
}
function zoomIn() {
    mapScale = Math.min(mapScale + zoomStep, 2);
    updateMapView();
}
function zoomOut() {
    mapScale = Math.max(mapScale - zoomStep, 0.5);
    updateMapView();
}
function moveUp() {
    mapY += moveStep;
    updateMapView();
}
function moveDown() {
    mapY -= moveStep;
    updateMapView();
}
function moveLeft() {
    mapX += moveStep;
    updateMapView();
}
function moveRight() {
    mapX -= moveStep;
    updateMapView();
}
function resetView() {
    mapScale = 1;
    mapX = 0;
    mapY = 0;
    updateMapView();
}
document.getElementById("add-to-cart").onclick = addToCart;
document.getElementById("zoom-in").onclick = zoomIn;
document.getElementById("zoom-out").onclick = zoomOut;
document.getElementById("move-up").onclick = moveUp;
document.getElementById("move-down").onclick = moveDown;
document.getElementById("move-left").onclick = moveLeft;
document.getElementById("move-right").onclick = moveRight;
document.getElementById("reset-view").onclick = resetView;
createSeats();
displayCart();
updateSeatCounts();