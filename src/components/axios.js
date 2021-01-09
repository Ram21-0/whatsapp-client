import axios from "axios"

const instance = axios.create( {
    baseURL: "https://apna-whatsapp.herokuapp.com/"
})

export default instance