const db = require('../../data/db-config');

function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */

  //MY ORIGINAL ANSWER:::
  // return db('schemes as sc').leftJoin('steps', 'sc.scheme_id', '=', 'steps.scheme_id')
  //   .select('sc.scheme_id', 'sc.scheme_name')
  //   .count('steps.step_id', { as: 'number_of_steps' }) // can be just .count('steps.step_id as 'number_of_steps')
  //   .groupBy('sc.scheme_id')
  //   .orderBy('sc.scheme_id', 'asc')

  //ZAC LESSSON ---------------*******************
  // order is important
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .groupBy('sc.scheme_id')
    .select('sc.*')
    .count('st.step_id as number_of_steps')
    .orderBy('sc.scheme_id', 'asc')

}


async function findById(scheme_id) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.
    

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */

  // CODE THAT I TRIED TO REMEDY THE EMPTY ARRAY WITH
  // return db('schemes').leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
  //   .where({ 'schemes.scheme_id': scheme_id }) //.where( schemes.scheme_Id, scheme_id) should work the same. 
  //   //.groupBy('schemes.scheme_id')
  //   .select('steps.*', 'schemes.scheme_name', 'schemes.scheme_id')
  //   .orderBy('steps.step_number', 'asc')
  //   .then(arrayObtained => {
  //     let newArray = arrayObtained.map(each => {
  //       let Obj;
  //       let stepsArray = []


  //       if (each.step_id === '' || each.step_id === null) {
  //         console.log(each.scheme_id, 'each.scheme_id')
  //         Obj = {
  //           "scheme_id": each.scheme_id,
  //           "scheme_name": each.scheme_name,
  //           "steps": []
  //         }
  //       } else {
  //         Obj = {
  //           "scheme_id": each.scheme_id,
  //           "scheme_name": each.scheme_name,
  //           "steps": stepsArray.push({
  //             "step_id": each.step_id,
  //             "step_number": each.step_number,
  //             "instructions": each.instructions,
  //           })
  //         }
  //       }
  //       return Obj;
  //     })
  //     return newArray;
  //   })


  ////CODE THAT I DID FIRST THAT RETURNED EMPTY STEPS IN [[]]
  // return db('schemes').leftJoin('steps', 'schemes.scheme_id', '=', 'steps.scheme_id')
  //   .where({ 'schemes.scheme_id': scheme_id })
  //   .orderBy('steps.step_number', 'asc')
  //   .then(arrayObtained => {
  //     let arrayOfSteps = arrayObtained.map(each => {
  //       let stepObj =
  //       {
  //         "step_id": each.step_id,
  //         "step_number": each.step_number,
  //         "instructions": each.instructions,
  //       }
  //       if (each.step_id === '' || each.step_id === null) {
  //         return []
  //       } else {
  //         return stepObj;
  //       }
  //     })
  //     let dumbObj = {
  //       "scheme_id": Number(scheme_id),
  //       "scheme_name": arrayObtained[0].scheme_name,
  //       "steps": arrayOfSteps,
  //     }
  //     return dumbObj;
  //   })

  //ZAC LESSON _____******************************************
  const fullSchemes = await db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number', 'asc')

  // error handling 
  if (!fullSchemes.length) return null

  const scheme = {
    "scheme_id": +scheme_id, // plus sign forces it ot be a number
    "scheme_name": fullSchemes[0].scheme_name,
    "steps": [],
  }

  // if there are steps => steps array
  fullSchemes.forEach(step => {
    scheme.steps.push({
      "step_id": step.step_id,
      "step_number": step.step_number,
      "instructions": step.instructions,
    })
  });

  return { ...scheme, steps: scheme.steps.filter(st => st.step_id) }; // spread operator that overwrites steps with...
  // filter method...says filter everything that has a step.id...if no step id then leave steps like it was
}

async function findSteps(scheme_id) { // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
  const fullStepObj = await db('schemes')
    .leftJoin('steps', 'schemes.scheme_id', '=', 'steps.scheme_id')
    .select('steps.step_id', 'steps.step_number', 'steps.instructions', 'schemes.scheme_name')
    .where({ 'schemes.scheme_id': scheme_id })
    .orderBy('steps.step_number', 'asc')

  console.log(fullStepObj[0].step_id, "step_id")

  if (fullStepObj[0].step_id === null) {
    return [];
  } else {
    return fullStepObj;
  }


}

//GUIDED********doesn't quite work though
// const rows = await db('schemes as sc')
//   .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
//   .select('st.step_id', 'st.step_number', 'instructions', 'sc.scheme_name')
//   .where('sc.scheme_id', scheme_id)
//   .orderBy('steps.step_number', 'asc')

// if (!rows(0).step_id) return []
// return rows


async function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  console.log(scheme)
  const [scheme_id] = await db('schemes').insert(scheme, "id");
  return findById(scheme_id)
}

async function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
  // let combinedObj = {
  //   "step_id": ,
  //   "step_number": 2,
  //   "instructions": "profit",
  //   "scheme_name": "Get Rich Quick"
  // }

  const stepsWithID = { ...step, scheme_id }
  console.log(step, "step from add step")
  await db('steps').insert(stepsWithID)

  //console.log(step_id, "step_id from add step")
  return findSteps(scheme_id)
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
