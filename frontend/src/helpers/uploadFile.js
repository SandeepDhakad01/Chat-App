
// upload file on cloudinary from front end....

const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`



const uploadFile = async(file)=>{
    const formData = new FormData()
    formData.append('file',file)
    formData.append("upload_preset","chat-app-file")
  try{
    const response = await fetch(url,{
        method :'post',
        body : formData
    })

    const responseData = await response.json()

    console.log("resposeDatta => ",responseData)

    return responseData
}catch (err) {
    console.error('There was a problem with the upload operation:', err);
    throw err;
}
}

export default uploadFile