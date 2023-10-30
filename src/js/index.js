const trigGer = document.querySelector('.trigger')
const Menu = document.querySelector('.menu')
var disPlay = document.querySelector('.display-block')



trigGer.addEventListener('click', checkShow)


function checkShow() {
    if(disPlay===null){
        Menu.classList.add('display-block')
        disPlay = document.querySelector('.display-block')
    }
    else {
        Menu.classList.remove('display-block')
        disPlay = document.querySelector('.display-block')
    }
    
}

