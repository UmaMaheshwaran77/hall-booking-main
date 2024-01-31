
//getting the needed package here through require

const express = require("express");
const moment = require("moment");


const app = express();
const moments = moment();

app.use(express.json());

//storing the created data in empty array 

const rooms = [];
const booking = [];

//initially when the whole api with / path is called

app.get("/", (req, res) => {
    res.send("Api for hall booking !!");
})

//the created hall details are get throw this api endpoint

app.get("/halldetails", (req, res) => {
    if (rooms.length > 0) {
        res.status(200).json(rooms);
    } else {
        res.status(404).send("No Rooms are Listed and not found");
    }

})

//api endpoint to create hall

app.post("/createhall", (req, res) => {

const existingData = rooms.filter((data)=> data.hallName===req.body.hallName);
if(existingData.length>0){
    res.send("Already Existsing Hall");
    }
   
else{
    req.body.id = rooms.length + 1;

    console.log(req.body.id);
    rooms.push(req.body);
    console.log(req.body);
    res.json({ message: "Room created Successfully" });
}
  
});


//api endpoint for booking Data 

app.get("/bookingdetails", (req, res) => {
    if (booking.length > 0) {
        res.status(200).json(booking);
    } else {
        res.status(404).send("No Rooms are booked and not found");
    }
}
)

//room booking api endpoint

app.post("/booking/:id", (req, res) => {
    let roomFind = rooms.filter((room) => room.id === req.params.id);
    if (roomFind === undefined) {
        res.status(404).json({ message: "Not found" });
    }
    else {
        let existsBookedRoom = booking.find((roombook) => roombook.roomId === req.params.id);
        if (existsBookedRoom) {
            res.send("Room is already booked!");



        } else {
            req.body.bookingId = "B" + booking.length + 1 + "R";

            let date = new Date();

            req.body.bookedDate = date.toLocaleDateString();

            req.body.bookedtime = moments.format('LT');

            req.body.roomId = parseInt(req.params.id);
            req.body.status = true;
            booking.push(req.body);
            res.json({ message: "Room booked Successfully" });
        }

    }
})


//api endpoint for getting booked and not booked status of halls

app.get("/bookeddata", (req, res) => {
    let bookedData = rooms.map((room) => {
        let bookingItem = booking.find((item) => parseInt(item.roomId) === parseInt(room.id));

        if (bookingItem) {
            return {
                hallName: room.hallName,
                customer: bookingItem.customer,
                bookingStatus: "Booked",
                bookingDate: bookingItem.bookingDate,
                startTime: bookingItem.startTime,
                endTime: bookingItem.endTime,
                bookingId: bookingItem.bookingId,
                bookedDate: bookingItem.bookedDate,
                bookedtime: bookingItem.bookedtime,
                roomId: bookingItem.roomId
            };
        } else {
            return {
                hallName: room.hallName,
                bookingStatus: "Not Booked",
                roomId: room.id
            };
        }
    });

    res.json(bookedData);
});


//api endpoint for getting customer datas how booked the halls

app.get("/customerdata", (req, res) => {
    const customerData = booking.map((bookedItem) => {
        const roomData = rooms.filter((room) => parseInt(room.id) === parseInt(bookedItem.roomId));
        // console.log(roomData);

        if (bookedItem) {
            return {
                customerName: bookedItem.customer,
                hallName: roomData[0].hallName,
                bookingDate: bookedItem.bookingDate,
                startTime: bookedItem.startTime,
                endTime: bookedItem.endTime,
                bookingId: bookedItem.bookingId,

            };

        }
    });

    res.json(customerData);
});

//api endpoint for getting how many halls booked by them and count


app.get("/customerbookedcount", (req, res) => {
    const customerBookingCount = {};

    // Iterate through the booking array
    booking.forEach((bookedItem) => {
        const roomData = rooms.find((room) => parseInt(room.id) === parseInt(bookedItem.roomId));

        if (bookedItem && roomData) {
            const customerName = bookedItem.customer;

            // If the customerName is not in the count object, initialize it with 1, else increment the count
            customerBookingCount[customerName] = (customerBookingCount[customerName] || 0) + 1;
        }
    });

    // Convert the customerBookingCount object into an array of objects
    const customerBookingCountArray = Object.entries(customerBookingCount).map(([customerName, count]) => ({
        customerName,
        bookingCount: count
    }));

    res.json(customerBookingCountArray);
});



app.listen(3005);

