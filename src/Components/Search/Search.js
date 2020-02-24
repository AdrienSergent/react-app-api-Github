import React from 'react';

function Search (props) {
  return (
    <div className="Search"> 
        <label> 
            <input onKeyUp={props.debounce(props.searchUser,400)}
            type="text" placeholder="Rechercher un utilisateur..."/>
        </label>
    
    </div>
  );
}

export default Search;
