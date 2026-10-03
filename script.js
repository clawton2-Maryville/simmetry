// ---------- GET HTML ELEMENTS ----------

const floorPlan = document.getElementById("floorPlan");

const roomButtons = document.querySelectorAll(".room-tool");

const roomNameInput = document.getElementById("roomName");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const roomArea = document.getElementById("roomArea");
const roomCount = document.getElementById("roomCount");
const totalArea = document.getElementById("totalArea");
const footerArea = document.getElementById("footerArea");

const updateRoomBtn = document.getElementById("updateRoomBtn");
const deleteRoomBtn = document.getElementById("deleteRoomBtn");
const newPlanBtn = document.getElementById("newPlanBtn");


// ---------- ROOM DATA ----------

let rooms = [
    {
        id: 1,
        name: "Living Room",
        width: 12,
        height: 14,

        // SPRINT 3 - Store room position
        x: 30,
        y: 30
    }
];

let selectedRoomId = 1;

let nextRoomId = 2;


// ---------- DEFAULT ROOM SIZES ----------

const defaultRoomSizes = {
    "Living Room": {
        width: 12,
        height: 14
    },

    "Kitchen": {
        width: 10,
        height: 12
    },

    "Bedroom": {
        width: 10,
        height: 10
    },

    "Bathroom": {
        width: 6,
        height: 8
    }
};


// ADD ROOMS

roomButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const roomType = button.dataset.room;

        addRoom(roomType);

    });

});


function addRoom(roomType) {

    const defaultSize = defaultRoomSizes[roomType];

     const newRoom = {
        id: nextRoomId,
        name: roomType,
        width: defaultSize.width,
        height: defaultSize.height,
    
        // SPRINT 3 - Give new rooms a starting position
        x: 30 + (rooms.length * 35),
        y: 30 + (rooms.length * 35)
    };
    rooms.push(newRoom);

    selectedRoomId = nextRoomId;

    nextRoomId++;

    displayRooms();

    updatePropertiesPanel();

    updatePlanSummary();
}


// DISPLAY ROOMS ON FLOOR PLAN

function displayRooms() {

    // Clear the current rooms from the canvas.

    floorPlan.innerHTML = "";


    // Display every room stored in the rooms array.

    rooms.forEach(function(room, index) {

        const roomElement = document.createElement("div");

        roomElement.classList.add("room");

        roomElement.dataset.id = room.id;


        // Add selected styling.

        if (room.id === selectedRoomId) {
            roomElement.classList.add("selected");
        }

        
        // ROOM SIZE

        // 1 foot is represented by 10 pixels.

        roomElement.style.width =
            room.width * 10 + "px";

        roomElement.style.height =
            room.height * 10 + "px";

        
        // ROOM POSITION

        roomElement.style.left = room.x + "px";
        roomElement.style.top = room.y + "px";


        // Calculate square footage.

        const area =
            room.width * room.height;


        // Add room information.

        roomElement.innerHTML = `
            <span class="room-name">
                ${room.name}
            </span>

            <small class="room-dimensions">
                ${room.width}' × ${room.height}'
            </small>

            <small class="room-area">
                ${area} sq. ft.
            </small>
        `;


        // Clicking the room selects it.

        roomElement.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                selectRoom(room.id);

            }
        );


        floorPlan.appendChild(roomElement);

    });

}


// SELECT ROOM

function selectRoom(roomId) {

    selectedRoomId = roomId;

    displayRooms();

    updatePropertiesPanel();
}


// Clicking empty space deselects the room.

floorPlan.addEventListener(
    "click",
    function(event) {

        if (event.target === floorPlan) {

            selectedRoomId = null;

            displayRooms();

            clearPropertiesPanel();

        }

    }
);


// PROPERTIES PANEL

function updatePropertiesPanel() {

    const selectedRoom =
        rooms.find(function(room) {

            return room.id === selectedRoomId;

        });


    if (!selectedRoom) {
        clearPropertiesPanel();
        return;
    }


    roomNameInput.value =
        selectedRoom.name;

    widthInput.value =
        selectedRoom.width;

    heightInput.value =
        selectedRoom.height;

    roomArea.textContent =
        selectedRoom.width *
        selectedRoom.height;
}


