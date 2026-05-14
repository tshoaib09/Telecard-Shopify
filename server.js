const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/shopify-webhook", async (req, res) => {

    // IMPORTANT: respond immediately
    res.status(200).send("OK");

    try {

        console.log("WEBHOOK RECEIVED");

        let phone =
            req.body.phone ||
            req.body.customer?.phone ||
            req.body.shipping_address?.phone ||
            req.body.billing_address?.phone;

        if (!phone) {
            console.log("No phone found");
            return;
        }

        phone = phone.replace(/\D/g, "");

        if (phone.startsWith("92")) {
            phone = "0" + phone.slice(2);
        }

        console.log("Calling:", phone);

        const axios = require("axios");

        const response = await axios.get(
            "https://apiodemo.telecard.com.pk:8887/api/dispatchCall",
            {
                params: {
                    reason_id: 12,
                    phone_number: phone,
                    api_key: "YOUR_API_KEY"
                }
            }
        );

        console.log("API Response:", response.data);

    } catch (err) {
        console.log("ERROR:", err.message);
    }
});

app.post("/shopify-webhook", async (req, res) => {

    try {

        const order = req.body;

        // Get customer phone
        let phone = order.phone || order.customer?.phone;

        if (!phone) {
            return res.status(200).send("No phone");
        }

        // Clean phone number
        phone = phone.replace(/\D/g, "");

        // Convert Pakistan format
        if (phone.startsWith("92")) {
            phone = "0" + phone.slice(2);
        }

        if (phone.startsWith("3")) {
            phone = "0" + phone;
        }

        console.log("Calling:", phone);

        // TELECARD API
        const response = await axios.get(
            "https://apiodemo.telecard.com.pk:8887/api/dispatchCall",
            {
                params: {
                    reason_id: 12,
                    phone_number: phone,
                    api_key: "vTJrX2AoPlmddXgt8ENvn0kJV7hQjujRqTmJn0AgB0Q"
                }
            }
        );

        console.log(response.data);

        res.status(200).send("Call triggered");

    } catch (err) {

        console.log(err.message);

        res.status(500).send("Error");
    }
});

app.get("/", (req, res) => {
    res.send("Telecard Shopify Webhook Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started");
});