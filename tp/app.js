const express = require('express');
const mongoose = require('mongoose');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


const port = 3000;
server.listen(port, () => {
    console.log("Server is listening on port ${port}");
});

mongoose.connect('mongodb://localhost:27017/produits', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connexion à la base de données réussie.');
    })
    .catch(() => {
        console.log('Connexion à la base de données échouée.');
    });

const produitSchema = mongoose.Schema({
    libelle: String,
    prix: Number,
    quantite: Number,
    designation: String,
});

const Produit = mongoose.model('Produit', produitSchema);

app.use(express.json());


// Create
app.post('/addproduit', (req, res) => {
    const { libelle, prix, quantite, designation } = req.body;
    const produit = new Produit({
        libelle,
        prix,
        quantite,
        designation,
    });
    produit.save()
        .then(() => {
            io.emit('notification', { message: 'Produit créé avec succès.' });
            res.status(201).json(produit);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la création du produit." });
        });
});

// Read
app.get('/Getproduits', (req, res) => {
    Produit.find()
        .then((produits) => {
            res.json(produits);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des produits." });
        });
});

// Update
app.put('/Updateproduit/:id', (req, res) => {
    const { id } = req.params;
    const { libelle, prix, quantite, designation } = req.body;
    Produit.findByIdAndUpdate(id, { libelle, prix, quantite, designation }, { new: true })
        .then((produit) => {
            if (!produit) {
                res.status(404).json({ message: "Produit non trouvé." });
            } else {
                io.emit('notification', { message: 'Produit mis à jour avec succès.' });
                res.json(produit);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour du produit." });
        });
});

// Delete
app.delete('/Deleteproduit/:id', (req, res) => {
    const { id } = req.params;
    Produit.findByIdAndDelete(id)
        .then((produit) => {
            if (!produit) {
                res.status(404).json({ message: "Produit non trouvé." });
            } else {
                io.emit('notification', { message: 'Produit supprimé avec succès.' });
                res.json({ message: "Produit supprimé avec succès." });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Une erreur s'est produite lors de la suppression du produit." });
        });


});


app.get('/getProductByLabel/:libelle', (req, res) => {

    const label = req.params.libelle;
    Produit.find({ libelle: label }, (err, produit) => {
        console.log(produit);

        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving product from database');
        } else if (!produit) {
            res.status(404).send("No product found with label ${label}");
        } else {
            // Emit a 'notification' event with the message to be sent
            io.emit('notification', { message:"Product with label ${label} retrieved" });

            res.send(produit);
        }
    });
});


app.get('/sortByField/:field', (req, res) => {
    const field = req.params.field;
    const sortOptions = {};

    sortOptions[field] = 1;

    Produit.find({}, (err, produits) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving products from database');
        } else if (!produits) {
            res.status(404).send('No products found in database');
        } else {
            // Emit a 'notification' event with the message to be sent
            io.emit('notification', { message: "Products sorted by ${field} "});

            produits.sort((a, b) => {
                if (a[field] < b[field]) {
                    return -1;
                } else if (a[field] > b[field]) {
                    return 1;
                } else {
                    return 0;
                }
            });

            res.send(produits);
        }
    }).sort(sortOptions);

});