const carsModel=require('../models/carsModel')
module.exports.getcars = async (req, res) => {

    // if (req.permissions.indexOf('view-cars') === -1) {
    //     return res.send({ code: 401, message: 'Unauthenticated' })
    // }

    const _data = await carsModel.find({})
    if (_data) {
        return res.send({ code: 200, message: 'success', data: _data })
    } else {
        return res.send({ code: 500, message: 'Service error' })
    }
}


module.exports.getcarsById = async (req, res) => {
    // if (req.permissions.indexOf('view-car') === -1) {
    //     return res.send({ code: 401, message: 'Unauthenticated' })
    // }
    let data = await carsModel.findById(req.params.id)
    if (data) {
        res.send({ code: 200, message: 'fetch by id success', data: data })
    } else {
        res.send({ code: 500, message: 'Server Err.' })
    }
}


// module.exports.addcars = async (req, res) => {

//     console.log(req.file, req.body, 16)
//     try {
//         const carname = req.body.title
//         const description = req.body.description
//         const imageUrl = req.file.path
//         if (!title || !description || !imageUrl) {
//             return res.send({ code: 400, message: 'Bad Request' })
//         }

//         const newService = new carsModel({ carname: title, description: description , imageUrl : imageUrl })

//         const success = await newService.save()

//         if (success) {
//             return res.send({ code: 200, message: 'add success', })
//         } else {
//             return res.send({ code: 500, message: 'Service error' })

//         }
//     }
//     catch (err) {
//         res.send({ code: 500, message: 'Internal Server Err.' })
//     }

// }


module.exports.addcars = async (req, res) => {

    console.log(req.body, "5")
    // if (req.permissions.indexOf('add-car') === -1) {
    //     return res.send({ code: 401, message: 'Unauthenticated' })
    // }

    const newcar = new carsModel(req.body)
    const isSaved = await newcar.save()
    if (isSaved) {
        res.send('saved')
    } else {
        res.send('fail to save')
    }

}


module.exports.editcar = async (req, res) => {
    console.log(req.body, 31)
    // if (req.permissions.indexOf('edit-car') === -1) {
    //     return res.send({ code: 401, message: 'Unauthenticated' })
    // }
    let newData = {}

    if (req.body.carname) {
        newData["carname"] = req.body.carname
    }
    if (req.body.url) {
        newData["url"] = req.body.url
    }
    if (req.body.description) {
        newData["description"] = req.body.description
    }
    if (req.body.price) {
        newData["price"] = req.body.price
    }
  

    const id = req.body.id
    let filter = { _id: id }

    let doc = await carsModel.findOneAndUpdate(filter, newData, { new: true });
    if (doc) {
        res.send({ code: 200, message: 'edit success', data: doc })
    } else {
        res.send({ code: 500, message: 'Server Err.' })
    }
}


module.exports.deletecars = async (req, res) => {

    console.log(req.body, "73")
    // if (req.permissions.indexOf('delete-cars') === -1) {
    //     return res.send({ code: 401, message: 'Unauthenticated' })
    // }
    const ids = req.body
    const response = await carsModel.deleteMany({ _id: { $in: ids } })
    if (response) {
        res.send({ code: 200, message: 'delete success', data: response })
    } else {
        res.send({ code: 500, message: 'Server Err.' })
    }
}

