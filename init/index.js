const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        geometry: {
            type: "Point", // Adjust if needed
            coordinates: obj.geometry?.coordinates || [34.0381, 118.6923] // Default coordinates if missing
        },
        owner: new mongoose.Types.ObjectId("67500c1e58f5e40f029dcca5") // Use "new" here
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
