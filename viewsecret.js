const { getSecret, deleteSecret } = require('./db');
const { decrypt } = require('./crypto');

async function viewSecret(req, res) {
    const { id } = req.params;

    const secret = await getSecret(id);
    await deleteSecret(id);

    res.render('secret', { secret });
}

module.exports = viewSecret;