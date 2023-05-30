'use strict';

window.addEventListener('DOMContentLoaded', function() {

	//Калькулятор
	let persons = document.querySelectorAll('.counter-block-input')[0], //поле "количество людей" - вводит пользователь
        restDays = document.querySelectorAll('.counter-block-input')[1], //поле "на сколько дней" - вводит пользователь
        place = document.getElementById('select'), //поле "Выберите базу" - выбирает пользователь из drop-down 
        totalValue = document.getElementById('total'), //поле для вывода результатов подсчета стоимости тура
        personsSum = 0, //переменная, в которую записывается то, что ввел пользователь в поле "количество людей"
        daysSum = 0, //переменная, в которую записывается то, что ввел пользователь в поле "на сколько дней"
        total = 0; //переменная для хранения результатов подсчета стоимости тура

        totalValue.innerHTML = 0; //устанавливаем начальное значение итоговой стоимости на 0

        //навешиваем обработчик событий на ввод чего-либо в поле "количество людей"
        persons.addEventListener('change', function() { //используем обычную функцию, тк далее будем использовать this
            personsSum = +this.value; //записываем в переменную число, введенное пользователем
            if (personsSum == null || personsSum <= 0 || daysSum == null || daysSum <= 0) {
                total = 0;
                totalValue.innerHTML = 0;
            } else {
                total = (daysSum + personsSum)*800;
                totalValue.innerHTML = total;
            }
        });

         //навешиваем обработчик событий на ввод чего-либо в поле "на сколько дней"
        restDays.addEventListener('change', function() { //используем обычную функцию, тк далее будем использовать this
            daysSum = +this.value; //записываем в переменную число, введенное пользователем
            total = (daysSum + personsSum)*800;

            //если пользователь не ввел количество людей, то будет отображаться ноль в поле Общая сумма
            
            if (personsSum == null || personsSum <= 0 || daysSum == null || daysSum <= 0) {
                total = 0;
                totalValue.innerHTML = 0;
            } else {
                total = (daysSum + personsSum)*800;
                totalValue.innerHTML = total;
            }
        });

         //навешиваем обработчик событий на выбор одной из опций баз отдыха
        place.addEventListener('change', function() {

            //если пользователь не ввел либо количество людей, либо количество дней, то будет отображаться ноль в поле Общая сумма
            if (restDays.value == '' || persons.value == '') {
                totalValue.innerHTML = 0;
            } else {
                let a = total; //используем локальную переменную a, чтобы при изменении базы отдыха total не суммировалась
                totalValue.innerHTML = a * this.options[this.selectedIndex].value; //умножаем "локальный" total на значение атрибута value тега select, соответствующего выбранному пункту базы отдыха
            }
        });

		//Modal

		let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function() {
        overlay.style.display = "block";
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden'; //замораживает модальное окно на странице + строка "unfreeze" снимает
    });

    close.addEventListener('click', function() {
        overlay.style.display = 'none';
        more.classList.remove('more-splash');
        document.body.style.overflow = ''; //unfreeze
    });

    let moreTabs = document.querySelectorAll('.description-btn');

    moreTabs.forEach(function(elem) {
        elem.addEventListener('click', function() {
            overlay.style.display = "block";
            this.classList.add('more-splash');
            document.body.style.overflow = 'hidden';
        });
    });

    //Form

    //создаем объект для сообщений
    let message = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    let form = document.querySelector('.main-form'), //форма из модального окна
        input = form.getElementsByTagName('input'), //инпуты в этой форме
        statusMessage =  document.createElement('div'); //создаем новый элемент, в который будем выводить сообщения для пользователя

        statusMessage.classList.add('status');  //добавляем этому диву класс для стилизации
    
    form.addEventListener('submit', function(event) {
        event.preventDefault;
        form.appendChild(statusMessage); //добавляем созданный <div> в форму, сюда будем выводить сообщение для пользователя

        let request = new XMLHttpRequest();//создаем XMLHttp запрос 
        request.open('POST', 'server.php');//настраиваем XMLHttp запрос 
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); //настраиваем заголовки  XMLHttp запроса 

        var formData = new formData(form);//получить данные, введенные пользователем

        //преобразовываем объект formData в обычный объект
        let obj = {};
        formData.forEach(function(value, key) {
            obj[key] = value; //теперь в переменной obj находятся все данные, которые ввел в форму пользователь
        });
        let json = JSON.stringify(obj); //преобразуем полученные данные из формы в JSON формат

        request.send(formData);//отправить запрос на сервер, указав в body запроса объект formData
        //request.send(formData); //если отправляем данные из формы как JSON объект

        //выводим сообщение пользователю, успешно ли отправлена форма
        request.addEventListener('readystatechange', function() {
            if (request.readyState < 4) { //если идет загрузка (статус запроса 0-3)
                statusMessage.innerHTML = message.loading; //в <div> помещаем сообщение из объекта message по ключу loading  
            } else if(request.readyState === 4 && request.status == 200) {  //если запрос успешно отправлен (статус запроса = 4 и сервер ответил кодом 200 (ОК))
                statusMessage.innerHTML = message.success; //в <div> помещаем сообщение из объекта message по ключу success
            } else {
                statusMessage.innerHTML = message.failure; //в <div> помещаем сообщение из объекта message по ключу failure
            }
        });
            //очищаем форму после отправки
            for (let i = 0; i < input.length; i++) {
                input[i].value = ''; //присваиваем пустую строку в value каждому инпуту формы
            }
    });
});

