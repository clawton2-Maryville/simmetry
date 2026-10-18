
/* =====================================================
   SIMMETRY - FLOOR PLAN BUILDER
   Final Capstone Version
   ===================================================== */

// -----------------------------------------------------
// HTML ELEMENTS
// -----------------------------------------------------

const floorPlan = document.getElementById("floorPlan");

const roomButtons = document.querySelectorAll("[data-room]");

const newPlanBtn = document.getElementById("newPlanBtn");
const saveBtn = document.getElementById("saveBtn");
const exportBtn = document.getElementById("exportBtn");

const roomNameInput = document.getElementById("roomName");
const roomWidthInput = document.getElementById("roomWidth");
const roomHeightInput = document.getElementById("roomHeight");

const roomAreaDisplay = document.getElementById("roomArea");

const updateRoomBtn = document.getElementById("updateRoomBtn");
const deleteRoomBtn = document.getElementById("deleteRoomBtn");

const roomCountDisplay = document.getElementById("roomCount");
const totalAreaDisplay = document.getElementById("totalArea");
const footerAreaDisplay = document.getElementById("footerArea");


// -----------------------------------------------------
// ROOM DATA
// -----------------------------------------------------

let rooms = [
    {
        id: 1,
        name: "Living Room",
        width: 12,
        height: 14,
        x: 30,
        y: 30
    }
];

let nextRoomId = 2;
let selectedRoomId = 1;

const PIXELS_PER_FOOT = 10;


// -----------------------------------------------------
// DEFAULT ROOM DIMENSIONS
// -----------------------------------------------------

const roomSizes = {
    "Living Room": { width: 12, height: 14 },
    "Kitchen": { width: 10, height: 12 },
    "Bedroom": { width: 10, height: 10 },
    "Bathroom": { width: 8, height: 8 }
};


// -----------------------------------------------------
// NUMBER FORMATTING
// -----------------------------------------------------

function formatArea(value) {
    return Number(value.toFixed(2)).toLocaleString();
}


// -----------------------------------------------------
// TOTAL HOUSE SQUARE FOOTAGE
// -----------------------------------------------------

function updateSummary() {

    let totalArea = 0;

    rooms.forEach(function(room) {
        totalArea += room.width * room.height;
    });

    if (roomCountDisplay) {
        roomCountDisplay.textContent = rooms.length;
    }

    if (totalAreaDisplay) {
        totalAreaDisplay.textContent = formatArea(totalArea);
    }

    if (footerAreaDisplay) {
        footerAreaDisplay.textContent = formatArea(totalArea);
    }
}


// -----------------------------------------------------
// DISPLAY ALL ROOMS
// -----------------------------------------------------

function displayRooms() {

    floorPlan.innerHTML = "";

    rooms.forEach(function(room) {

        const roomElement = document.createElement("div");

        roomElement.classList.add("room");
        roomElement.dataset.id = room.id;

        // Store dimensions for reference.
        roomElement.dataset.width = room.width;
        roomElement.dataset.height = room.height;

        // Display room name and dimensions safely.
        const nameElement = document.createElement("strong");
        nameElement.textContent = room.name;

        const dimensionsElement = document.createElement("span");
        dimensionsElement.textContent =
            `${room.width}' × ${room.height}'`;

        const areaElement = document.createElement("small");
        areaElement.classList.add("room-area");
        areaElement.textContent =
            `${formatArea(room.width * room.height)} sq. ft.`;

        roomElement.appendChild(nameElement);
        roomElement.appendChild(dimensionsElement);
        roomElement.appendChild(areaElement);

        // Set visual size.
        roomElement.style.width =
            (room.width * PIXELS_PER_FOOT) + "px";

        roomElement.style.height =
            (room.height * PIXELS_PER_FOOT) + "px";

        // Keep the room in its saved position.
        roomElement.style.left = room.x + "px";
        roomElement.style.top = room.y + "px";

        if (room.id === selectedRoomId) {
            roomElement.classList.add("selected");
        }

        roomElement.addEventListener("click", function() {
            selectRoom(room.id);
        });

        floorPlan.appendChild(roomElement);
    });

    updateSummary();
}


// -----------------------------------------------------
// ADD A NEW ROOM
// -----------------------------------------------------

function addRoom(roomType) {

    const defaultSize = roomSizes[roomType];

    if (!defaultSize) {
        return;
    }

    const position = 30 + (rooms.length * 35);

    const newRoom = {
        id: nextRoomId++,
        name: roomType,
        width: defaultSize.width,
        height: defaultSize.height,
        x: position,
        y: position
    };

    rooms.push(newRoom);

    selectedRoomId = newRoom.id;

    displayRooms();
    loadSelectedRoom();
}


// -----------------------------------------------------
// ROOM SELECTION BUTTONS
// -----------------------------------------------------

roomButtons.forEach(function(button) {

    button.addEventListener("click", function() {
        addRoom(button.dataset.room);
    });

});


// -----------------------------------------------------
// SELECT A ROOM
// -----------------------------------------------------

function selectRoom(roomId) {

    selectedRoomId = roomId;

    displayRooms();
    loadSelectedRoom();
}


// -----------------------------------------------------
// LOAD SELECTED ROOM PROPERTIES
// -----------------------------------------------------

function loadSelectedRoom() {

    const room = rooms.find(function(item) {
        return item.id === selectedRoomId;
    });

    if (!room) {

        roomNameInput.value = "";
        roomWidthInput.value = "";
        roomHeightInput.value = "";

        roomAreaDisplay.textContent = "0";

        return;
    }

    roomNameInput.value = room.name;
    roomWidthInput.value = room.width;
    roomHeightInput.value = room.height;

    roomAreaDisplay.textContent =
        formatArea(room.width * room.height);
}


