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
     <li class="list__item" draggable="true">
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
          if (localStorage.stringifyB || localStorage.stringifyС) {
              let parseB = JSON.parse(localStorage.stringifyB);
              let parseC = JSON.parse(localStorage.stringifyC);

              parseB.forEach((item) => {                
                let fromLocalToDOM = `
                  <li class="list__item" draggable="true">
                  <div><img src="${item.photo}"></div>
                  <div class="name">${item.name}</div>
                  <div class="plus"></div>
                  </li>
                  `;
                let vkFriendsList = document.querySelector('#vk-friends');    
                vkFriendsList.innerHTML += fromLocalToDOM;
              })

              parseC.forEach((item) => {                
                let fromLocalToDOM = `
                  <li class="list__item" draggable="true">
                  <div><img src="${item.photo}"></div>
                  <div class="name">${item.name}</div>
                  <div class="delete"></div>
                  </li>
                  `;
                let vkFriendsList2 = document.querySelector('#vk-friends-choise');    
                vkFriendsList2.innerHTML += fromLocalToDOM;
              })
             
          }
          else {
              const render = Handlebars.compile(template);
              const renderFriends = render(friends);
              const vkFriendsList = document.querySelector('#vk-friends');              
              vkFriendsList.innerHTML = renderFriends;
          }
    	  
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

input[1].addEventListener('keyup', (e) => {
    let rightLis = document.querySelectorAll('#vk-friends-choise .list__item'), 
        target = e.target;

    rightLis.forEach((item) =>{
        let name = item.children[1].outerText;

        if ((isMatching(name, target.value))) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    })
});


// DnD

let uls = document.querySelectorAll('ul');

makeDnD([uls[0], uls[1]]);

function makeDnD(zones) {
    let currentDrag;

    zones.forEach((zone) => {
        zone.addEventListener('dragstart', (e) => {
            currentDrag = {source : zone, node: e.target};
        });

        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        zone.addEventListener('drop', (e) => {
            if (currentDrag) {
                e.preventDefault();               

                if (currentDrag.source !== zone) {
                    let switchClasses = currentDrag.node.lastElementChild.classList;

                    if (switchClasses.contains('plus')) {
                        switchClasses.add('delete');
                        switchClasses.remove('plus');
                    } else {
                        switchClasses.add('plus');
                        switchClasses.remove('delete');
                    }                      

                    if (e.target.classList.contains('list__item')) {                       
                        zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                    } else {
                        zone.insertBefore(currentDrag.node, zone.lastElementChild);
                    }
                }
            }

            currentDrag = null;
        });
    })
}


//  Cохранение списков в localStorage 

let saveLists = document.querySelector('.save_button');


function stringifyJson(list) {
    let childrenList = list.children;   
    let arrList = Array.from(childrenList);
    var b = [];

    arrList.forEach((item) => {        
        let a = {
            name: item.innerText,
            photo: item.children[0].childNodes[0].currentSrc
        };

        b.push(a);
          
    });

    let stringifyB = JSON.stringify(b);

    return stringifyB;       
}

saveLists.addEventListener('click', (e) => {   
    e.preventDefault();
    lists.forEach((item,i,lists) => {       
        if (item.id === 'vk-friends') {
            let stringifyB = stringifyJson(item);
            localStorage.setItem('stringifyB', stringifyB);
        }        
        if (item.id === 'vk-friends-choise') {
            let stringifyC = stringifyJson(item);
            localStorage.setItem('stringifyC', stringifyC);
        }      
    });
});