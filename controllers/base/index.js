module.exports.deleteCallback = (success, resource, res) => {
    if (success) {
        const message = `${resource} with id ${id} was deleted`
        return res.status(200).send({ message })
    }
    else throw new Error("Not Found")
}

module.exports.errorCallback = res => {
    const message = "Not Found"
    return res.status(404).send({ message })
}

module.exports.postCallback = (resource, res) => {
    return res.status(201).send(resource)
}

module.exports.getCallback = (resource, res) => {
    if (resource) return res.send(resource);
    else throw new Error("Not Found");
}

module.exports.postErrorCallback = res => {
    const message = "Cannot create resource"
    return res.status(500).send({ message })
}

module.exports.listCallback = (resources, res) => {
    return res.send(resources)
}

module.exports.listErrorCallback = res => {
    const message = "Something went Wrong"
    return res.status(500).send({ message })
}
