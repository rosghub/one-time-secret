// render EJS templates with mock data for page design

module.exports = () => {
    return (req, res, next) => {
        if (req.method == 'GET') {
            if (req.originalUrl == '/generate')
                return res.render('generate', { link: 'link' });
            else if (req.originalUrl.startsWith('/view'))
                //return res.render('secret', { secret: 'this is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secret' });
                return res.render('secret', { secret: 'true', spoiler: true });
                //return res.render('decrypt', { link: '/view/1234', wrongPass: true });
        }

        next();
    }
}