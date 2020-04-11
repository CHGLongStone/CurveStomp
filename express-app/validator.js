//https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const {body, validationResult} = require('express-validator');
const ValidationRules = {};
ValidationRules.commcheck = () => {
    return [
        body('identity').exists(),
    ]
};

ValidationRules.get_profile = () => {
    return [
        // body('identity').exists(),
        body('identity.unique_identifier')
            .exists()
            .not().isEmpty()
            .isInt({min: 0, max: 999999999999}),
        body('identity.passcode')
            .exists()
            .not().isEmpty()
            .isLength({min: 6, max: 25}),
        // body('location').exists(),
        body('location.country').exists().not().isEmpty(),
        body('location.region').exists(),
        body('location.city').exists().not().isEmpty(),
        body('location.street_name').exists().not().isEmpty(),
        body('location.postal_code').exists(),
    ]
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));
    return res.status(422).json({
        errors: extractedErrors,
    })
};

module.exports = {
    ValidationRules,
    validate,
};