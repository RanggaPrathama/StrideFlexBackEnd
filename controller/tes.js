const token  = Math.random();

function login(username, cb){
    setTimeout(()=>{
        // return {username, token};
        cb({username,token});
    },2000)
}

function login(username){
    return {username,token}
}

function getUser(token, cb){
    setTimeout(()=>{
        if(token) cb({apikey:"12345"});
    },2000)
}

// CALLBACK
 login('RANGGA', (response)=>{
    const {token} = response;
    console.log(token);
    console.log(response)
    //const user = getUser(token)
    getUser(token,(response)=>{
        console.log(response)
    })
    //console.log(user)
})

// ASYNC AWAIT 
const user = login("rangga")

