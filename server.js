const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
app.use(cors({ methods: "GET", origin: "*" }));


let searchDate = new Date().getTime() - 2600000 * 1000;
let stories = [];
const dayInMilliseconds = 1000 * 60 * 60 * 24;
const updateData = async () => {
    searchDate += dayInMilliseconds;
    stories = [];

    while (
        (stories.length == 0 || stories[stories.length - 1].u > searchDate) &&
        stories.length < 10000
    ) {
        await fetch("https://mspfa.com/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: "do=stories&n=&t=&h=4&o=updated&p=p&m=1000",
        })
            .then((e) => e.json())
            .then((data) => {
                stories = stories.concat(data);
            });
    }
};
updateData();

setInterval(updateData, dayInMilliseconds);

app.get("/api/random", (req, res) => {
    if(stories.length > 0) {
        res.status(200).send(`https://mspfa.com/?s=${stories[Math.floor(Math.random() * (stories.length - 1))].i}&p=1`)
    } else {
        res.status(500).send("https://mspfa.com/?s=1&p=1");
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}.`);
});
