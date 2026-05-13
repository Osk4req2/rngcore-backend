const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

let purchases = [];

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

app.get("/", (req, res) => {
    res.send("RNGCORE BACKEND DZIALA");
});

app.get("/test", (req, res) => {

    const nick = req.query.nick || "Nieznany";
    const amount = Number(req.query.amount || 0);

    purchases.push({
        id: Date.now().toString(),
        nick,
        amount,
        code: "TEST",
        done: false
    });

    console.log("TESTOWY ZAKUP:", nick, amount);

    res.json({
        success: true
    });
});

app.post("/claim", (req, res) => {

    const nick = String(req.body.nick || "").trim();
    const amount = Number(req.body.amount || 0);
    const code = String(req.body.code || "").trim();

    if (!nick || amount <= 0 || !code) {
        return res.json({
            success: false,
            error: "Wpisz nick, kwotę i wiadomość/ID donate."
        });
    }

    purchases.push({
        id: Date.now().toString(),
        nick,
        amount,
        code,
        done: false
    });

    console.log("ODEBRANIE vPLN:", nick, amount, code);

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
