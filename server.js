const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const SECRET = "rngcore-secret";

const purchasesFile = "./purchases.json";

if (!fs.existsSync(purchasesFile)) {
    fs.writeFileSync(purchasesFile, JSON.stringify([]));
}

app.get("/", (req, res) => {
    res.send("RNGCORE BACKEND DZIALA");
});

app.post("/webhook/tipply", (req, res) => {

    if (req.query.secret !== SECRET) {
        return res.status(403).json({
            error: "Brak dostepu"
        });
    }

    const data = req.body;

    const nick =
        data.nick ||
        data.username ||
        data.message ||
        "Nieznany";

    const amount =
        Number(data.amount || data.value || 0);

    const purchases =
        JSON.parse(fs.readFileSync(purchasesFile));

    purchases.push({
        id: Date.now().toString(),
        nick,
        amount,
        done: false
    });

    fs.writeFileSync(
        purchasesFile,
        JSON.stringify(purchases, null, 2)
    );

    console.log("NOWA PLATNOSC:", nick, amount);

    res.json({
        success: true
    });
});

app.get("/api/purchases", (req, res) => {

    const purchases =
        JSON.parse(fs.readFileSync(purchasesFile));

    res.json(
        purchases.filter(p => !p.done)
    );
});

app.post("/api/purchases/:id/done", (req, res) => {

    const purchases =
        JSON.parse(fs.readFileSync(purchasesFile));

    const purchase =
        purchases.find(
            p => p.id === req.params.id
        );

    if (purchase) {
        purchase.done = true;
    }

    fs.writeFileSync(
        purchasesFile,
        JSON.stringify(purchases, null, 2)
    );

    res.json({
        success: true
    });
});

app.listen(PORT, () => {
    console.log("BACKEND DZIALA");
});
