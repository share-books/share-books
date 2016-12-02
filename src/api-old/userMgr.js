import wilddog from 'wilddog'
import api from './create-api'

export  function curUser(){
  return  wilddog.auth().currentUser
}
export   function logout(){
  return wilddog.auth().signOut()
}
export  async function createUser(phone,password){
   await wilddog.auth().createUserWithPhoneAndPassword(phone,password)
   let user =  wilddog.auth().currentUser
   let uid = `${user.uid}`
   await api.child(`user/${uid}`).set({phone:phone})
   console.log('createUser:',phone)
   return user
}

export async function login(phone,password){ 
  return wilddog.auth().signInWithPhoneAndPassword(phone,password)
}

export async function loginByEmail(email, password){ 
  return wilddog.auth().signInWithEmailAndPassword(email, password)
}

export async function updateEmail(email){ 
   let user = wilddog.auth().currentUser
   await user.updateEmail(email)
   let uid = `${user.uid}`
   await api.child(`user/${uid}`).update({email:email})
   return user
}
export async function updatePhone(phone){ 
  let user =  wilddog.auth().currentUser
  await user.updatePhone(phone)
  let uid = `${user.uid}`
  await api.child(`user/${uid}`).update({phone:phone})
  return user
}
export async function  updateProfile(displayName,photoUrl){ 
  let profile={
      'displayName': displayName,
      'photoURL': photoUrl
   }
   let user =  wilddog.auth().currentUser
   let uid = `${user.uid}`
   await api.child(`user/${uid}`).update(profile)
   await user.updateProfile(profile)

   return user
}
