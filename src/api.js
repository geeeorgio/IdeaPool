import config from './config';
import { 
  getTokens,
  setTokens, 
  removeTokens       
} from './tokens';

const userSignUp = (userData,cb) => {
  let reply = {res:'', err:''};
  let json = JSON.stringify(userData);  
 
  let xhr = new XMLHttpRequest();
  xhr.open("POST", config.API_URL + '/users');
  xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    
  xhr.onload = function () {
    let user = JSON.parse(xhr.responseText);
      if (xhr.readyState === 4 && xhr.status === 201) {
        reply.res = user;        
        cb(reply)     
      }  else {
        reply.err = user.reason;
        cb(reply)
      }  
  }  
  xhr.send(json);
} 

const userLogIn = (userData,cb) => {
  let reply = {res:'', err:''}
  let json = JSON.stringify(userData);
 
  let xhr = new XMLHttpRequest();
  xhr.open("POST", config.API_URL + '/access-tokens')
  xhr.setRequestHeader("Content-Type", "application/json")

  xhr.onload = () => {
  const user = JSON.parse(xhr.responseText)
    if (xhr.readyState === 4 && xhr.status === 201) {
      reply.res = user;
      cb(reply)     
    } else {
      reply.err = user.reason;
      cb(reply)
    }
  }
  xhr.send(json)
}

const userLogOut = (callback) => {
  let token = getTokens();
  let json = JSON.stringify(token.refresh_token);
  
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", config.API_URL + '/access-tokens')
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.setRequestHeader('X-Access-Token', token.jwt)

  xhr.onload = () => {
  const user = JSON.parse(xhr.responseText)	
    if (xhr.readyState === 4 && xhr.status === 204) {
      callback(user);       
    }
  }  
  xhr.send(json) 
}

const currentUser = (token,cb) => { 
  let reply = {res:'', err:''};
  let x = { refresh_token: token.refresh_token }  
   
  let xhr = new XMLHttpRequest();
  xhr.open("GET", config.API_URL + "/me")
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.setRequestHeader("X-Access-Token", token.jwt)

  xhr.onload = () => {    
    const data = JSON.parse(xhr.responseText)             
      if (xhr.readyState === 4 && xhr.status === 200) {        
        reply.res = data;
        cb(reply)      
      } else if (xhr.readyState === 4 && xhr.status === 401) {
        refreshToken(x, (newToken) => currentUser(newToken,cb))
      } else {
        reply.err = data;
        cb(reply)
      }           
  }  
  xhr.send(null)   
}

const refreshToken = (token,cb) => {   
  let json = JSON.stringify(token)

  let xhr = new XMLHttpRequest();
  xhr.open("POST", config.API_URL + '/access-tokens/refresh')
  xhr.setRequestHeader("Content-Type", "application/json")

  xhr.onload = () => {
  const user = JSON.parse(xhr.responseText)	
    if (xhr.readyState === 4 && xhr.status === 200) {
      let newToken = { jwt: '', refresh_token: '' }
      newToken.jwt = user.jwt;
      newToken.refresh_token = token.refresh_token;      
      setTokens(newToken)
      cb(newToken)      
    } else {
      removeTokens();
    }
  }
  xhr.send(json)  
}

const createIdea = (parameters,cb) => {
  let token = getTokens();
  let x = { refresh_token: token.refresh_token }
  let reply = {res:'', err:''};
  let json = JSON.stringify(parameters)
 
  let xhr = new XMLHttpRequest();
  xhr.open("POST", config.API_URL + '/ideas')
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.setRequestHeader("X-Access-Token", token.jwt)

  xhr.onload = () => {
  const param = JSON.parse(xhr.responseText)  
    if (xhr.readyState === 4 && xhr.status === 201) {
      reply.res = param;
      cb(reply)      
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      refreshToken(x, (refresh) => createIdea(parameters,cb) )  
    } else {
      reply.err = param;
      cb(reply);
    }
  }
  xhr.send(json) 
}

const deleteIdea = (id) => {
  let token = getTokens();
  let x = { refresh_token: token.refresh_token }; 
  let reply = {res:'', err:''};
  
  let xhr = new XMLHttpRequest();
  xhr.open("DELETE", config.API_URL + '/ideas/' + id)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.setRequestHeader("X-Access-Token", token.jwt)

  xhr.onload = () => {    
    if (xhr.readyState === 4 && xhr.status === 204) {
      reply.res = 'done'            
	  } else if (xhr.readyState === 4 && xhr.status === 401) {
      refreshToken(x, (refresh) => deleteIdea(id) )  
    } 
  }
  xhr.send(null)
}  

const updateIdea = (parameters,id,cb) => {
  let token = getTokens();
  let x = { refresh_token: token.refresh_token };
  let reply = {res:'', err:''};
  let json = JSON.stringify(parameters);

  let xhr = new XMLHttpRequest();
  xhr.open("PUT", config.API_URL + "/ideas/" + id)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.setRequestHeader("X-Access-Token", token.jwt)

  xhr.onload = () => {
  const param = JSON.parse(xhr.responseText)	      
    if (xhr.readyState === 4 && xhr.status === 200) {
      reply.res = param;
      cb(reply);      
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      refreshToken(x, (refresh) => updateIdea(parameters,id,cb) )  
    } else {
      reply.err = param;
      cb(reply)
    }
  }
  xhr.send(json)		
}

const pageOfIdeas = (page,cb) => {
  let token = getTokens();
  if (!token) { return }
  let x = { refresh_token: token.refresh_token }; 
  let reply = {res:'', err:''};
  let xhr = new XMLHttpRequest();

  xhr.open("GET", config.API_URL + "/ideas?page=" + page)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.setRequestHeader("X-Access-Token", token.jwt)

  xhr.onload = () => {
  const p = JSON.parse(xhr.responseText)      	
    if (xhr.readyState === 4 && xhr.status === 200) {
      reply.res = p;
      cb(reply)
    } else if (xhr.readyState === 4 && xhr.status === 401) {
      refreshToken(x, (refresh) => pageOfIdeas(page,cb) )  
    } else {
      reply.err = p
      cb(reply)
    }
  }  
  xhr.send(null)	
};

export {
  userSignUp,
  userLogIn,
  userLogOut,
  currentUser,
  refreshToken,
  createIdea,
  updateIdea,
  deleteIdea,
  pageOfIdeas,
};