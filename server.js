const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

let purchases = [];

app.get("/", (req, res) => {
    res.send("RNGCORE BACKEND DZIALA");
});

/*
TESTOWY DONATE:
https://twojbackend.up.railway.app/test?nick=Osk4req&amount=50
*/

app.get("/test", (req, res) => {

    const nick = req.query.nick || "Nieznany";
    const amount = Number(req.query.amount || 0);

    purchases.push({
        id: Date.now().toString(),
        nick,
        amount,
        done: false
    });

    console.log("NOWY ZAKUP:", nick, amount);

    res.json({
        success: true
    });
});

app.get("/api/purchases", (req, res) => {
    res.json(
        purchases.filter(p => !p.done)
    );
});

app.post("/api/purchases/:id/done", (req, res) => {

    const purchase =
        purchases.find(
            p => p.id === req.params.id
        );

    if (purchase) {
        purchase.done = true;
    }

    res.json({
        success: true
    });
});

app.listen(PORT, () => {
    console.log("BACKEND DZIALA");
});
