const express = require('express')
const app = express();
const { MongoClient } = require("mongodb");
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
    let ssn = (new EncryptedField(engine, 'hello', 'ssn'))
    // Add a blind index for the "last 4 of SSN":
    .addBlindIndex(
        new BlindIndex(
            // Name (used in key splitting):
            'contact_ssn_last_four',
            // List of Transforms: 
            [new LastFourDigits()],
            // Bloom filter size (bits)
            16,
            // Fast hash (default: false)
            false
        )
    )
    // Add a blind index for the full SSN:
    .addBlindIndex(
        new BlindIndex(
            'contact_ssn', 
            [],
            32
        )
    );

    // Some example parameters:
    let contactInfo = {
        'name': 'John Smith',
        'ssn': '123-45-6789',
        'email': 'foo@example.com'
    };
    ssn.prepareForStorage(contactInfo['ssn']).then((ciphertext, indexes) => {
        console.log("ciphertext");
        console.log(ciphertext);
        /* nacl:jIRj08YiifK86YlMBfulWXbatpowNYf4_vgjultNT1Tnx2XH9ecs1TqD59MPs67Dp3ui */
        console.log("indexes");
        console.log(indexes);
        /* { contact_ssn_last_four: '2acb', contact_ssn: '311314c1' } */
    });

    // Use these values in search queries:
    ssn.getAllBlindIndexes('123-45-6789').then(function (indexes) {
        console.log("get all blind indexes");
        console.log(indexes);
        /* { contact_ssn_last_four: '2acb', contact_ssn: '311314c1' } */
    });
    ssn.getBlindIndex('123-45-6789', 'contact_ssn_last_four').then(function (lastFour) {
        console.log("get blind indexes");
        console.log(lastFour);
        /* 2acb */
    });
  
    res.send(movie).status(200);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// const { MongoClient } = require("mongodb");
// // Replace the uri string with your connection string.
// const uri = "mongodb+srv://surekha:surekha@cluster0.n0qoqkn.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri);
// async function run() {
//   try {
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { NINO : 'AL456789L' };
//     const movie = await movies.findOne(query);
//     // console.log(movies);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);