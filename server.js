const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
var urlEncodeParser = bodyParser.urlencoded({extended: true});
const {MongoClient, ServerApiVersion} = require("mongodb");
const uri =
    "mongodb+srv://gironserlio:SerlioUX@clusterserlio.imnmxjz.mongodb.net/?retryWrites=true&w=majority";

app.use(urlEncodeParser);

let port = 3000;
app.listen(port, () => {
    console.log("SERVIDOR EJECUTANDOSE BIEN EN EL PUERTO", port);
});

console.log("esta linea esta despues del .listen");

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        await client.db("admin").command({ping: 1});
        console.log(
            "Pinged your deploymen. You successfully connected to MongoDB!"
        );
    } catch {
        console.log("no se pudo conectar");
    } finally {
        await client.close();
    }
}

run().catch(console.dir());

app.post("/createPost", async (req, res) => {
    console.log("--- Create Post --- ");
    try {
        const client = new MongoClient(uri);
        const database = client.db("insertDB");
        const post = database.collection("Post");
        const docbody = req.body;
        const doc = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            correo: req.body.correo,
            password: req.body.password,
        };
        const result = await post.insertOne(docbody);
        res.status(200).send(
            `se creo exitosamente el usuario con create post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se creo el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});

app.put("/editPost", async (req, res) => {
    try {
        const client = new MongoClient(uri);
        const database = client.db("insertDB");
        const post = database.collection("Post");

        const filter = {
            id: req.body.id,
        };

        const updateDoc = {
            $set: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo,
                password: req.body.password,
            },
        };

        const result = await post.updateOne(filter, updateDoc);

        res.status(200).send(
            `se actualizo exitosamente el usuario con edit post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se edito el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});

app.delete("/deletePost", async (req, res) => {
    try {
        const client = new MongoClient(uri);
        const database = client.db("insertDB");
        const post = database.collection("Post");

        const query = {id: req.body.id};
        const result = await post.deleteOne(query);

        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            console.log("No documents matched the query. Deleted 0 documents.");
        }

        res.status(200).send(
            `se elimino el usuario con delete post ${result}`
        );
    } catch (error) {
        res.status(500).send("no se elimino el usuario");
        console.log(error);
    } finally {
        await client.close();
    }
});

app.get("/listPost", async (req, res) => {
    try {
        const client = new MongoClient(uri);
        const database = client.db("insertDB");
        const post = database.collection("Post");

        const query = {};
        const options = {
            // sort: {nombre: 1},
            projection: {id: 0, nombre: 1, apellido: 1},
        };
        const cursor = post.find();

        if ((await post.countDocuments()) === 0) {
            console.log("No documents found!");
            res.status(200).send(`no se encontraron docuemntos`);
        }

        let arr = [];
        // Print returned documents
        for await (const doc of cursor) {
            // console.dir(doc);
            arr.push(doc);
        }
        res.status(200).send({
            documentos: arr,
        });
        // console.log(`hay ${await post.countDocuments()} documentos`);
    } catch (error) {
        res.status(500).send("no se pudo leer");
        console.error(error);
    } finally {
        await client.close();
    }
    // run().catch(console.dir);
});

app.post("/createUser", (req, res) => {
    console.log("recibi una peticion PUT");
    res.status(200).send("se creo que usuario exitosamente");
});

app.get("/Get", (req, res) => {
    console.log("recibi una peticion GET");
    console.log("hola haciendo un get");
    res.status(200).send({
        nombre: "serlio",
        apellido: "giron",
        dorsal: "11",
    });
});

app.get("/getfile", (req, res) => {
    console.log("el parametro del body es: ", req.body.mensaje);
    // console.log('recibi una peticion GET REGRESA HTML');
    res.status(200).sendFile(path.join(__dirname + "/index.html"));
});

app.put("/MiPrimerPut", (req, res) => {
    console.log("recibi una peticion PUT");
    res.status(200).send("HOLA DESDE EL SERVER - put");
});

app.delete("/delete", (req, res) => {
    console.log("recibi una peticion PUT");
    res.status(200).send("delete user");
});

app.post("/createUser", (req, res) => {
    console.log("recibi una peticion PUT");
    res.status(200).send("se creo que usuario exitosamente");
});

// app.get('/', function (req, res) {
//   res.send('Hello World')
// })

// app.listen(3000)
