import axios from "axios";
import { BaseUrl } from "./constant";

const instance=axios.create({
    baseURL:BaseUrl
})


export default instance