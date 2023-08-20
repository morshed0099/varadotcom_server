const express = require('express');
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId, Db } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.1m4kiwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const userCollection = client.db('varadotcom').collection('user')
const rentCollection = client.db('varadotcom').collection('rents')
const publishRentcollection = client.db('varadotcom').collection('publishRent')
const bookingCollection = client.db('varadotcom').collection('booking')
async function run() {
    try {

        app.post('/user', async (req, res) => {
            console.log('yeas')
            const user = req.body
            const email=user.email
            console.log(email);
            const query = {
                email: email
            }
            const data = await userCollection.find(query).toArray()
            if (data.length) {
                // console.log()
                const hll =res.send({message:'user alredy exist'});
                console.log(hll,'32');
                return hll
            }
            const result = await userCollection.insertOne(user) 
            console.log(result);          
            return res.send(result)
            
        })

        app.get('/admin/:email', async (req, res) => {
            const user = req.params.email
            // console.log(user)
            const query = {
                name: user
            }
            const admin = await userCollection.findOne(query)
            console.log(admin)
            res.send({ isAdmin: admin?.userRoll === "admin" })
        })

        // all publish rent 

        app.get('/publishrent', async (req, res) => {
            const division = req.query.division
            if (division === "null") {
                const result = await publishRentcollection.find({}).toArray()
                res.send(result);
            } else if (division) {
                const query = {
                    areaDivison: division
                }
                const result = await publishRentcollection.find(query).toArray()
                if (result.length === 0) {
                    return res.send([{ message: "no data found" }])
                }
                res.send(result);
            }

        })
        app.delete('/rent/delete/:id', async (req, res) => {
            const id = req.params.id
            console.log(id, '56');
            const query = {
                _id: new ObjectId(id)
            }
            const rent = await rentCollection.deleteOne(query)
            const publishRent = await publishRentcollection.deleteOne(query)
            console.log(rent, publishRent, '61');
            res.send(rent, publishRent, '63');
        })
        app.delete('/detele/user/:id', async (req, res) => {
            const id = req.params.id
            const query = {
                _id: new ObjectId(id)
            }
            const result = await userCollection.deleteOne(query)
            res.send(result);
        })
        app.put('/user/verify/:id', async (req, res) => {
            const id = req.params.id
            console.log(id, '77');
            const query = {
                _id: new ObjectId(id)
            }
            const options = { upsert: true },
                updateDoc = {
                    $set: {
                        varify: true
                    }
                }
            const result = await userCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })
        app.post('/bokking', async (req, res) => {
            const bookingData = req.body
            const postId = req.body.postId
            const buyerId = req.body.buyerId
            const query = {
                postId: postId,
                buyerId: buyerId
            }
            const exist = await bookingCollection.findOne(query)
            if (exist) {
                return res.send({ message: "alredy added !! please check on dasboad" })
            }
            const result = await bookingCollection.insertOne(bookingData)
            res.send(result)
        })
        app.get('/mybooking/:email', async (req, res) => {
            const email = req.params.email
            const query = {
                buyerEmail: email
            }
            const result = await bookingCollection.find(query).toArray()
            res.send(result);
        })
        app.get('/dasboard/update/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = {
                _id: new ObjectId(id)
            }
            const result = await rentCollection.findOne(query)
            res.send(result)
        })
        app.get('/seller/:email', async (req, res) => {
            const user = req.params.email
            console.log(user);
            const query = {
                name: user
            }
            const seller = await userCollection.findOne(query)
            console.log(seller)
            res.send({ isSeller: seller?.userRoll === "seller" })
        })
        app.get('/buyer/:email', async (req, res) => {
            const user = req.params.email
            console.log(user)
            const query = {
                name: user
            }
            const buyer = await userCollection.findOne(query)
            console.log(buyer);
            res.send({ isBuyer: buyer?.userRoll === "buyer" })
        })
        app.get('/addedporduct/:sellerEmail', async (req, res) => {
            const sellerEmail = req.params.sellerEmail
            const query = {
                sellerEmail: sellerEmail
            }
            const result = await rentCollection.find(query).toArray()
            console.log(result)
            res.send(result);
        })
        app.post('/rentadd', async (req, res) => {
            const rentDetails = req.body
            const result = await rentCollection.insertOne(rentDetails)
            console.log(result);
            res.send(result)
        })

        app.patch('/rent/update', async (req, res) => {
            const updateData = req.body
            const tilte = req.body.title
            const oldId = req.body._id
            const img = req.body.img
            const img2 = req.body.img2
            const img3 = req.body.img3
            const rent = req.body.rent
            const phoneNumber = req.body.phoneNumber
            const areaDivison = req.body.areaDivison
            const areaDistic = req.body.areaDistic
            const areaThana = req.body.areaThana
            const sellerEmail = req.body.sellerEmial
            const sellerName = req.body.sellerName
            const query = {
                _id: new ObjectId(oldId)
            }
            const options = { upsert: true };
            const updateDoc = {
                $set: {

                    title: tilte,
                    img: img,
                    img2: img2,
                    img3: img3,
                    rent: rent,
                    phoneNumber: phoneNumber,
                    areaDivison: areaDivison,
                    areaDistic: areaDistic,
                    areaThana: areaThana,
                    sellerEmail: sellerEmail,
                    sellerName: sellerName
                }
            }
            const result = await rentCollection.updateOne(query, updateDoc, options)

            res.send(result)
        })
        app.put('/publisrent/:id', async (req, res) => {
            const id = req.params.id
            const publish = req.body.publish
            console.log(publish);
            const query = {
                _id: new ObjectId(id)
            }
            options = { upsert: true }
            updateDoc = {
                $set: {
                    publish: publish
                }
            }
            const result = await rentCollection.updateOne(query, updateDoc, options)
            const rentDetails = await rentCollection.findOne(query);
            const publishRent = await publishRentcollection.insertOne(rentDetails)
            console.log(result)
            res.send(result);
        })
        app.get('/user/allbuyer', async (req, res) => {
            const query = {
                userRoll: "buyer"
            }
            const result = await userCollection.find(query).toArray()
            console.log(result);
            res.send(result);
        })
        app.get('/user/allseller', async (req, res) => {
            const query = {
                userRoll: "seller"
            }
            const result = await userCollection.find(query).toArray()
            res.send(result);
        })
    } finally {

    }
} run().catch(error => console.error(error))
app.get('/', async (req, res) => {
    res.send('server is running');
})

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})