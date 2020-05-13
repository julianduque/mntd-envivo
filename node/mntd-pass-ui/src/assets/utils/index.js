'use strict'
import axios from 'axios'

const endpoints = {
  auth: `http://${'localhost' || 'secrets.lab'}:8080/auth`,
  secrets: `http://${'localhost' || 'secrets.lab'}:8080/secrets`
}
const auth = async (username, password) => {
  let res = await axios.post(endpoints.auth, {
    username,
    password
  })
  return res
}
const getSecrets = async (username, token) => {
  let res = await axios.get(`${endpoints.secrets}/${username}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return res
}
const getValueSecret = async (username, name, token) => {
  let res = await axios.get(`${endpoints.secrets}/${username}/${name}`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  return res
}
const saveLocalStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}
const getItemStorage = key => JSON.parse(window.localStorage.getItem(key))

const utils = {
  auth,
  saveLocalStorage,
  getItemStorage,
  getSecrets,
  getValueSecret
}

export default utils
