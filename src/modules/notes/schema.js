const Joi =  require('joi');

const notesSchema = Joi.object().
    keys({
        title : Joi.string().required(),
        content : Joi.string().required(),
    })
    .options({ abortEarly: false });


module.exports = { notesSchema };