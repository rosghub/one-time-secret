// render EJS templates with mock data for page design

const s = 'this is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secretthis is a long secret';

module.exports = () => {
    return (req, res, next) => {
        if (req.method == 'GET') {
            if (req.originalUrl == '/generate')
                return res.render('generate', { link: 'link' });
            else if (req.originalUrl.startsWith('/view'))
                return res.render('secret', { secret: s });
        }

        next();
    }
}