function clearPropertiesPanel() {

    roomNameInput.value = "";

    widthInput.value = "";

    heightInput.value = "";

    roomArea.textContent = "0";
}


// LIVE SQUARE FOOTAGE PREVIEW

widthInput.addEventListener(
    "input",
    calculateAreaPreview
);

heightInput.addEventListener(
    "input",
    calculateAreaPreview
);


function calculateAreaPreview() {

    const width =
        Number(widthInput.value);

    const height =
        Number(heightInput.value);


    if (width > 0 && height > 0) {

        roomArea.textContent =
            width * height;

    } else {

        roomArea.textContent = "0";

    }
}


// UPDATE ROOM

updateRoomBtn.addEventListener(
    "click",
    function() {

        if (selectedRoomId === null) {

            alert("Please select a room first.");

            return;
        }


        const selectedRoom =
            rooms.find(function(room) {

                return room.id === selectedRoomId;

            });


        if (!selectedRoom) {
            return;
        }


        const newName =
            roomNameInput.value.trim();

        const newWidth =
            Number(widthInput.value);

        const newHeight =
            Number(heightInput.value);


        // Make sure dimensions are valid.

        if (newWidth <= 0 || newHeight <= 0) {

            alert(
                "Width and height must be greater than 0."
            );

            return;
        }


        // Update room information.

        selectedRoom.name =
            newName || "Room";

        selectedRoom.width =
            newWidth;

        selectedRoom.height =
            newHeight;


        displayRooms();

        updatePropertiesPanel();

        updatePlanSummary();

    }
);


// DELETE ROOM

deleteRoomBtn.addEventListener(
    "click",
    function() {

        if (selectedRoomId === null) {

            alert("Please select a room to delete.");

            return;
        }


        rooms = rooms.filter(
            function(room) {

                return room.id !== selectedRoomId;

            }
        );


        selectedRoomId = null;


        displayRooms();

        clearPropertiesPanel();

        updatePlanSummary();

    }
);


// PLAN SUMMARY

function updatePlanSummary() {

    roomCount.textContent =
        rooms.length;


    let planArea = 0;


    rooms.forEach(function(room) {

        planArea +=
            room.width * room.height;

    });


    totalArea.textContent =
        planArea;

    footerArea.textContent =
        planArea;
}


// NEW PLAN

newPlanBtn.addEventListener(
    "click",
    function() {

        const startNewPlan =
            confirm(
                "Start a new plan? All current rooms will be removed."
            );


        if (!startNewPlan) {
            return;
        }


        rooms = [];

        selectedRoomId = null;

        nextRoomId = 1;


        displayRooms();

        clearPropertiesPanel();

        updatePlanSummary();

    }
);

let draggedRoom = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Start dragging when the mouse is pressed on a room
floorPlan.addEventListener("mousedown", function (event) {

    const room = event.target.closest(".room");

    if (!room) {
        return;
    }

    draggedRoom = room;

    const roomRect = room.getBoundingClientRect();

    dragOffsetX = event.clientX - roomRect.left;
    dragOffsetY = event.clientY - roomRect.top;

    room.style.cursor = "grabbing";
});

// Move selected room
document.addEventListener("mousemove", function (event) {

    if (!draggedRoom) {
        return;
    }

    const floorPlanRect = floorPlan.getBoundingClientRect();

    let newX =
        event.clientX -
        floorPlanRect.left -
        dragOffsetX;

    let newY =
        event.clientY -
        floorPlanRect.top -
        dragOffsetY;

    // Keep room inside floor plan
    const maxX =
        floorPlan.clientWidth -
        draggedRoom.offsetWidth;

    const maxY =
        floorPlan.clientHeight -
        draggedRoom.offsetHeight;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    draggedRoom.style.left = newX + "px";
    draggedRoom.style.top = newY + "px";
});

// Stop dragging when mouse button is released
document.addEventListener("mouseup", function () {

    if (draggedRoom) {


        const roomId = Number(draggedRoom.dataset.id);

        const room = rooms.find(function(room) {
            return room.id === roomId;
        });

        if (room) {
            room.x = parseFloat(draggedRoom.style.left);
            room.y = parseFloat(draggedRoom.style.top);
        }

        draggedRoom.style.cursor = "grab";
        draggedRoom = null;
    }
});



displayRooms();

updatePropertiesPanel();

updatePlanSummary();
