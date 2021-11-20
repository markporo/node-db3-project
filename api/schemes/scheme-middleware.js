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
      const foundScheme = schemes.find(scheme => scheme.scheme_id === Number(req.params.scheme_id))
      //console.log('schemes', foundScheme)
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
  if (!req.body.scheme_name.trim()) {
    res.status(400).json({ message: "invalid scheme_name" })
  } else if (req.body.scheme_name === '') {
    res.status(400).json({ message: "invalid scheme_name" })
  } else if (typeof req.body.scheme_name !== "string") {
    res.status(400).json({ message: "invalid scheme_name" })
  } else {
    next()
  }
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
  if (!req.body.instructions || req.body.instructions === '' || typeof req.body.instructions !== 'string') {
    res.status(400).json({ message: "invalid step" })
  } else if (req.body.step_number < 1 || typeof req.body.step_number !== "number") {
    res.status(400).json({ message: "invalid step" })
  } else {
    next()
  }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
