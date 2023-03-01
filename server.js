const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
    origin: true
}));

dotenv.config({ path: "./config.env" });
const port = process.env.PORT;

require('./dataBase/connection');
const User = require('./dataBase/model');



app.post("/contact", async (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        res.status(401).json({ message: "please fill all details" });
    } else {

        try {

            const findUser = await User.findOne({ email: email });

            if (findUser) {
                const _id = findUser._id;
                var oldmessage = findUser.message;
                const array = [{ date: Date.now(), message: message, }];
                var updatedMessage = oldmessage.concat(array);
                const newData = await User.findByIdAndUpdate({ _id }, { $set: { message: updatedMessage } }, { new: true });
                res.status(201).json({ message: "message send successfully" });

            } else {

                const array = [{ date: Date.now(), message: message, }];
                const data = new User({ name: name, email: email, message: array });
                const result = await data.save();
                res.status(201).json({ message: "message send successfully" });
            }

        } catch (error) {
            console.log(error);
        }

    }

});


app.get("/messages", async (req, res) => {
    try {
        const data = await User.find();
        res.status(200).json({
            sucess: true,
            data: data
        });
    } catch (error) {
        console.log(error);
    }
});


app.post("/del", async (req, res) => {
    try {
        await User.findByIdAndDelete({ _id: req.body.id });
        res.status(200).json({
            sucess: true,
            message: "user deleted sucessfully"
        })
    } catch (error) {
        console.log(error);
    }
})


app.listen(port, () => {
    console.log(`listening at port ${port}`);
})