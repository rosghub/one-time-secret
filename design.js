// render EJS templates with mock data for page design

module.exports = () => {
    return (req, res, next) => {
        if (req.method == 'GET') {
            if (req.originalUrl == '/generate') {
                return res.render('generate', { link: 'link' });
            }
        }

        next();
    }
}