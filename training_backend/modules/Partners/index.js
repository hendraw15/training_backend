const redisClient = require("../../database/Redis");
const Users = require("./models/Users");
const Product = require("./models/Product");
const Favorites = require("./models/Favorite");

module.exports = (router) => {
    router.get("/login",
        checkMiddleware2,
        async (req, res) => {
            let result = await global.models.Product.findOne({ where: { username: req.query.username, password: req.query.password } });
            if (result) {
                res.status(200).json({ token: "nurosoft" });
            } else {
                res.status(200).json({ msg: "Login gagal" });
            }
    });
    
    router.get("/partner",
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
            let users = await global.models.Users.findAll();
            res.status(200).json(users);
        });

    router.post("/partner", 
        checkMiddleware2,
        async (req, res) => {
        let body = req.body;
        try {
            await global.models.Users.create(body);
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.put("/partner", 
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
        let body = req.body;
        try {
            await global.models.Users.update(body, { where: { id: req.query.id } })
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.delete("/partner", 
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
        try {
            await global.models.Users.destroy({ where: { id: req.query.id } })
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.post("/product",
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
        let body = req.body;
        try {
            await global.models.Product.create(body);
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.get("/product",
        checkMiddleware2,
        async (req, res) => {
            let result = null
            if (req.query.name) {
                result = await global.models.Product.findOne({ where: { name: req.query.name } });
            } else {
                result = await global.models.Product.findAll();
            }
            res.status(200).json(result);
    });

    router.put("/product", 
        checkMiddleware,
        checkMiddleware2, 
        async (req, res) => {
        let body = req.body;
        try {
            await global.models.Product.update(body, { where: { id: req.query.id } })
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.delete("/product", 
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
        try {
            await global.models.Product.destroy({ where: { id: req.query.id } })
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })
    
    router.post("/favorite", 
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
        let body = req.body;
        try {
            await global.models.Favorites.create(body);
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.get("/favorite",
        checkMiddleware2,
        async (req, res) => {
            let result = null
            if (req.query.user_id) {
                result = await global.models.Favorites.findOne({ where: { user_id: req.query.user_id } });
            } else {
                result = await global.models.Favorites.findAll();
            }
            res.status(200).json(result);
    });

    router.put("/favorite", 
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
        let body = req.body;
        try {
            await global.models.Favorites.update(body, { where: { id: req.query.id } })
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.delete("/favorite", 
        checkMiddleware,
        checkMiddleware2,
        async (req, res) => {
        try {
            await global.models.Favorites.destroy({ where: { id: req.query.id } })
        } catch (error) {
            console.log(error);
        } finally {
            res.status(200).json({ result: "ok" });
        }
    })

    router.get("/redis", async (req, res) => {
        let body = req.body;
        let redis = await redisClient();
        await redis.set("test", body);
        res.json("ok")
    })

    router.get("/redis-get", async (req, res) => {
        let redis = await redisClient();
        let result = await redis.get("test");
        res.json(JSON.parse(result))
    })
}

function checkMiddleware(req, res, next) {
    let headers = req.headers;
    if (headers["authorization"] != "nurosoft") {
        return res.status(400).json({ error: "Belum login" });
    }

    next();
}

function checkMiddleware2(req, res, next) {
    console.log("berhasil check kedua");
    next();
}