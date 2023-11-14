const notFound = (req, res) => res.status(404).send(`Not found router for [${req.originalUrl}]`)

export default notFound;