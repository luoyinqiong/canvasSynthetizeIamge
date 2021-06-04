// import Vue from 'vue'
import axios from 'axios'

class HttpRequest {
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  request (options) {
    const instance = axios.create()
    return instance(options)
  }
  post$ (url, data = {}, pagingInfo = {}) {
    let requestOptions = {
      'header': {
        'pagingInfo': {
          'pageSize': 10,
          'pageNo': 1
        }
      },
      'payload': {}
    }
    let options = {
      url: url,
      data: requestOptions,
      method: 'post'
    }
    return this.request(options).then(res => res)
  }
}

export default HttpRequest
