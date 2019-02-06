const getElement = function(selector) {
    return document.querySelector(selector);
  };
  

  const sendAjaxRequest = function(method,url,callBack,reqBody,asyn=true){
    let ajax = new XMLHttpRequest();
    ajax.onload=callBack;
    ajax.open(method,url,asyn);
    if(reqBody){
      ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      return ajax.send(reqBody);
    }
    ajax.send();
};
  
  
const setClickListener = function(selector,listener) {
    let element = getElement(selector);
    if(element){
      element.onclick = listener;
    }
};


const handleServerResponse = function(responseText){
    let allUsers = responseText['users'];
    // console.log(responseText);
    getElement("#user").value = "";  
    renderUsers(allUsers);
  }
  

const addAndShowAllUser = function(){
    return sendAjaxRequest('POST','/add_user',function(){
        handleServerResponse(JSON.parse(this.responseText));
    },`username=${getElement("#user").value}`);
  };


  const renderUsers = function(users) {
    let line = "<br/><br/>----------------------<br/>";
    let usersToShow = [];
    users.reverse().forEach((user, index) => {
        usersToShow.push([`${index+1}: ${user["user_name"]}`])
    });
    usersToShow = usersToShow.join(line);
    console.log(usersToShow);
    getElement("#users").innerHTML = usersToShow;
  };
  

  const showUsers = function(){
    return sendAjaxRequest('GET','/users',function(){
        let response = JSON.parse(this.responseText)['users'];
        renderUsers(response);
      })
  };

  const load = function(){
    showUsers();
    intervalId = setInterval(showUsers, 5000);
    setClickListener("#submitButton",addAndShowAllUser)
  }


  window.onload = load;




