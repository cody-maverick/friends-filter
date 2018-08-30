// Инициализация

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

// Аутентификация

auth().then(() => console.log('ok'));

function callAPI(method, params) {
  params.v = '5.76';

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

// Шаблон

 const template = `
     {{#each items}}
     <li class="list__item">
     <div><img src="{{photo_50}}"></div>
     <div class="name">{{first_name}} {{last_name}}</div>
     <div class="plus"></div>
     </li>
     {{/each}}
    `;

// Запрос списка друзей

auth()
    .then(() => {
    	 return callAPI('friends.get' , {fields: 'photo_50'});
    })
    .then(friends => {    	
    	  const render = Handlebars.compile(template);
    	  const renderFriends = render(friends);
    	  const vkFriendsList = document.querySelector('#vk-friends');    	    	
    	  vkFriendsList.innerHTML = renderFriends;
    })

// Добавление и удаление друзей из второго списка

let lists = document.querySelectorAll('.list');

lists.forEach((list) => {
    list.addEventListener('click', (e) =>{
        let target = e.target;
        let targetNode = target.parentNode;

        if (target.classList.value === 'plus') {
            lists[1].insertBefore(targetNode, lists[1].firstChild);
            target.classList.remove('plus');   
            target.classList.add('delete');     
        } else if (target.classList.value === 'delete') {
            lists[0].insertBefore(targetNode, lists[0].firstChild);
            target.classList.remove('delete');   
            target.classList.add('plus');
        } 
    })  
});

// Cостветствие

function isMatching(full, chunk) {
    let fullLower = full.toLowerCase();
    let chunkLower = chunk.toLowerCase();

    if (fullLower.includes(chunkLower)) {
        return true;
    } else {
        return false;
    }
}

// Поиск по спискам

let input = document.querySelectorAll('.input');

input[0].addEventListener('keyup', (e) => {
    let leftLis = document.querySelectorAll('#vk-friends .list__item'), 
        target = e.target;

    leftLis.forEach((item) =>{
        let name = item.children[1].outerText;

        if ((isMatching(name, target.value))) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    })
});








