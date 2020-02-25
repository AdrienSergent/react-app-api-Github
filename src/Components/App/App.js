import React, { Component } from 'react'; 

// IMPORT COMPONENTS 
import Search from '../Search/Search'; 

// IMPORT CSS 
import './App.css'; 


class App extends Component { 

  constructor(props) { 
    super(props); 
    this.state = {
      users: []  
    }
  } 

  getUsersAsync = async (value) => {
    
    let myHeaders = new Headers(); 
    
    let myInit = { 
      method: 'GET', 
      headers: myHeaders, 
      mode: 'cors', 
      cache: 'default'
    }; 
    try{
      let response = await fetch(`https://api.github.com/search/users?q=${value}`, myInit);
      console.log(response);
      return response.json();
    }catch(err){
      console.error(err);
    }
  }

  // La fonction debounce a pour rôle de limiter le nombre de requêtes inutiles envoyées à l'API 
  debounce = (callback, delay) => {
    let timer = null
    return function() {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() { callback.apply(context, args) }, 
          delay
          );
    }
  }


  searchUser = async () => { 
    // Définition des valeurs par défaut si l'utilisateur n'a rien saisi
    let response;
    let errors = null;
    // selection elt div.result
    let result = document.querySelector('.result');  
    // récuperation de la valeur du champ
    let targetValue = document.querySelector('input').value; 
    

    // 1 je fais la requête à l'API et je charge la reponse dans response
    if(targetValue.trim().length>0) {
      response = await this.getUsersAsync(targetValue);
      if(response.errors) {
        errors = response.errors;
      }
    }

    // 2 je peux modifier le state une fois que response est chargée
    if(errors === null && response !== undefined) {
      this.setState({users:response.items});
    }
    else {
      this.setState({users:[]});
    }
    

    // 3 je prévois le cas où il n'y a aucun résultat trouvé  
    if( this.state.users.length == 0) {
      result.innerHTML = 'Aucun résultat';
    }
    else {
      result.innerHTML = ''; 

      // 4 On utilise map pour afficher le résultat de tous les utilisateurs correspondant 
      this.state.users.map( function(user) {  
          if(user) { 

            let userURL = user.url.replace('api.', '') 
            let url = userURL.replace('users/', '');  
            console.log(userURL, url)

            result.innerHTML +=  `
            <div class="card"> 
              <a href="${url}"> 
              <img src="${user.avatar_url}">
              <span>${user.login}</span> 
              </a> 
            </div>
              `; 
          }
        }) 
      }
  }
    
  render() {
  return (
    <div className="App">
      <Search searchUser={this.searchUser} debounce={this.debounce}/> 
      <div className="result"> 
      Users 
      </div> 
    </div>

  );
} 
}

export default App;