// -----------------------------------------------------
// LIVE ROOM AREA PREVIEW
// -----------------------------------------------------

function updateRoomAreaPreview() {

    const width = parseFloat(roomWidthInput.value) || 0;
    const height = parseFloat(roomHeightInput.value) || 0;

    const area = width > 0 && height > 0
        ? width * height
        : 0;

    roomAreaDisplay.textContent = formatArea(area);
}

roomWidthInput.addEventListener(
    "input",
    updateRoomAreaPreview
);

roomHeightInput.addEventListener(
    "input",
    updateRoomAreaPreview
);


// -----------------------------------------------------
// UPDATE SELECTED ROOM
// -----------------------------------------------------

if (updateRoomBtn) {

    updateRoomBtn.addEventListener("click", function() {

        const selectedRoom = rooms.find(function(room) {
            return room.id === selectedRoomId;
        });

        if (!selectedRoom) {
            alert("Please select a room first.");
            return;
        }

        const newName = roomNameInput.value.trim();
        const newWidth = parseFloat(roomWidthInput.value);
        const newHeight = parseFloat(roomHeightInput.value);

        if (
            newName === "" ||
            !Number.isFinite(newWidth) ||
            !Number.isFinite(newHeight) ||
            newWidth <= 0 ||
            newHeight <= 0
        ) {
            alert("Please enter a valid room name, width, and height.");
            return;
        }

        selectedRoom.name = newName;
        selectedRoom.width = newWidth;
        selectedRoom.height = newHeight;

        // Preserve X/Y coordinates so resizing does not
        // reset the room's position.

        displayRooms();
        loadSelectedRoom();
    });
}


// -----------------------------------------------------
// DELETE SELECTED ROOM
// -----------------------------------------------------

if (deleteRoomBtn) {

    deleteRoomBtn.addEventListener("click", function() {

        if (selectedRoomId === null) {
            alert("Please select a room first.");
            return;
        }

        rooms = rooms.filter(function(room) {
            return room.id !== selectedRoomId;
        });

        selectedRoomId = null;

        displayRooms();
        loadSelectedRoom();
    });
}


// -----------------------------------------------------
// DRAG AND DROP ROOMS
// -----------------------------------------------------

let draggedRoom = null;
let draggedRoomData = null;

let dragOffsetX = 0;
let dragOffsetY = 0;


// START DRAGGING

floorPlan.addEventListener("mousedown", function(event) {

    if (event.button !== 0) {
        return;
    }

    const roomElement = event.target.closest(".room");

    if (!roomElement || !floorPlan.contains(roomElement)) {
        return;
    }

    event.preventDefault();

    const roomId = Number(roomElement.dataset.id);

    draggedRoomData = rooms.find(function(room) {
        return room.id === roomId;
    });

    if (!draggedRoomData) {
        return;
    }

    selectedRoomId = roomId;
    draggedRoom = roomElement;

    const roomRect = roomElement.getBoundingClientRect();

    dragOffsetX = event.clientX - roomRect.left;
    dragOffsetY = event.clientY - roomRect.top;

    document.querySelectorAll(".room").forEach(function(room) {
        room.classList.remove("selected");
    });

    draggedRoom.classList.add("selected");
    draggedRoom.style.cursor = "grabbing";

    loadSelectedRoom();
});


// MOVE ROOM

document.addEventListener("mousemove", function(event) {

    if (!draggedRoom || !draggedRoomData) {
        return;
    }

    const floorRect = floorPlan.getBoundingClientRect();

    let newX =
        event.clientX - floorRect.left - dragOffsetX;

    let newY =
        event.clientY - floorRect.top - dragOffsetY;

    // Prevent dragging outside the grid.
    const maxX = Math.max(
        0,
        floorPlan.clientWidth - draggedRoom.offsetWidth
    );

    const maxY = Math.max(
        0,
        floorPlan.clientHeight - draggedRoom.offsetHeight
    );

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    draggedRoom.style.left = newX + "px";
    draggedRoom.style.top = newY + "px";

    // Save position directly to the room data.
    draggedRoomData.x = newX;
    draggedRoomData.y = newY;
});


// STOP DRAGGING

document.addEventListener("mouseup", function() {

    if (!draggedRoom) {
        return;
    }

    draggedRoom.style.cursor = "grab";

    draggedRoom = null;
    draggedRoomData = null;
});


// -----------------------------------------------------
// NEW PLAN
// -----------------------------------------------------

if (newPlanBtn) {

    newPlanBtn.addEventListener("click", function() {

        const confirmed = confirm(
            "Start a new plan? This will remove all rooms."
        );

        if (!confirmed) {
            return;
        }

        rooms = [];
        selectedRoomId = null;
        nextRoomId = 1;

        displayRooms();
        loadSelectedRoom();
    });
}


// -----------------------------------------------------
// SAVE BUTTON - FUTURE FEATURE
// -----------------------------------------------------

if (saveBtn) {

    saveBtn.addEventListener("click", function() {
        alert("Save functionality is planned for a future update.");
    });
}


// -----------------------------------------------------
// EXPORT BUTTON - FUTURE FEATURE
// -----------------------------------------------------

if (exportBtn) {

    exportBtn.addEventListener("click", function() {
        alert("Export functionality is planned for a future update.");
    });
}


// -----------------------------------------------------
// INITIAL PAGE LOAD
// -----------------------------------------------------

displayRooms();
loadSelectedRoom();
