const schemeModel = require("./scheme-model")

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  //console.log('checkSchmeId ID', req.params.scheme_id)
  schemeModel
    .find()
    .then(schemes => {
      const foundScheme = schemes.find(scheme => scheme.scheme_id == req.params.scheme_id)
      console.log('schemes', foundScheme)
      if (!foundScheme) {
        res.status(404).json({ message: `scheme with scheme_id ${req.params.scheme_id} not found` })
      } else {
        req.scheme = schemes;
        next()
      }
    })
  // .catch(() => {
  //   res.status(500).json({ message: "error" });
  // })

}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {

}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
