const express = require('express')
const app = express();
const { MongoClient } = require("mongodb");
var bodyParser = require('body-parser');
const {
    EncryptedField,
    BlindIndex,
    CipherSweet,
    LastFourDigits,
    FIPSCrypto
} = require('ciphersweet-js');
// const {FIPSCrypto, StringProvider, CipherSweet} = require('ciphersweet-js');
const StringProvider = require('ciphersweet-js').StringProvider;


const port = 3000;

var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get("/", async (req, res) => {
    const uri = "mongodb+srv://surekha:surekha@cluster0.n0qoqkn.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    const query = { NINO : 'AL456789L' };
    const movie = await movies.findOne(query);
    console.log(movie);

    let provider = new StringProvider(
        // Example key, chosen randomly, hex-encoded:
        'a981d3894b5884f6965baea64a09bb5b4b59c10e857008fc814923cf2f2de558'
    );
    let engine = new CipherSweet(provider, new FIPSCrypto());
    let nino = (new EncryptedField(engine, 'hello', 'NINO'))
    // Add a blind index for the "last 4 of SSN":
    .addBlindIndex(
        new BlindIndex(
            // Name (used in key splitting):
            'contact_nino_last_four',
            // List of Transforms: 
            [new LastFourDigits()],
            // Bloom filter size (bits)
            16,
            // Fast hash (default: false)
            false
        )
    )
    // Add a blind index for the full NINO:
    .addBlindIndex(
        new BlindIndex(
            'contact_nino', 
            [],
            32
        )
    );

    // Some example parameters:
    let contactInfo = {
        'name': 'John Smith',
        'ssn': '123-45-6789',
        'email': 'foo@example.com',
        "NINO": "CB123456L",
        "firstName": "Charles",
        "lastName": "Babbage",
        "address": "Marylebone, London"
    };
    nino.prepareForStorage(contactInfo['NINO']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    });

    // Use these values in search queries:
    nino.getAllBlindIndexes('CB123456L').then(function (indexes) {
        console.log("get all blind indexes");
        console.log(indexes);
        /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    });
    nino.getBlindIndex('CB123456L', 'contact_nino_last_four').then(function (lastFour) {
        console.log("get blind indexes");
        console.log(lastFour);
        /* 2acb */
    });
  
    res.send(movie).status(200);
  });
  /**working */

  
  app.post("/", jsonParser, async (req, res) => {
    let contactInfo = req.body;
    console.log("contactInfo");
    console.log(contactInfo);
    const uri = "mongodb+srv://surekha:surekha@cluster0.n0qoqkn.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    const query = { NINO : 'AL456789L' };
    const movie = await movies.findOne(query);
    console.log(movie);

    
    let provider = new StringProvider(
        // Example key, chosen randomly, hex-encoded:
        'a981d3894b5884f6965baea64a09bb5b4b59c10e857008fc814923cf2f2de558'
    );
    let engine = new CipherSweet(provider, new FIPSCrypto());
    let nino = (new EncryptedField(engine, 'hello', 'NINO'))
    // Add a blind index for the "last 4 of SSN":
    .addBlindIndex(
        new BlindIndex(
            // Name (used in key splitting):
            'contact_nino_last_four',
            // List of Transforms: 
            [new LastFourDigits()],
            // Bloom filter size (bits)
            16,
            // Fast hash (default: false)
            false
        )
    )
    // Add a blind index for the full NINO:
    .addBlindIndex(
        new BlindIndex(
            'contact_nino', 
            [],
            32
        )
    );
    
    nino.prepareForStorage(contactInfo['NINO']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    });

    // Use these values in search queries:
    nino.getAllBlindIndexes('CB123456L').then(function (indexes) {
        console.log("get all blind indexes");
        console.log(indexes);
        /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    });
    nino.getBlindIndex('CB123456L', 'contact_nino_last_four').then(function (lastFour) {
        console.log("get blind indexes");
        console.log(lastFour);
        /* 2acb */
    });
  
    res.send(movie).status(200);
    // res.send({"text": "hello"}).status(200);
  });



  app.post("/addRow", jsonParser, async (req, res) => {
    let contactInfo = req.body;
    console.log("contactInfo");
    console.log(contactInfo);
    const uri = "mongodb+srv://surekha:surekha@cluster0.n0qoqkn.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    const query = { NINO : 'AL456789L' };
    const movie = await movies.findOne(query);
    console.log(movie);

    
    let provider = new StringProvider(
        // Example key, chosen randomly, hex-encoded:
        'a981d3894b5884f6965baea64a09bb5b4b59c10e857008fc814923cf2f2de558'
    );
    let engine = new CipherSweet(provider, new FIPSCrypto());
    let nino = (new EncryptedField(engine, 'hello', 'NINO'))
    // Add a blind index for the full NINO:
    .addBlindIndex(
        new BlindIndex(
            'contact_nino', 
            [],
            32
        )
    );
    
    nino.prepareForStorage(contactInfo['NINO']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        console.log("ciphertext[1]['contact_nino']");
        console.log(ciphertext[1]['contact_nino']);
        contactInfo.NINO=ciphertext[1]['contact_nino'];
        res.send(contactInfo).status(200);
        /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    });
    

    // Use these values in search queries:
    // nino.getAllBlindIndexes('CB123456L').then(function (indexes) {
    //     console.log("get all blind indexes");
    //     console.log(indexes);
    //     /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    // });
    // nino.getBlindIndex('CB123456L', 'contact_nino_last_four').then(function (lastFour) {
    //     console.log("get blind indexes");
    //     console.log(lastFour);
    //     /* 2acb */
    // });
  
    // res.send(movie).status(200);
    // res.send({"text": "hello"}).status(200);
  });



app.post("/addRowStoreToDatabase", jsonParser, async (req, res) => {
    let contactInfo = req.body;
    console.log("contactInfo");
    console.log(contactInfo);
    const uri = "mongodb+srv://surekha:surekha@cluster0.n0qoqkn.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    const query = { NINO : 'AL456789L' };
    const movie = await movies.findOne(query);
    console.log(movie);

    
    let provider = new StringProvider(
        // Example key, chosen randomly, hex-encoded:
        'a981d3894b5884f6965baea64a09bb5b4b59c10e857008fc814923cf2f2de558'
    );
    let engine = new CipherSweet(provider, new FIPSCrypto());
    let nino = (new EncryptedField(engine, 'hello', 'NINO'))
    // Add a blind index for the full NINO:
    .addBlindIndex(
        new BlindIndex(
            'contact_nino', 
            [],
            32
        )
    );
    
    nino.prepareForStorage(contactInfo['NINO']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        console.log("ciphertext[1]['contact_nino']");
        console.log(ciphertext[1]['contact_nino']);
        contactInfo.NINO=ciphertext[1]['contact_nino'];
        let result =  movies.insertOne(contactInfo);
        res.send("added to database successfully").status(200);
        /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    });
    // Use these values in search queries:
    // nino.getAllBlindIndexes('CB123456L').then(function (indexes) {
    //     console.log("get all blind indexes");
    //     console.log(indexes);
    //     /* { contact_nino_last_four: '2acb', contact_nino: '311314c1' } */
    // });
    // nino.getBlindIndex('CB123456L', 'contact_nino_last_four').then(function (lastFour) {
    //     console.log("get blind indexes");
    //     console.log(lastFour);
    //     /* 2acb */
    // });
  });

  
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});