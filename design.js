// render EJS templates with mock data for page design

module.exports = () => {
    return (req, res, next) => {
        if (req.method == 'GET') {
            if (req.originalUrl == '/generate')
                return res.render('generate', { link: 'link' });
            else if (req.originalUrl.startsWith('/view'))
                return res.render('secret', { secret: 'secret', userPass: true, link: '/view/1234' });
        }

        next();
    }
}