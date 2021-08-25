const express = require("express");
const router = express.Router();
const DB = require("../db/db");
const db = new DB();

let limit = 0;
router.get("/", async (req, res) => {
	res.json({ ok: "home" });
});

router.get("/authenticate/:key", async (req, res) => {
	switch (limit) {
		case 0:
			try {
				if (!req.headers.authorization) {
					return res.status(403).json({ error: "No credentials sent!" });
				} else if (
					req.headers.authorization != process.env.GETAUTH_AUTHORIZATION_HEADER
				) {
					return res.status(409).json({ error: "Wrong auth" });
				}
				// do all the db stuff here and whenever needed switch auth header from env var and keep it secret
				await db
					.findOne("key", `${req.params.key}`)
					.then(() => {
						// do something like activate it.
						limit += 1;
						res.status(200).json({ success: "license activated" });
					})
					.catch(() => {
						res.status(402).json({ error: "no key found" });
					});
				return;
				// start generating license and save in postgresql :p
			} catch (error) {
				console.error(error.message);
			}

		default:
			return res
				.status(419)
				.json({ error: "license already active, must deactivate first" });
	}
});

router.get("/deauthenticate/:key", async (req, res) => {
	switch (limit) {
		case 1:
			try {
				if (!req.headers.authorization) {
					return res.status(403).json({ error: "No credentials sent!" });
				} else if (
					req.headers.authorization !=
					process.env.GETDEAUTH_AUTHORIZATION_HEADER
				) {
					return res.status(409).json({ error: "Wrong auth" });
				}
				await db
					.findOne("key", `${req.params.key}`)
					.then(() => {
						// do something like activate it.
						limit -= 1;
						res.status(200).json({ success: "license deactivated" });
					})
					.catch(() => {
						res.status(402).json({ error: "no key found" });
					});
				return;
			} catch (error) {
				console.error(error.message);
			}
		default:
			return res.status(419).json({ error: "license already deactivated." });
	}
});

router.post("/authenticate", async (req, res) => {
	const { email, key } = req.body;
	try {
		if (!req.headers.authorization) {
			return res.status(403).json({ error: "No credentials sent!" });
		} else if (
			req.headers.authorization != process.env.POST_AUTHORIZATION_HEADER
		) {
			return res.status(409).json({ error: "Wrong auth" });
		}
		// do all the db stuff here and whenever needed switch auth header from env var and keep it secret

		await db.insert(email, key);
		return res
			.status(200)
			.json({ success: "You got through! Also if this isn't me i stg :/" });
	} catch (error) {
		console.error(error.message);
	}
});

// router.get("/youknow", async (req, res) => {
// 	return db.deleteAll();
// });

module.exports = router;
