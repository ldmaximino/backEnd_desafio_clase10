export const productValidator = (req, res, next) => {
    if(!req.body.title) return res.status(404).json({msg: 'The title field is required'});
    if(!req.body.description) return res.status(404).json({msg: 'The description field is required'});
    if(!req.body.code) return res.status(404).json({msg: 'The code field is required'});
    if(!req.body.price) return res.status(404).json({msg: 'The price field is required'});
    if(!req.body.stock && req.body.stock !== 0) return res.status(404).json({msg: 'The stock field is required'});
    //La cantidad a ingresar a stock deber ser 0 o mayor (no puede ser negativo)
    if(req.body.stock < 0) return res.status(404).json({msg: 'The stock field must be greater than or equal to zero'});
    if(!req.body.category) return res.status(404).json({msg: 'The category field is required'});
    next();
}
