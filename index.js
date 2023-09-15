const express = require('express')
const app = express();
const { MongoClient } = require("mongodb");
var bodyParser = require('body-parser');
const {
    EncryptedField,
    EncryptedRow,
    BlindIndex,
    CompoundIndex,
    CipherSweet,
    LastFourDigits,
    FIPSCrypto
} = require('ciphersweet-js');

const port = 3000;

const jsonParser = bodyParser.json();

const uri = "mongodb+srv://surekha:surekha@cluster0.n0qoqkn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db('My_database');
const collection = database.collection('nonCipher');

const blindIndexDatabase = client.db('blind_index');
const blindIndexCollection = blindIndexDatabase.collection('blind_index_driving_license_number')
const StringProvider = require('ciphersweet-js').StringProvider;
const provider = new StringProvider(
    'a981d3894b5884f6965baea64a09bb5b4b59c10e857008fc814923cf2f2de558'
);
const engine = new CipherSweet(provider, new FIPSCrypto());
const drivingLicenseNumber = (new EncryptedField(engine, 'hello', 'Driving_License_Number'))
// Add a blind index for the "last 4 of DLN":
.addBlindIndex(
    new BlindIndex(
        // Name (used in key splitting):
        'dln_last_four',
        // List of Transforms: 
        [new LastFourDigits()],
        // Bloom filter size (bits)
        16,
        // Fast hash (default: false)
        false
    )
)
// Add a blind index for the full DLN:
.addBlindIndex(
    new BlindIndex(
        'drivingLicenseNumber', 
        [],
        256
    )
);

app.get("/getRecord", async (req, res) => {
    // Some example parameters:
    console.log(req.query.dln);
    const queryDLN = req.query.dln;

    // Use these values in search queries:
    drivingLicenseNumber.getAllBlindIndexes(queryDLN).then(function (indexes) {
        console.log("get all blind indexes");
        console.log(indexes);
    });
    let encodedDLN = null
    drivingLicenseNumber.getBlindIndex(queryDLN, 'drivingLicenseNumber').then(function (result) {
        console.log("get blind indexes");
        console.log(result);
        encodedDLN = result;
    });

    const record = await blindIndexCollection.findOne({drivingLicenseNumber: "b9b71cf4"});
    res.send(record).status(200);   
});

  
app.post("/", jsonParser, async (req, res) => {
    let contactInfo = req.body;
    console.log("contactInfo");
    console.log(contactInfo);

    let provider = new StringProvider(
        // Example key, chosen randomly, hex-encoded:
        'a981d3894b5884f6965baea64a09bb5b4b59c10e857008fc814923cf2f2de558'
    );
    let engine = new CipherSweet(provider, new FIPSCrypto());
    let drivingLicenseNumber = (new EncryptedField(engine, 'hello', 'Driving_License_Number'))
    // Add a blind index for the "last 4 of SSN":
    .addBlindIndex(
        new BlindIndex(
            // Name (used in key splitting):
            'dln_last_four',
            // List of Transforms: 
            [new LastFourDigits()],
            // Bloom filter size (bits)
            16,
            // Fast hash (default: false)
            false
        )
    )
    // Add a blind index for the full DLN:
    .addBlindIndex(
        new BlindIndex(
            'drivingLicenseNumber', 
            [],
            32
        )
    );

    drivingLicenseNumber.prepareForStorage(contactInfo['NINO']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        /* { dln_last_four: '2acb', drivingLicenseNumber: '311314c1' } */
    });

    // Use these values in search queries:
    drivingLicenseNumber.getAllBlindIndexes('CB123456L').then(function (indexes) {
        console.log("get all blind indexes");
        console.log(indexes);
        /* { dln_last_four: '2acb', drivingLicenseNumber: '311314c1' } */
    });
    drivingLicenseNumber.getBlindIndex('CB123456L', 'dln_last_four').then(function (lastFour) {
        console.log("get blind indexes");
        console.log(lastFour);
        /* 2acb */
    });

    res.send(movie).status(200);
    // res.send({"text": "hello"}).status(200);
});



