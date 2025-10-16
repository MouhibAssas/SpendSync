export function validate(schema) {
	return async (req, res, next) => {
		try {
			await schema.parseAsync({
				body: req.body,
				params: req.params,
				query: req.query
			})
			next()
		} catch (e) {
			res.status(400).json({ error: 'Validation failed', details: e.errors || String(e) })
		}
	}
}


