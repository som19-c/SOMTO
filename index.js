const express = require('express');
const app = express();

app.use(express.json());
const fs = require('fs');

const products = JSON.parse(fs.readFileSync('./data/products.json', 'UTF8'));




app.get ('/api/v1/products', (req,res) => {
 res.status(200).json({
    status: 'success',
    results: products.length,
    data:{
        products
    }
 });
});

app.get('/api/v1/products/:id', (req, res) => {
    console.log(req.params);
    const {id} = req.params;
 
    const singleProducts = products.find(product => product.id === Number(id));
 if (!singleProducts){
  return res.status(404).json({
    status: "fail",
    message: "Product not found"
  });
 }
    res.status(200).json({
        status: "success",
        data : {
            product: singleProducts
        }
    });

});

app.post('/api/v1/products', (req,res) => {

    console.log(req.body);
    const body = req.body;
    const newId = products.at(-1).id +1;
    const newProducts = {id:newId, ...body};
    products.push(newProducts);
    fs.writeFile('./data/products.json', JSON.stringify(products), err =>{
        if(err){
            return res.status(500).json({
                status: "error",
                message: "Could not save product"
            })
        }
        res.status(201).json({
    status: "success",
    data: {
        product: newProducts
    }
});
    })
})


     app.patch('/api/v1/products/:id', (req, res) => {
    const id = Number(req.params.id);
    const productToUpdate = products.find(product => product.id === id);

    if (!productToUpdate) {
        return res.status(404).json({
            status: "fail",
            message: `product with id ${id} not found`
        });
    }

    Object.assign(productToUpdate, req.body);
    fs.writeFile('./data/products.json', JSON.stringify(products), err => {
            return res.status(500).json({
                status: "error",
                message : "Could not update product data"
            });
        })
        res.status(200).json({
            status: "success",
            data: {
                product : productToUpdate
            }
        });
    });
  

  app.delete('/api/v1/products/:id', (req, res) => {
    const id = Number(req.params.id);

    const productExists = products.some(product => product.id === id);

    if (!productExists) {
        return res.status(404).json({
            status: "fail",
            message: `Product with id ${id} not found`
        });
    }

    const productIndex = products.findIndex(product => product.id === id);
    products.splice(productIndex, 1);

    fs.writeFile('./data/products.json', JSON.stringify(products), err => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Could not delete product data"
            });
        }
        res.status(204).json({
            status: "success",
            data: null
        });
    });
});

app.listen(8000, () =>{
    console.log(`server is running on port 8000`)
});