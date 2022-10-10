
const Response = {
    error(error, message='error') {
        return { success: false, message, error }
    },

    success(data, message='success') {
        return { success: true, message, data }
    }
}

function fileUpload() {

}


function time() {
    return Math.floor(Date.now() / 1000)
}



const kmToMt = function(km){
    return km * 1000;
};

const mtToKm = function(m){

    console.log(m)

    return m / 1000;
};

module.exports = {
    Response,
    time,
    kmToMt,
    mtToKm
}