app.post("/addRow", jsonParser, async (req, res) => {
    let dlnDetails = req.body;
    console.log("dlnDetails");
    console.log(dlnDetails);

    drivingLicenseNumber.prepareForStorage(dlnDetails['DLN']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        console.log("ciphertext[1]['drivingLicenseNumber']");
        console.log(ciphertext[1]['drivingLicenseNumber']);
        dlnDetails.NINO=ciphertext[1]['drivingLicenseNumber'];
        res.send(dlnDetails).status(200);
        /* { dln_last_four: '2acb', drivingLicenseNumber: '311314c1' } */
    });
});



app.post("/addRowToDatabase", jsonParser, async (req, res) => {
    let dlnDetails = req.body;
    console.log("dlnDetails");
    console.log(dlnDetails);

    drivingLicenseNumber.prepareForStorage(dlnDetails['DLN']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        console.log("ciphertext[1]['drivingLicenseNumber']");
        console.log(ciphertext[1]['drivingLicenseNumber']);
        dlnDetails.NINO = ciphertext[1]['drivingLicenseNumber'];
        const truncatedLast16 = cipher.substring(48, 63);
        const truncatedLast8 = cipher.substring(56, 63);
        const truncatedLast4 = cipher.substring(60, 63);
        dlnDetails.truncatedLast16 = truncatedLast16;
        dlnDetails.truncatedLast8 = truncatedLast8;
        dlnDetails.truncatedLast4 = truncatedLast4;
        let result =  collection.insertOne(dlnDetails);
        res.send("added to database successfully").status(200);
    });
});

app.post("/addRowToDatabaseMultipleBI", jsonParser, async (req, res) => {
    let dlnDetails = req.body;
    console.log("dlnDetails");
    console.log(dlnDetails);

    let row = (new EncryptedRow(engine, 'contacts'))
    .addTextField('DLN')
    .addTextField('address');

    // Add a normal Blind Index on one field:
    row.addBlindIndex(
        'drivingLicenseNumber',
        new BlindIndex(
            'contact_dln_last_four',
            [],
            32, // 32 bits = 4 bytes
            // Fast hash (default: false)
            false
        )
    );

    // Create/add a compound blind index on multiple fields:
    row.addCompoundIndex(
        new CompoundIndex(
            'dln_address',
            ['DLN', 'address'],
            32, // 32 bits = 4 bytes
            true // fast hash
        ).addTransform('ssn', new LastFourDigits())
    );

    row.prepareForStorage(dlnDetails['DLN']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        res.send(ciphertext).status(200);
    });
});

app.get("/updateDLNHash", jsonParser, async(req, res) => {
    let dlnCollection = await collection.find({});

    let dlnList = await dlnCollection.toArray();
    for(let i = 0; i < dlnList.length; i++) {
        const dlnDetail = dlnList[i];
        drivingLicenseNumber.prepareForStorage(dlnDetail["DLN"]).then(async(ciphertext, indexes) => {
            const cipher = cipherText[1]['dln'];
            dlnDetail.NINO = cipher.trim();

            
            const truncatedLast16 = cipher.substring(48, 63);
            const truncatedLast8 = cipher.substring(56, 63);
            const truncatedLast4 = cipher.substring(60, 63);
            dlnDetails.truncatedLast16 = truncatedLast16;
            dlnDetails.truncatedLast8 = truncatedLast8;
            dlnDetails.truncatedLast4 = truncatedLast4;
            await blindIndexCollection.insertOne(dlnDetail);
        })
    }
    res.send("Added to database successfully").status(200);
});

app.get("/getTruncatedLast16", async(req, res) => {
    const searchTruncatedLast16 = req.query.truncatedLast16;
    const record = await blindIndexCollection.find({truncatedLast16: searchTruncatedLast16});
    const recordArray = await record.toArray();
    res.send(recordArray).status(200);
});

app.get("/getTruncatedLast8", async(req, res) => {
    const searchTruncatedLast8 = req.query.truncatedLast8;
    const record = await blindIndexCollection.find({truncatedLast8: searchTruncatedLast8});
    const recordArray = await record.toArray();
    res.send(recordArray).status(200);
});

app.get("/getTruncatedLast4", async(req, res) => {
    const searchTruncatedLast4 = req.query.truncatedLast4;
    const record = await blindIndexCollection.find({truncatedLast4: searchTruncatedLast4});
    const recordArray = await record.toArray();
    res.send(recordArray).status(200);
});


  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});