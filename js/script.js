

VK.init ({
	  apiId:6675732
});

function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
            	  resolve();
            } else {
            	  reject(new Error ('не удалось авторизоватсься'));
            }
        }, 2)
    });
}

auth().then(() => console.log('ok'));

function callAPI(method, params) {
  params.v = '5.8';

  return new Promise((resolve, reject) => {
      VK.api(method, params, (data) => {
          if (data.error) {
          	  reject(data.error);
          } else {
          	  resolve(data.response);
          }
      });
  });
}

auth()
    .then(() => {
    	 return callAPI('friends.get' , {fields: 'photo_50'});
    })
    .then(friends => {
    	console.log(friends);

    	const template = document.querySelector('#user-template').textContent;
    	console.log(template);

    	const render = Handlebars.compile(template);
    	console.log(render);

    	const renderFriends = render(friends.items);
    	console.log(renderFriends);

    	const vkFriendsList = document.querySelector('#vk-friends');
    	    	
    	vkFriendsList.innerHTML = renderFriends;
    })

