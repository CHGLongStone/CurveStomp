//https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const {body, validationResult} = require('express-validator');

// TODO: BREAK RULES INTO SUBLISTS TO BAIL EARLY ON FAILURES, CONCAT ON RETURN

const ValidationRules = {};
ValidationRules.commcheck = () => {
    return [
        body('identity').exists(),
    ]
};

ValidationRules.get_profile = () => {
    return [
        body('unique_identifier')
            .exists()
            .not().isEmpty()
            .isInt({min: 0, max: 999999999999}),
        body('passcode')
            .exists()
            .not().isEmpty()
            .isLength({min: 6, max: 25}),
    ]
};

ValidationRules.create_profile = () => {
    return [
        body('identity.unique_identifier')
            .exists()
            .not().isEmpty()
            .isInt({min: 0, max: 999999999999}),
        body('identity.passcode')
            .exists()
            .not().isEmpty()
            .isLength({min: 6, max: 25}),
        body('location.country')
            .exists()
            .not().isEmpty()
            .isLength({max: 60}),
        body('location.region').exists().isLength({max: 60}),
        body('location.city')
            .exists()
            .not().isEmpty()
            .isLength({max: 60}),
        body('location.street_name')
            .exists()
            .not().isEmpty()
            .isLength({max: 150}),
        body('location.postal_code').exists().isLength({max: 10}),
    ]
};

ValidationRules.generate_id = () => {
    return [
        body().isEmpty()
    ]
};

ValidationRules.submit_report = () => {
    return [
        // Identification
        body('household.identity.unique_identifier').exists()
            .not().isEmpty()
            .isInt({min: 0, max: 999999999999}),
        body('household.identity.passcode').exists()
            .not().isEmpty()
            .isLength({min: 6, max: 25}),

        // Location Information
        body('household.location.country').exists()
            .not().isEmpty()
            .isLength({max: 60}),
        body('household.location.region').exists()
            .isLength({max: 60}),
        body('household.location.city').exists()
            .not().isEmpty()
            .isLength({max: 60}),
        body('household.location.street_name').exists()
            .not().isEmpty()
            .isLength({max: 150}),
        body('household.location.postal_code').exists()
            .isLength({max: 10}),

        // Basic Medical Statistics
        body('report.age').exists()
            .not().isEmpty()
            .isInt({min: 0, max: 999}),
        body('report.sex').exists()
            .not().isEmpty()
            .isIn(["M", "F"]),
        body('report.alias').exists()
            .isLength({max: 2}),

        // Symptom Related Data
        body('report.symptoms.m_symp_cough').exists()
            .not().isEmpty()
            .isInt({min: 0, max: 4}),
        body('report.symptoms.m_symp_breathing').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_walking').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_appetite').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_diarrhea').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_muscle_pain').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_fatigue').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_nose').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_throat').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_fever').exists()
            .not().isEmpty()
            .isFloat({min: 36, max: 43}),
        body('report.symptoms.m_symp_headache').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_dizziness').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_nausea').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_chills').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_general_pain').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.symptoms.m_symp_smell_loss').exists()
            .not().isEmpty()
            .isBoolean(),

        // Transmission Data
        body('report.transmission.m_trans_distance').exists()
            .not().isEmpty()
            .isInt({min: 0, max: 4}),
        body('report.transmission.m_trans_surface').exists()
            .not().isEmpty()
            .isInt({min: 0, max: 3}),
        body('report.transmission.m_trans_human').exists()
            .not().isEmpty()
            .isInt({min: 0, max: 3}),

        // Clinical Findings Data
        body('report.lab_results.m_lab_tested').exists()
            .not().isEmpty()
            .isInt({min: -1, max: 1}),
        body('report.lab_results.m_lab_hospitalized').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.lab_results.m_lab_hosp_days').exists()
            .not().isEmpty()
            .isInt(),
        body('report.lab_results.m_lab_hosp_icu').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.lab_results.m_lab_recovered').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.lab_results.m_lab_ventilation').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.lab_results.m_lab_oxygen').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.lab_results.m_lab_symptoms').exists()
            .isLength({max: 200}),
        body('report.lab_results.m_lab_pneumonia').exists()
            .not().isEmpty()
            .isBoolean(),
        body('report.lab_results.m_lab_antibodies').exists()
            .not().isEmpty()
            .isInt({min: -1, max: 1})
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